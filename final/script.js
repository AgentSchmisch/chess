import { ChessBoard } from "./gameObjects/chessBoard.js"

localStorage.clear()

//console.log(JSON.parse(localStorage.getItem("board")))
if (localStorage.getItem("board") === null && localStorage.getItem("board_data") === null) {
    let board = new ChessBoard("initial")
    console.log(board)
    board.render()
}

else if (localStorage.getItem("board") != null && localStorage.getItem("board_data") != null) {
    let board_data_raw = localStorage.getItem("board_data")
    let board_raw = localStorage.getItem("board")
    const storedObject = JSON.parse(board_data_raw);
    const _board = JSON.parse(board_raw);
    console.log(storedObject)
    console.log(_board)
    let board = new ChessBoard("", _board, storedObject.current_player, storedObject.killed_pieces)
    console.log("final", board)
    board.render()
}
