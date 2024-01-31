// TODO: improve render performance -> only rerender the changed items
// TODO: create board layout with respect to the board_configuration array

import { ChessPiece, Rook, Knight, Bishop, King, Queen, Pawn } from "./ChessPiece.js"
import { ChessBoard } from "./chessBoard.js"

class DemoBoard extends ChessBoard {
    constructor(piece) {
            super("",[],[])
            this.board = this.initializeBoard(piece)


    }

    //check for the mode with getter and setter
    #current_player = "white"
    get getCurrentPlayer(){
        return this.#current_player
    }

    set setCurrentPlayer(current_player){
        if(this.mode === "prod"){
            this.#current_player = current_player
        }

        else if(this.mode === "demo"){
            this.#current_player = "white"
        }
    }
    killed_pieces = []
    mode = "prod"


    initializeBoard = function (piece) {
        let board = Array.from({ length: 8 }, () => Array(8).fill(null));

        let color = "white"
        let x = 4
        let y = 4
        let pieces = {
            "Pawn": new Pawn(color, y, x),
            "Knight": new Knight(color, y, x),
            "Bishop": new Bishop(color, y, x),
            "Rook": new Rook(color, y, x),
            "King": new King(color, y, x),
            "Queen": new Queen(color, y, x)
        }

        board[x][y] = pieces[piece]
        return board;
    }

    render = function (board) {
        const chessboardElement = document.querySelector(board);
        //clear the chessboard every time its rerendered
        chessboardElement.innerHTML = '';

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const squareElement = document.createElement('div');
                squareElement.classList.add('square', (i + j) % 2 === 0 ? 'white' : 'black');
                squareElement.setAttribute("id", `${board.replace("#","")}/${i}/${j}`)
                squareElement.innerHTML = this.board[i][j] instanceof ChessPiece ? `<img class='sprite' src='${this.board[i][j].imgUrl}'/>` : "";
                squareElement.addEventListener('click', () => this.handleSquareClick(board.replace("#",""),i, j));
                chessboardElement.appendChild(squareElement);
            }
        }
    }

    display_movement_pattern = function (object, x_pos, y_pos,board) {
        object.active = true
        // remove the active class from any square
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                let elem = document.getElementById(`${board}/${i}/${j}`)
                elem.classList.remove("active", "kill")
            }
        }

        let resultArray = this.get_movement_pattern(object, x_pos, y_pos, this.getCurrentPlayer)
        for (let i = 0; i < resultArray.length; i++) {
            for (let j = 0; j < resultArray[i].length; j++) {
                if (resultArray[i][j] === 1) {
                    let css_class = "active"
                    if (this.board[i][j] != null) {

                        if (this.board[i][j].color != object.color) {
                            if (object instanceof Pawn) {
                                continue
                            }
                            css_class = "kill"
                        }
                        if (this.board[i][j].color === object.color) {
                            continue
                        }
                    }
                    let elem = document.getElementById(`${board}/${i}/${j}`)
                    elem.classList.add(css_class)
                }
                else if (resultArray[i][j] === 3) {
                    let css_class = "active"
                    //check if there is a an ally in the way of the player
                    //check for the piece being a pawn - if so display a different kill pattern
                    if (this.board[i][j] != null) {

                        if (this.board[i][j].color != object.color) {
                            css_class = "kill"
                        }
                        if (this.board[i][j].color === object.color) {
                            continue
                        }
                    }
                    else if (this.board[i][j] === null) {
                        continue
                    }
                    let elem = document.getElementById(`${board}/${i}/${j}`)
                    elem.classList.add(css_class)
                }
            }
        }
    }

    get_movement_pattern = function (object, x_pos, y_pos, color) {
        let movement_pattern

        // check if the current chessPiece is a pawn, if so display the movement pattern according to the variable first_move
        if (object instanceof Pawn) {
            if (object.movement_pattern[color].length > 1) {
                //check if the move is the first one or the second
                if (object.first_move) {
                    movement_pattern = object.movement_pattern[color][0][1]
                }

                else {
                    movement_pattern = object.movement_pattern[color][1][1]
                }
            }
        }
        // if the object is not a pawn, use the movement pattern that is in the array
        else {
            movement_pattern = object.movement_pattern[0]
        }

        /*
            generate a new 8x8 array, representing the chess board consisting of zeroes
            project the movement pattern into the deep copy of the board
        */

        //set the movement pattern shift variable
        let movement_pattern_shift = object.movement_pattern_shift

        // array that is used for the projection consists of zeroes
        let resultArray = Array.from({ length: 8 }, () => Array(8).fill(0));
        //if the current piece is a pawn 
        if (object instanceof Pawn) {
            movement_pattern_shift = object.movement_pattern_shift[object.color];
        }

        // Project the movement pattern into the resultArray
        for (let i = 0; i < movement_pattern.length; i++) {
            for (let j = 0; j < movement_pattern[i].length; j++) {
                // skip the array positions in case the movement pattern overlays the borders of the board
                if (y_pos - movement_pattern_shift[0] + i < 0 || x_pos - movement_pattern_shift[1] + j < 0)
                    continue;
                else if (y_pos - movement_pattern_shift[0] + i > 7 || x_pos - movement_pattern_shift[1] + j > 7)
                    continue;
                // in the movement patterns the number 2 represents the players position, the array projection needs to be moved to the current players position on the chessboard
                resultArray[y_pos - movement_pattern_shift[0] + i][x_pos - movement_pattern_shift[1] + j] = movement_pattern[i][j];
            }
        }
        let piece_positions = this.project_piece_position_to_movement_pattern(resultArray)

        let possible_moves = this.calculate_move_directions(object, piece_positions, color)
        return possible_moves
    }

    calculate_move_directions = function (player, allowed_positions, color) {
        //this method will calculate the possible movement directions
        // - straight ahead
        // - right
        // - back
        // - left
        // - diagonally

        let player_position = player.position

        for (let i = 0; i < player.movement_directions.length; i++) {
            // allowed positions gets fed into the functions over and over again
            //therefore the final array get built up gradually
            allowed_positions = player[player.movement_directions[i]](player_position, allowed_positions, color);
        }

        return allowed_positions;
    }

    project_piece_position_to_movement_pattern = function (movement_pattern) {
        let resultArray = movement_pattern
        for (let y = 0; y < movement_pattern.length; y++) {
            for (let x = 0; x < movement_pattern[y].length; x++) {
                if (this.board[x][y] != null && movement_pattern[x][y] === 1) {
                    resultArray[x][y] = this.board[x][y]
                }
                else {
                }

            }
        }
        return resultArray
    }

    handleSquareClick = function (board ,y, x) {
        //show movement pattern only for the active player
        if (this.board[y][x] != null) {
            if (this.board[y][x].color === this.getCurrentPlayer) {
                //make sure there is only one piece active
                for (let i = 0; i < this.board.length; i++) {
                    for (let j = 0; j < this.board[i].length; j++) {
                        //check if there is a active piece, if there is, set to inactive
                        if (this.board[j][i] != null) {
                            if (this.board[j][i].active && this.board[y][x] instanceof ChessPiece) {
                                this.board[j][i].active = false;
                            }
                        }
                    }
                }
                this.display_movement_pattern(this.board[y][x], x, y,board)
            }
        }
    }
}

export { DemoBoard }