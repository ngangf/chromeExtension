const inputs = document.getElementById("content");
const coll = document.getElementById("manuallyInput");
const cite = document.getElementById("manualciteButton");
const closeCitation = document.getElementById("closeCitation");
const citeURL = document.getElementById("citeButton");
const outputs = document.getElementById("outputs");
const stat = document.getElementById("status");
const checkInput = document.getElementById("search");
const saveButton = document.getElementById("saveButton");
const resetButton = document.getElementById("resetButton");
const resetSavedCitation = document.getElementById("resetSavedCitation");
const manualInput = {};

var con = null;

var mediaWikiUrl =
  "https://en.wikipedia.org/api/rest_v1/data/citation/mediawiki/";

window.onload = function () {
  get_citations();
};

const get_citations = async () => {
  $("#savedCitation").children().remove();

  var input;
  var Content = [];
  var num;
  var numb;

  await chrome.storage.sync.get("number").then((result) => {
    var string = JSON.stringify(result);
    if (string == "{}") {
      con = 0;
    } else {
      num = JSON.parse(string);
      con = num.number;
    }
  });

  if (con > 0) {
    var j = 1;
    while (j <= con) {
      chrome.storage.sync.get("savedCitation-" + j, function (result) {
        var string = JSON.stringify(result);
        console.log(Object.keys(result).length);
        if (Object.keys(result).length !== 0) {
          input = JSON.parse(string);
          console.log(input);
          Content = input[Object.keys(input)[0]];

          var htmlAppend = ` 
                  <div  class='savedCitations row' >
                  <div id="savedCitation" class='col-12 p-0 d-flex justify-space-between'>
                  <li class="specificItem"> ${Content.citation} \n\n ${
            Content.intextCitation
          } </li>
                  <p id="${
                    "delete+" + Object.keys(input)
                  }"  class="exitButton" id="deleteCitation">X</p>
                  </div>
                  </div>
                  
                  `;
          $("#savedCitation").append(htmlAppend);
        }
      });
      j++;
    }
  } else {
    var status = `
    <div  class='row' >
    <div id="savedCitation" class='col-12 p-0 d-flex justify-content-center align-items-center'>
    <p class="defaultSave"> No Saved Citations </p>
    </div>
    </div>`;


    $("#savedCitation").append(status);
  }
};

const save_citation = (citation, intextCitation) => {
  console.log(con);
  con = con + 1;

  var data = {
    citation: citation,
    intextCitation: intextCitation,
  };
  var key = "savedCitation-" + con;
  console.log(key);
  var jsonfile = {};
  jsonfile[key] = data;

  //chrome.storage.sync.clear();
  chrome.storage.sync.set(jsonfile, function () {
    setTimeout(() => {}, 1000);
  });

  var value = con;

  var numJson = {};
  var num = "number";
  numJson[num] = value;

  chrome.storage.sync.set(numJson, function () {
    setTimeout(() => {}, 1000);
  });

  get_citations();
};

document
  .getElementById("savedCitation")
  .addEventListener("click", someFunction);

function someFunction(event) {
  console.log(event.target.id);
  console.log(event.target.id.split("+")[1]);

  var del = event.target.id.split("+")[1];
  if (del !== undefined) {
    chrome.storage.sync.remove(del, function () {
      setTimeout(() => {}, 1000);
    });

    get_citations();
  }
}

checkInput.addEventListener("change", function () {
  console.log($("#search").val());
  if ($("#search").val() == "") {
    document.getElementById("citeButton").innerHTML = "Cite Tab";
  } else {
    document.getElementById("citeButton").innerHTML = "Cite URL";
  }
});

resetSavedCitation.addEventListener("click", function () {
  for (var j = 0; j <= con; j++) {
    console.log(j);
    chrome.storage.sync.remove("savedCitation-" + j, function () {
      setTimeout(() => {}, 1000);
    });
  }

  chrome.storage.sync.remove("number", function () {
    con = 0;
    setTimeout(() => {}, 1000);
  });

  get_citations();
});

saveButton.addEventListener("click", function () {
  var articleTitle = document.getElementById("atitle").value;
  var authorFirstName = document.getElementById("aFirstName").value;
  var authorLastName = document.getElementById("aLastName").value;
  var url = document.getElementById("url").value;
  var publicator = document.getElementById("publicator").value;
  var datePublished = document.getElementById("datePublished").value;
  var formatType = document.getElementById("format").value;

  var data = {
    articleTitle: articleTitle,
    authorFirstName: authorFirstName,
    authorLastName: authorLastName,
    url: url,
    publicator: publicator,
    datePublished: datePublished,
    formatType: formatType,
  };
  var key = "savedInputs";
  var jsonfile = {};
  jsonfile[key] = data;

  //chrome.storage.sync.clear();
  chrome.storage.sync.set(jsonfile, function () {
    var status = document.getElementById("statusSaved");
    status.textContent = "Options Saved";
    stat.style.display = "flex";
    setTimeout(() => {
      status.textContent = " ";
      stat.style.display = "none";
    }, 1000);
  });
});

