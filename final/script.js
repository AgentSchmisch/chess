import { ChessBoard } from "./gameObjects/chessBoard.js"

let board = new ChessBoard()
board.render()

const sourceArray = [
    [1, 4, 3],
    [4, 3, 6],
    [7, 2, 9]
];

const destinationArray = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
];

const result = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 4, 3, 0, 0],
    [0, 0, 0, 4, 2, 6, 0, 0],
    [0, 0, 0, 7, 3, 9, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
];



const valueToProject = 2; // Choose the specific value from the source array
const destinationPositionRow = 3; // Choose the starting row in the destination array
const destinationPositionCol = 5; // Choose the starting column in the destination array

function createResultArray(sourceArray, destinationArray, valueToProject, destinationPositionRow, destinationPositionCol) {
    // Copy the destinationArray to resultArray
    const resultArray = destinationArray.map(row => row.slice());
    const pos_valueToProject = []

    for (let i = 0; i < sourceArray.length; i++) {
        for (let j = 0; j < sourceArray[i].length; j++) {
            if (sourceArray[i][j] === valueToProject){
                pos_valueToProject.push(i,j)
                break;
            }
        }
    }
    console.log(pos_valueToProject)

    // Project the subarray from sourceArray into resultArray
    for (let i = 0; i < sourceArray.length; i++) {
        for (let j = 0; j < sourceArray[i].length; j++) {
            resultArray[destinationPositionRow-pos_valueToProject[0] + i][destinationPositionCol-pos_valueToProject[1] + j] = sourceArray[i][j];
        }
    }

    return resultArray;
}
//const res = createResultArray(sourceArray, destinationArray, valueToProject, destinationPositionRow, destinationPositionCol);
//console.log(res)
