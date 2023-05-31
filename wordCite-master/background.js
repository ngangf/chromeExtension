


chrome.action.onClicked.addListener( function(){

  chrome.storage.sync.get(['savedInputs'], function(result) {
    console.log('Value currently is ' + JSON.stringify(result));
    var string = JSON.stringify(result)
    console.log (JSON.parse(string));
  });


  
}



)