const MessagesZone = $(".MessagesZone");
const buttonTools = $(".ButtonTools");

const analyzeButton = $(".TextZone").find("form");
const randomTextButton = buttonTools.find("button.RandomText");
const downloadButton = buttonTools.find("a.DownloadJSON");

analyzeButton.on("submit", analyzeText);
randomTextButton.on("click", generateRandomText);
downloadButton.on("click", makeJSONDownloadable);

function makeJSONDownloadable(event = null) {
  console.log("me activo colega");
}

function enableDownloadButton(button) {
  button
    .removeClass("btn-secondary disabled")
    .addClass("btn-success")
    .css("cursor", "pointer");
}

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
  $(".ErrorMessage").hide("slow");

  if (text.val().trim().length > 0) {
    const words = text.val().split(" ");
    runProgressBar(words);
  } else {
    MessagesZone.find(".ErrorMessage")
      .empty()
      .text("Our tool can't analyze something that is empty, can you?")
      .show("slow");
  }
}

function analyzeEngine(words) {
  const types = [",", ".", ";", ":", "?", "!", "¿", "¡"];
  const wordsParsed = [];

  words.forEach(word => {
    wordsParsed.push(new Word(word.trim()));
    const lastCharacter = word.slice(-1);
    if (types.indexOf(lastCharacter) !== -1) {
      wordsParsed.push(new Word(lastCharacter));
    }
  });
  displayWordsData(wordsParsed);
}

function displayWordsData(wordsParsed) {
  const displayZone = $(".DisplayZone").find("code > pre");
  displayZone.empty();
  for (word of wordsParsed) {
    word.print(displayZone);
  }
}

function runProgressBar(words) {
  const progressBarContainer = MessagesZone.find(".progress");
  displayProgressBar(progressBarContainer, true);
  const progressBar = progressBarContainer.find("div.progress-bar");

  setTimeout(() => {
    const timer = setInterval(() => {
      if (progressBar.width() >= progressBarContainer.width()) {
        progressBar
          .removeClass("bg-info progress-bar-striped")
          .addClass("bg-success")
          .text("DONE!, I will disappear soon... bye :( ");

        analyzeEngine(words);
        enableDownloadButton(downloadButton);
        clearInterval(timer);
        displayProgressBar(progressBarContainer, false);
        $("html, body").animate({
          scrollTop: $(document).height() - $(window).height()
        });
      } else {
        progressBar.width(progressBar.width() + 600);
      }
    }, 50);
  }, 100);
}

function displayProgressBar(container, show) {
  if (show) {
    container.show().empty().append(`
    <div class="progress-bar progress-bar-striped progress-bar-animated bg-info" role="progressbar"
    aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">Working...</div>
</div>`);
  } else {
    setTimeout(() => {
      container.hide("slow").empty();
    }, 5000);
  }
}

function Word(word) {
  let punctuationSymbols = [",", ".", ";", ":", "?", "!", "¿", "¡"];

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
      `<span class="JSON-object">
      <span class="JSON-bracket">{</span>
          <span class="JSON-key">word: </span><span class="JSON-value">${
            this.word
          }</span>,
          <span class="JSON-key">length: </span><span class="JSON-value">${this.length()}</span>,
          <span class="JSON-key">type: </span><span class="JSON-value">${
            this.type
          }</span>,
       },</span>`.trim()
    );
  };

  this.jsonFormat = function() {
    const jsonObject = {};
    jsonObject["word"] = this.word;
    jsonObject["length"] = this.length();
    jsonObject["type"] = this.type;

    return jsonObject;
  };
}
