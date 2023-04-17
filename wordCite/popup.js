
const inputs = document.getElementById("content");
const coll = document.getElementById("manuallyInput");
const cite = document.getElementById("manualciteButton");
const citeURL = document.getElementById("citeButton");
const outputs = document.getElementById("outputs");


var mediaWikiUrl= "https://en.wikipedia.org/api/rest_v1/data/citation/mediawiki/"




citeURL.addEventListener("click", function() {
    var formatType = document.getElementById("formatOne").value;
    console.log(formatType);
    const search = encodeURIComponent(document.getElementById("search").value);
    console.log(mediaWikiUrl+""+search);

    $.ajax({ 
        type: "GET",
        url: mediaWikiUrl + search, 
        success: function(data){
            console.log(data);
           
    var articleTitle = data[0].title;
    var author = (typeof(data[0].author) == "undefined") ? "N.D" : data[0].author[0]
    var url = data[0].url;
    var publisher = data[0].publicationTitle || data[0].websiteTitle;
    var datePublished = data[0].date;


    if (formatType == "apa"){

    var date = moment(datePublished).format('YYYY MMMM Do');
    var date2 = moment(datePublished).format('YYYY');
    var apa = author + ". (" + date + "). " + articleTitle.italics() +". "+publisher+ "  Retrieved " + moment().format('MMMM Do YYYY') + ", from " + url;
    var inTextCitation = "(" +author + " "  + ", " + date2 + ")";
    document.getElementById("citationOutput").innerHTML = apa; 
    document.getElementById("inTextCitation").innerHTML = inTextCitation;
    outputs.style.display='block';
    }
    else if (formatType == "mla"){

        var date = moment(datePublished).format('YYYY MMMM Do');
        var mla = author + `. "` + articleTitle.italics() + `." ` + publisher+ ", "+  date + ", "+ url;
        document.getElementById("citationOutput").innerHTML = mla; 
        var inTextCitation = "(" + author + ")";
        document.getElementById("inTextCitation").innerHTML = inTextCitation; 
        outputs.style.display='block';
    }
        }
    });
    return false;
});





coll.addEventListener("click", function(){

    if (inputs.style.display == "none")
    {
        inputs.style.display = "block"
    }
    else {
        inputs.style.display = "none"   
     }
});





cite.addEventListener("click", function(){

    var articleTitle = document.getElementById("atitle").value;
    var authorFirstName = document.getElementById("aFirstName").value;
    var authorLastName = document.getElementById("aLastName").value;
    var url = document.getElementById("url").value;
    var publisher = document.getElementById("publicator").value;
    var datePublished = document.getElementById("datePublished").value;
    var formatType = document.getElementById("format").value;

    if (formatType == "apa"){
        console.log("hi")
        var date = moment(datePublished).format('YYYY MMMM Do');
        var date2 = moment(datePublished).format('YYYY');
        var apa = authorFirstName + " " + authorLastName + ". (" + date + "). " + articleTitle.italics() +". "+publisher+ "  Retrieved " + moment().format('MMMM Do YYYY') + ", from " + url;
        var inTextCitation = "(" +authorFirstName + " " + authorLastName + ", " + date2 + ")";
        document.getElementById("citationOutput").innerHTML = apa; 
        document.getElementById("inTextCitation").innerHTML = inTextCitation; 
        outputs.style.display='block';


    }
    else if (formatType =="mla"){
        var date = moment(datePublished).format('YYYY MMMM Do');
        var mla = authorFirstName + " " + authorLastName  + `. "` + articleTitle.italics() + `." ` + publisher+ ", "+  date + ", "+ url;
        document.getElementById("citationOutput").innerHTML = mla; 
        var inTextCitation = "(" +authorFirstName + " " + authorLastName + ")";
        document.getElementById("inTextCitation").innerHTML = inTextCitation; 
        outputs.style.display='block';
       
    }
    






})


   
