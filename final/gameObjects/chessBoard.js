// TODO: improve render performance -> only rerender the changed items
// TODO: create board layout with respect to the board_configuration array

import { ChessPiece, Rook, Knight, Bishop, King, Queen, Pawn } from "./ChessPiece.js"
class ChessBoard {
    constructor() {
        this.board = this.initializeBoard()
    }
    clicked_piece
    current_player = "white"

    killed_pieces = []

    board_matrix = [
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
    ]
    board_configuration = [[new Rook("white"), new Knight("white"), "bishop", "queen", "king", "bishop", "knight", "rook"],
    ["pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn"]
    ]

    initializeBoard = function () {
        let board = []
        //creating the basic game board, which gets filled with characters later
        for (let x = 0; x < 8; x++) {
            board[x] = [];
            for (let y = 0; y < 8; y++) {
                board[x][y] = null
            }
        }

        board[0][0] = new Rook("black",0,0)
        board[0][1] = new Knight("black",0,1)
        board[0][2] = new Bishop("black",0,2)
        board[0][3] = new Queen("black",0,3)
        board[0][4] = new King("black")
        board[0][5] = new Bishop("black")
        board[0][6] = new Knight("black")
        board[0][7] = new Rook("black")

        board[1][0] = new Pawn("black",1,0)
        board[1][1] = new Pawn("black",1,1)
        board[1][2] = new Pawn("black",1,2)
        board[1][3] = new Pawn("black",1,3)
        board[1][4] = new Pawn("black",1,4)
        board[1][5] = new Pawn("black",1,5)
        board[1][6] = new Pawn("black",1,6)
        board[1][7] = new Pawn("black",1,7)

        board[7][0] = new Rook("white",7,0)
        board[7][1] = new Knight("white",7,1)
        board[7][2] = new Bishop("white",7,2)
        board[7][3] = new Queen("white",7,3)
        board[7][4] = new King("white",7,4)
        board[7][5] = new Bishop("white",7,5)
        board[7][6] = new Knight("white",7,6)
        board[7][7] = new Rook("white",7,7)

        board[6][0] = new Pawn("white",6,0)
        board[6][1] = new Pawn("white",6,1)
        board[6][2] = new Pawn("white",6,2)
        board[6][3] = new Pawn("white",6,3)
        board[6][4] = new Pawn("white",6,4)
        board[6][5] = new Pawn("white",6,5)
        board[6][6] = new Pawn("white",6,6)
        board[6][7] = new Pawn("white",6,7)

        this.render_killed()
        //console.log(board)
        return board
    }

