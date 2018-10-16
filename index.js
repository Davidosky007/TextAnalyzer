const analyzeButton = $(".TextZone").find("form");
analyzeButton.on("submit", analyzeText);

const randomTextButton = $(".button-tools").find("button.RandomText");
randomTextButton.on("click", generateRandomText);

function generateRandomText(e) {
  $(".TextZone").find("textarea[name=user-text]")
    .val(`La virtualización es tecnología que permite crear múltiples entornos simulados o recursos dedicados desde un solo sistema de hardware físico. El software llamado "hipervisor" se conecta directamente con el hardware y permite dividir un sistema en entornos separados, distintos y seguros, conocidos como "máquinas virtuales" (VM). Estas VM dependen de la capacidad del hipervisor de separar los recursos de la máquina del hardware y distribuirlos adecuadamente. La virtualización le permite aprovechar al máximo sus inversiones anteriores.
    La máquina física original en que está instalado el hipervisor se llama "host", y las VM que utilizan estos recursos se llaman "guests". Los guests utilizan los recursos informáticos, como la CPU, la memoria y el almacenamiento, como un conjunto de medios que pueden redistribuirse fácilmente. Los operadores pueden controlar las instancias virtuales de la CPU, la memoria, el almacenamiento y demás recursos, para que los invitados reciban lo que necesiten cuando lo necesiten.
    Lo ideal es que todas las VM relacionadas se administren desde una sola consola de administración de virtualización basada en la web, que acelera todos los procesos. La virtualización le permite determinar cuánto poder de procesamiento, de almacenamiento y de memoria puede distribuir entre las VM. Además, los entornos están mejor protegidos, porque las VM están separadas entre sí, y son independientes del hardware de soporte.`);
}

function analyzeText(e) {
  e.preventDefault();
  const form = $(e.currentTarget);
  const text = form.find("textarea[name=user-text]");
  const progressBarContainer = form.parent().siblings(".progress");
  displayProgressBar(progressBarContainer);

  const timer = setInterval(() => {
    const progressBar = progressBarContainer.find("div.progress-bar");

    if (progressBar.width() >= progressBarContainer.width()) {
      progressBar
        .removeClass("bg-info progress-bar-striped")
        .addClass("bg-success")
        .text("DONE!");
      clearInterval(timer);
    } else {
      progressBar.width(progressBar.width() + 150);
    }
  }, 50);

  const types = [",", ".", ";", ":"];
  const words = text.val().split(/[\s]+/i);

  const wordsParsed = [];

  words.forEach(word => {
    wordsParsed.push(new Word(word.trim()));
    const lastCharacter = word.slice(-1);
    if (types.indexOf(lastCharacter !== -1)) {
      wordsParsed.push(new Word(lastCharacter));
    }
  });

  const displayZone = $(".DisplayZone").find("code > pre");

  for (word of wordsParsed) {
    displayZone.append(word.print(displayZone));
  }
}

function Word(word) {
  let punctuationSymbols = [",", ".", ";", ":"];

  this.word = word;
  this.length = function() {
    return this.word.length;
  };
  this.type =
    punctuationSymbols.indexOf(this.word) !== -1 ? "Punctuation" : "Word";

  this.print = function(container) {
    const htmlContainer =
      container instanceof jQuery ? container : $(container);
    htmlContainer.append(
      `<span>
      {
          word: ${this.word},
          length: ${this.length()},
          type: ${this.type}
       },</span>`.trim()
    );
  };
}

function displayProgressBar(container) {
  container.empty().append(`
    <div class="progress-bar progress-bar-striped progress-bar-animated bg-info" role="progressbar"
    aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">Working...</div>
</div>`);
}
