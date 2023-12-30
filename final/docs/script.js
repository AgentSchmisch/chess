let converter = new showdown.Converter();
let md = '[**Showdown**](http://www.showdownjs.com) is *great*\n' +
         'because:\n\n' +
         ' - it\'s easy to use\n' +
         ' - it\'s extensible\n' +
         ' - works in the server and in the browser'
         ;


const fr = new FileReader();


md = fr.readAsText("./README.md", "text")
var html = converter.makeHtml(md);

document.getElementById("documentation").innerHTML = html