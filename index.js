const MessagesZone = $(".MessagesZone");
const buttonTools = $(".ButtonTools");

const analyzeButton = $(".TextZone").find("form");
const randomTextButton = buttonTools.find("button.RandomText");
const downloadButton = buttonTools.find("a.DownloadJSON");

analyzeButton.on("submit", analyzeText);
randomTextButton.on("click", generateRandomText);
//downloadButton.on("click", makeJSONDownloadable);

function makeJSONDownloadable(finalWords) {
  const jsonData = encodeURIComponent(
    JSON.stringify(finalWords.map(word => word.jsonFormat()))
  );
  const href = "data:text/json;charset=utf-8," + jsonData;
  downloadButton.prop({ href: href, download: "words.json" });
}

function enableDownloadButton(button) {
  button
    .removeClass("btn-secondary disabled")
    .addClass("btn-success")
    .css("cursor", "pointer");
}

function analyzeText(e) {
  e.preventDefault();
  const form = $(e.currentTarget);
  const text = form.find("textarea[name=user-text]");
  $(".ErrorMessage").hide("slow");

  if (text.val().trim().length > 0) {
    const displayZone = $(".DisplayZone").find("code > pre");
    displayZone
      .empty()
      .append(
        '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>'
      );
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
  const types = [
    ",",
    ".",
    ";",
    ":",
    "?",
    "!",
    "¿",
    "¡",
    ")",
    "(",
    "{",
    "}",
    "[",
    "]"
  ];
  let wordsParsed = [];

  words.forEach(word => {
    const trimmedWord = word.trim();
    const lastCharacter = word.slice(-1);
    if (types.indexOf(lastCharacter) !== -1) {
      wordsParsed.push(new Word(trimmedWord.slice(0, -1)));
      wordsParsed.push(new Word(lastCharacter));
    } else {
      wordsParsed.push(new Word(trimmedWord));
    }
  });

  wordsParsed = wordsParsed.filter(word => word.length() !== 0);

  displayWordsData(wordsParsed);
  setAchievements(wordsParsed);
  return wordsParsed;
}

function setAchievements(finalWords) {
  const achievementsContainer = $(".Achievements");
  let achievements = "";
  achievements += achievementCharacters(finalWords);
  achievements += achievementTypes(finalWords);
  achievements += achievementTimeToRead(finalWords);

  achievementsContainer.empty().append(achievements);
}

function achievementTimeToRead(finalWords) {
  const numberOfWords = finalWords.filter(word => word.type === "Word").length;
  let decimal = numberOfWords / 200;
  let minutes = Math.floor(decimal);
  let seconds = Math.round(
    parseFloat("0." + decimal.toString().split(".")[1]) * 0.6 * 100
  );
  return `<li class="list-group-item">Read time: <span class="badge badge-primary badge-pill">${minutes} minutes ${seconds} seconds</span></li>`;
}

function achievementCharacters(finalWords) {
  const numOfCharacters = finalWords
    .map(word => word.length())
    .reduce((length, nextLength) => {
      return length + nextLength;
    });
  return `<li class="list-group-item">This text contains <span class="badge badge-primary badge-pill">${numOfCharacters}</span> characters!</li>`;
}

function achievementTypes(finalWords) {
  const typesCounter = { Words: 0, Punctuations: 0 };
  finalWords.forEach(word => {
    word.type === "Word"
      ? typesCounter["Words"]++
      : typesCounter["Punctuations"]++;
  });
  return `<li class="list-group-item">
      Number of words: <span class="badge badge-primary badge-pill">${
        typesCounter["Words"]
      }</span>
      </li>
      <li class="list-group-item">
      Number of punctuations: <span class="badge badge-primary badge-pill">${
        typesCounter["Punctuations"]
      }</span>
      </li>
      `;
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

        const finalWords = analyzeEngine(words);

        enableDownloadButton(downloadButton);
        clearInterval(timer);

        displayProgressBar(progressBarContainer, false);
        makeJSONDownloadable(finalWords);
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

function generateRandomText(e) {
  const texts = [
    `La virtualización es tecnología que permite crear múltiples entornos simulados o recursos dedicados desde un solo sistema de hardware físico. 

    El software llamado "hipervisor" se conecta directamente con el hardware y permite dividir un sistema en entornos separados, distintos y seguros, conocidos como "máquinas virtuales" (VM). Estas VM dependen de la capacidad del hipervisor de separar los recursos de la máquina del hardware y distribuirlos adecuadamente. La virtualización le permite aprovechar al máximo sus inversiones anteriores.

    La máquina física original en que está instalado el hipervisor se llama "host", y las VM que utilizan estos recursos se llaman "guests". Los guests utilizan los recursos informáticos, como la CPU, la memoria y el almacenamiento, como un conjunto de medios que pueden redistribuirse fácilmente. Los operadores pueden controlar las instancias virtuales de la CPU, la memoria, el almacenamiento y demás recursos, para que los invitados reciban lo que necesiten cuando lo necesiten.

    Lo ideal es que todas las VM relacionadas se administren desde una sola consola de administración de virtualización basada en la web, que acelera todos los procesos. La virtualización le permite determinar cuánto poder de procesamiento, de almacenamiento y de memoria puede distribuir entre las VM. Además, los entornos están mejor protegidos, porque las VM están separadas entre sí, y son independientes del hardware de soporte.`,
    `Un Proceso puede informalmente entenderse como un programa en ejecución. Formalmente un proceso es "Una unidad de actividad que se caracteriza por la ejecución de una secuencia de instrucciones, un estado actual, y un conjunto de recursos del sistema asociados".

    Para entender mejor lo que es un proceso y la diferencia entre un programa y un proceso, A. S. Tanenbaum propone la analogía "Un científico computacional con mente culinaria hornea un pastel de cumpleaños para su hija; tiene la receta para un pastel de cumpleaños y una cocina bien equipada con todos los ingredientes necesarios, harina, huevo, azúcar, leche, etc."
    
     Situando cada parte de la analogía se puede decir que la receta representa el programa (el algoritmo), el científico computacional es el procesador y los ingredientes son las entradas del programa.
     El proceso es la actividad que consiste en que el científico computacional vaya leyendo la receta, obteniendo los ingredientes y horneando el pastel.

    Cada proceso tiene su contador de programa, registros y variables, aislados de otros procesos, incluso siendo el mismo programa en ejecución 2 veces. Cuando este último caso sucede, el sistema operativo usa la misma región de memoria de código, debido a que dicho código no cambiará, a menos que se ejecute una versión distinta del programa.`
  ];

  $(".TextZone")
    .find("textarea[name=user-text]")
    .val(texts[Math.floor(Math.random() * texts.length)]);
}
