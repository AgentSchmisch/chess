import { DemoBoard } from "../gameObjects/demoBoard.js";


let rookBoard = new DemoBoard("Rook")
rookBoard.render("#rookBoard")

let pawnBoard = new DemoBoard("Pawn")
pawnBoard.render("#pawnBoard")

let bishopBoard = new DemoBoard("Bishop")
bishopBoard.render("#bishopBoard")

let knightBoard = new DemoBoard("Knight")
knightBoard.render("#knightBoard")

let queenBoard = new DemoBoard("Queen")
queenBoard.render("#queenBoard")

let kingBoard = new DemoBoard("King")
kingBoard.render("#kingBoard")