    render = function () {
        const chessboardElement = document.getElementById('chessboard');
        //clear the chessboard every time its rerendered
        chessboardElement.innerHTML = '';

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const squareElement = document.createElement('div');
                squareElement.classList.add('square', (i + j) % 2 === 0 ? 'white' : 'black');
                squareElement.setAttribute("id", `${i}/${j}`)
                squareElement.innerHTML = this.board[i][j] instanceof ChessPiece ? `<img class='sprite' src='${this.board[i][j].imgUrl}'/>` : "";
                squareElement.addEventListener('click', () => this.handleSquareClick(i, j));
                chessboardElement.appendChild(squareElement);
            }
        }
    }

    display_movement_pattern = function (object, x_pos, y_pos) {
        object.active = true
        // remove the active class from any square
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                let elem = document.getElementById(`${i}/${j}`)
                elem.classList.remove("active","kill")
            }
        }

        let movement_pattern
        let player_representation = 2 //number that represents the players position on the chesss board
        // check if the current chessPiece is a pawn, if so display the movement pattern according to the variable first_move
        if (object instanceof Pawn){
            if (object.movement_pattern[this.current_player].length > 1) {
                //check if the move is the first one or the second
                if (object.first_move) {
                    movement_pattern = object.movement_pattern[this.current_player][0][1]
                }
                else {
                    movement_pattern = object.movement_pattern[this.current_player][1][1]
                }
            }
        }

        else {
            movement_pattern = object.movement_pattern[0]
        }

        /*
            generate a new 8x8 array, representing the chess board consisting of zeroes
            project the movement pattern into the deep copy of the board
            the 2 at the position of the player, and leave that away
            search for the number 2, which represents the player position in the movement pattern
        */
        const pos_player_representation = []

        // array that is used for the projection consists of zeroes
        const resultArray = Array.from({ length: 8 }, () => Array(8).fill(0));

        for (let i = 0; i < movement_pattern.length; i++) {
            for (let j = 0; j < movement_pattern[i].length; j++) {
                if (movement_pattern[i][j] === player_representation) {
                    pos_player_representation.push(i, j)
                    break;
                }
            }
        }

        // Project the movement pattern into the resultArray
        for (let i = 0; i < movement_pattern.length; i++) {
            for (let j = 0; j < movement_pattern[i].length; j++) {
                // skip the array positions in case the movement pattern overlays the borders of the board
                if (y_pos - pos_player_representation[0] + i < 0 || x_pos - pos_player_representation[1] + j < 0)
                    continue;
                else if (y_pos - pos_player_representation[0] + i > 7 || x_pos - pos_player_representation[1] + j > 7)
                    continue;
                // in the movement patterns the number 2 represents the players position, the array projection needs to be moved to the current players position on the chessboard
                resultArray[y_pos - pos_player_representation[0] + i][x_pos - pos_player_representation[1] + j] = movement_pattern[i][j];
            }
        }

        for (let i = 0; i < resultArray.length; i++) {
            for (let j = 0; j < resultArray[i].length; j++) {
                if (resultArray[i][j] === 1) {
                    let css_class = "active"
                    //TODO: check if there is a an ally in the way of the player
                    //TODO: check for the piece being a pawn - if so display a different kill pattern
                    if (this.board[i][j] != null) {

                        if (this.board[i][j].color != object.color) {
                            css_class = "kill"
                        }
                        if (this.board[i][j].color === object.color) {
                            continue
                        }

                    }
                    let elem = document.getElementById(`${i}/${j}`)
                    elem.classList.add(css_class)
                }
            }
        }
    }

    handleSquareClick = function (y, x) {
        //show movement pattern only for the active player
        if(this.board[y][x] != null){
            if(this.board[y][x].color === this.current_player){
                //make sure there is only one piece active
                for (let i = 0; i < this.board.length; i++) {
                    for (let j = 0; j < this.board[i].length; j++) {
                        //check if there is a active piece, if there is, set to inactive
                        if (this.board[j][i] != null){
                            if(this.board[j][i].active && this.board[y][x] instanceof ChessPiece){
                                this.board[j][i].active = false;
                            }
                        }
                    }
                }
                this.display_movement_pattern(this.board[y][x], x, y)
            }
        }
        /*
        check if the clicked square is a valid move
        check if there is an enemy on the square
        check if its players turn

        -> if null or enemy
            kill/move to position 
        
        */
            
        if (this.board[y][x] === null) {
            for (let i = 0; i < this.board.length; i++) {
                for (let j = 0; j < this.board[i].length; j++) {
                    if (this.board[j][i] != null) {
                        if (this.board[j][i].active) {
                            // hand over the active chess piece
                            this.movePiece(this.board[j][i],[x,y])
                        }
                    }
                }
            }


        }
        else if(this.board[y][x] instanceof ChessPiece && this.board[y][x].color != this.current_player)
        {
            for (let i = 0; i < this.board.length; i++) {
                for (let j = 0; j < this.board[i].length; j++) {
                    if (this.board[j][i] != null) {
                        if (this.board[j][i].active) {
                            // hand over the active chess piece
                            this.killPiece(this.board[y][x])
                            this.movePiece(this.board[j][i],[x,y])
                        }
                    }
                }
            }

        }

    }

    movePiece = function(piece, to){

        //move the piece to the new location
        this.board[to[1]][to[0]] = piece
        //remove the old piece from the original position
        this.board[piece.position["y"]][piece.position["x"]] = null
        
        if (piece instanceof Pawn) {
            piece.first_move = false
        }

        // refresh the parameters of the specific object
        piece.position["x"] = to[0]
        piece.position["y"] = to[1]

        //deactivate the piece
        piece.active = false

        if(this.validateMove){
            //if the move was valid - switch to the other player
            this.current_player = this.current_player === "white" ? "black":"white"
            document.getElementById("turn").innerHTML = `It's <b>${this.current_player}'s</b> turn`
            this.render()
        }
    }

    killPiece = function(piece){
        piece.killed = true
        this.killed_pieces.push(piece)
        this.render_killed()
    }

    render_killed = function(){
        let killed_blk = document.getElementById('killedblk')
        killed_blk.innerHTML = ""
        let killed_wht =  document.getElementById('killedwht')
        killed_wht.innerHTML = ""

        for (let i = 0; i < this.killed_pieces.length; i++) {
            const piece = this.killed_pieces[i];

            if (piece.color === "black") {
                const squareElement = document.createElement('div');
                squareElement.classList.add("dead")
                squareElement.innerHTML = `<img class='sprite' src='${piece.imgUrl}'/>`;
                killed_blk.appendChild(squareElement);
            }

            else if (piece.color === "white") {
                const squareElement = document.createElement('div');
                squareElement.classList.add("dead")
                squareElement.innerHTML = `<img class='sprite' src='${piece.imgUrl}'/>`;
                killed_wht.appendChild(squareElement);
            }
        }

    }

    validateMove = function(piece, to, piece2){
        return true
        if (piece2 != undefined){}
    }

}

export { ChessBoard }