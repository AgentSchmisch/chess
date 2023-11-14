console.log("hello world")

function clicked(){
    console.log("THANKS FOR CLICKING MEEE")
}

const browserConsole = document.querySelector('#browserConsole');
console.log(browserConsole)
browserConsole.innerHTML = browserConsole;