resetButton.addEventListener("click", function () {
  document.getElementById("atitle").value = "";
  document.getElementById("aFirstName").value = "";
  document.getElementById("aLastName").value = "";
  document.getElementById("url").value = "";
  document.getElementById("datePublished").value = "";
  document.getElementById("publicator").value = "";
  chrome.storage.sync.remove("savedInputs", function () {
    var status = document.getElementById("statusReset");
    status.textContent = "Options Reset";
    stat.style.display = "flex";
    setTimeout(() => {
      status.textContent = " ";
      stat.style.display = "none";
    }, 1000);
  });
});

closeCitation.addEventListener("click", () => {
  outputs.style.display = "none";
});

citeURL.addEventListener("click", () => {
  handleURLCite();
});

const handleURLCite = async () => {
  var formatType = document.getElementById("formatOne").value;
  var search = "";
  if ($("#search").val() == "") {
    await chrome.tabs
      .query({ active: true, currentWindow: true })
      .then((tabs) => {
        // and use that tab to fill in out title and url
        var tab = tabs[0].url;
        console.log(tab);
        search = encodeURIComponent(tab);
        console.log(search);
      });
  } else {
    search = encodeURIComponent(document.getElementById("search").value);
  }

  console.log(mediaWikiUrl + "" + search);

  await $.ajax({
    type: "GET",
    url: mediaWikiUrl + search,
    success: function (data) {
      console.log(data);

      var articleTitle = data[0].title;
      var author =
        typeof data[0].author == "undefined" ? "N.D" : data[0].author[0];
      var url = data[0].url;
      var publisher = data[0].publicationTitle || data[0].websiteTitle;
      var datePublished = data[0].date;

      if (formatType == "apa") {
        var date = moment(datePublished).format("YYYY MMMM Do");
        var date2 = moment(datePublished).format("YYYY");
        var apa =
          author +
          ". (" +
          date +
          "). " +
          articleTitle.italics() +
          ". " +
          publisher +
          "  Retrieved " +
          moment().format("MMMM Do YYYY") +
          ", from " +
          url;
        var inTextCitation = "(" + author + " " + ", " + date2 + ")";
        document.getElementById("citationOutput").innerHTML = apa;
        document.getElementById("inTextCitation").innerHTML = inTextCitation;
        outputs.style.display = "block";
        save_citation(apa, inTextCitation);
      } else if (formatType == "mla") {
        var date = moment(datePublished).format("YYYY MMMM Do");
        var mla =
          author +
          `. "` +
          articleTitle.italics() +
          `." ` +
          publisher +
          ", " +
          date +
          ", " +
          url;
        document.getElementById("citationOutput").innerHTML = mla;
        var inTextCitation = "(" + author + ")";
        document.getElementById("inTextCitation").innerHTML = inTextCitation;
        outputs.style.display = "block";
        save_citation(mla, inTextCitation);
      }
    },
  });

  return false;
};

coll.addEventListener("click", function () {
  if (inputs.style.display == "none") {
    console.log("HI");
    var input;
    var Content;

    chrome.storage.sync.get("savedInputs", function (result) {
      var string = JSON.stringify(result);
      if (string.length > 0) {
        input = JSON.parse(string);
        Content = input.savedInputs;

        document.getElementById("atitle").value = Content.articleTitle;
        document.getElementById("aFirstName").value = Content.authorFirstName;
        document.getElementById("aLastName").value = Content.authorLastName;
        document.getElementById("url").value = Content.url;
        document.getElementById("datePublished").value = Content.datePublished;
        document.getElementById("format").value = Content.formatType;
        document.getElementById("publicator").value = Content.publicator;
      }
    });

    inputs.style.display = "flex";
  } else {
    inputs.style.display = "none";
  }
});

cite.addEventListener("click", function () {
  var articleTitle = document.getElementById("atitle").value;
  var authorFirstName = document.getElementById("aFirstName").value;
  var authorLastName = document.getElementById("aLastName").value;
  var url = document.getElementById("url").value;
  var publisher = document.getElementById("publicator").value;
  var datePublished = document.getElementById("datePublished").value;
  var formatType = document.getElementById("format").value;

  if (formatType == "apa") {
    console.log("hi");
    var date = moment(datePublished).format("YYYY MMMM Do");
    var date2 = moment(datePublished).format("YYYY");
    var apa =
      authorFirstName +
      " " +
      authorLastName +
      ". (" +
      date +
      "). " +
      articleTitle.italics() +
      ". " +
      publisher +
      "  Retrieved " +
      moment().format("MMMM Do YYYY") +
      ", from " +
      url;
    var inTextCitation =
      "(" + authorFirstName + " " + authorLastName + ", " + date2 + ")";
    document.getElementById("citationOutput").innerHTML = apa;
    document.getElementById("inTextCitation").innerHTML = inTextCitation;
    outputs.style.display = "block";
    save_citation(apa, inTextCitation);
  } else if (formatType == "mla") {
    var date = moment(datePublished).format("YYYY MMMM Do");
    var mla =
      authorFirstName +
      " " +
      authorLastName +
      `. "` +
      articleTitle.italics() +
      `." ` +
      publisher +
      ", " +
      date +
      ", " +
      url;
    document.getElementById("citationOutput").innerHTML = mla;
    var inTextCitation = "(" + authorFirstName + " " + authorLastName + ")";
    document.getElementById("inTextCitation").innerHTML = inTextCitation;
    outputs.style.display = "block";
    save_citation(mla, inTextCitation);
  }
  inputs.style.display = "none";
});
