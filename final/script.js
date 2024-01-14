import { ChessBoard } from "./gameObjects/chessBoard.js"

let continueGame = document.getElementById("continue").addEventListener("click", restoreGame)
let newGame = document.getElementById("new").addEventListener("click", startNew)


// if the local storage is empty start a new game on its own
if (localStorage.getItem("board") === null && localStorage.getItem("board_data") === null) {
    startNew();
}

function restoreGame(){
    // make the startcontainer invisible and show the chessboard
    let startContainer = document.querySelector(".gameScreen")
    let buttonContainer = document.querySelector(".startScreen")
    startContainer.style.display = "block"
    buttonContainer.style.display = "none"

    // restore all the elements from the previous game
    let board_data_raw = localStorage.getItem("board_data")
    let board_raw = localStorage.getItem("board")
    const storedObject = JSON.parse(board_data_raw);
    const _board = JSON.parse(board_raw);

    let board = new ChessBoard("", _board, storedObject.current_player, storedObject.killed_pieces)
    board.render()
}
// if the player wishes to start a new game
function startNew(){
    localStorage.clear()

    let board = new ChessBoard("initial")

    let startContainer = document.querySelector(".gameScreen")
    let buttonContainer = document.querySelector(".startScreen")
    startContainer.style.display = "block"
    buttonContainer.style.display = "none"

    board.render()
}

export {startNew}
