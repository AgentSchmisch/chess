import { ChessPiece, Rook, Knight, Bishop, King, Queen, Pawn } from "./../gameObjects/ChessPiece.js"


let Board = {

    "initial": [
        [new Rook("black", 0, 0), new Knight("black", 0, 1), new Bishop("black", 0, 2), new Queen("black", 0, 3), new King("black", 0, 4), new Bishop("black", 0, 5), new Knight("black", 0, 6), new Rook("black", 0, 7)],
        [new Pawn("black", 1, 0), new Pawn("black", 1, 1), new Pawn("black", 1, 2), new Pawn("black", 1, 3), new Pawn("black", 1, 4), new Pawn("black", 1, 5), new Pawn("black", 1, 6), new Pawn("black", 1, 7)],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [new Pawn("white", 6, 0), new Pawn("white", 6, 1), new Pawn("white", 6, 2), new Pawn("white", 6, 3), new Pawn("white", 6, 4), new Pawn("white", 6, 5), new Pawn("white", 6, 6), new Pawn("white", 6, 7)],
        [new Rook("white", 7, 0), new Knight("white", 7, 1), new Bishop("white", 7, 2), new Queen("white", 7, 3), new King("white", 7, 4), new Bishop("white", 7, 5), new Knight("white", 7, 6), new Rook("white", 7, 7)],
    ]

}
export {Board}