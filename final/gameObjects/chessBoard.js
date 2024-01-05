// TODO: check if the player is blocked by another piece

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
    ];

    board_configuration = [[new Rook("white"), new Knight("white"), "bishop", "queen", "king", "bishop", "knight", "rook"],
    ["pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn"]
    ];

    initializeBoard = function () {
        let board = []
        //creating the basic game board, which gets filled with characters later
        for (let x = 0; x < 8; x++) {
            board[x] = [];
            for (let y = 0; y < 8; y++) {
                board[x][y] = null;
            }
        }
        // filling the board with the initial piece configuration
        board[0][0] = new Rook("black", 0, 0);
        board[0][1] = new Knight("black", 0, 1);
        board[0][2] = new Bishop("black", 0, 2);
        board[0][3] = new Queen("black", 0, 3);
        board[0][4] = new King("black", 0, 4);
        board[0][5] = new Bishop("black", 0, 5);
        board[0][6] = new Knight("black", 0, 6);
        board[0][7] = new Rook("black", 0, 7);

        board[1][0] = new Pawn("black", 1, 0);
        board[1][1] = new Pawn("black", 1, 1);
        board[1][2] = new Pawn("black", 1, 2);
        board[1][3] = new Pawn("black", 1, 3);
        board[1][4] = new Pawn("black", 1, 4);
        board[1][5] = new Pawn("black", 1, 5);
        board[1][6] = new Pawn("black", 1, 6);
        board[1][7] = new Pawn("black", 1, 7);

        board[7][0] = new Rook("white", 7, 0);
        board[7][1] = new Knight("white", 7, 1);
        board[7][2] = new Bishop("white", 7, 2);
        board[7][3] = new Queen("white", 7, 3);
        board[7][4] = new King("white", 7, 4);
        board[7][5] = new Bishop("white", 7, 5);
        board[7][6] = new Knight("white", 7, 6);
        board[7][7] = new Rook("white", 7, 7);

        board[6][0] = new Pawn("white", 6, 0);
        board[6][1] = new Pawn("white", 6, 1);
        board[6][2] = new Pawn("white", 6, 2);
        board[6][3] = new Pawn("white", 6, 3);
        board[6][4] = new Pawn("white", 6, 4);
        board[6][5] = new Pawn("white", 6, 5);
        board[6][6] = new Pawn("white", 6, 6);
        board[6][7] = new Pawn("white", 6, 7);

        this.render_killed();
        return board;
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
                elem.classList.remove("active", "kill")
            }
        }

        let resultArray = this.get_movement_pattern(object, x_pos, y_pos)

        for (let i = 0; i < resultArray.length; i++) {
            for (let j = 0; j < resultArray[i].length; j++) {
                if (resultArray[i][j] === 1) {
                    let css_class = "active"
                    //TODO: check if there is a an ally in the way of the player
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
                    let elem = document.getElementById(`${i}/${j}`)
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
                    let elem = document.getElementById(`${i}/${j}`)
                    elem.classList.add(css_class)
                }
            }
        }
    }

    get_movement_pattern = function (object, x_pos, y_pos) {

        let movement_pattern

        // check if the current chessPiece is a pawn, if so display the movement pattern according to the variable first_move
        if (object instanceof Pawn) {
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

        let possible_moves = this.calculate_move_directions(object, piece_positions)
        return possible_moves
    }

    calculate_move_directions = function (player, allowed_positions) {
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
            allowed_positions = player[player.movement_directions[i]](player_position, allowed_positions, this.current_player);
        }

        //       | |               (_)       | |    | |
        //   ___ | |_  _ __   __ _  _   __ _ | |__  | |_
        //  / __|| __|| '__| / _` || | / _` || '_ \ | __|
        //  \__ \| |_ | |   | (_| || || (_| || | | || |_
        //  |___/ \__||_|    \__,_||_| \__, ||_| |_| \__|
        //                              __/ |
        //                             |___/

        //forward

        // for (let i = player_position.y; i >= 0; i--) {
        //     if (allowed_positions[i][player_position.x] instanceof ChessPiece && allowed_positions[i][player_position.x].color === this.current_player) {
        //         // for correctness using y as the loop variable here and x in the other ones
        //         for (let y = i; y >= 0; y--) {
        //             allowed_positions[y][player_position.x] = 0;
        //         }
        //         break;
        //     }
        //     // for documentation purposes the full else if statement is used here -> might cause problems when doing changes but its better for readability imo
        //     else if (allowed_positions[i][player_position.x] instanceof ChessPiece && allowed_positions[i][player_position.x].color != this.current_player) {
        //         // for correctness using y as the loop variable here and x in the other ones
        //         for (let y = i; y >= 0; y--) {
        //             allowed_positions[y][player_position.x] = 0;
        //         }
        //         // reset the enemies position with a 1 so it will get colored red
        //         allowed_positions[i][player_position.x] = 1
        //         break;
        //     }
        // }

        // right
        //  for (let i = player_position.x; i <= allowed_positions.length; i++) {
        //      if (allowed_positions[player_position.y][i] instanceof ChessPiece && allowed_positions[player_position.y][i].color === this.current_player) {
        //
        //          for (let x = i; x < allowed_positions.length; x++) {
        //              allowed_positions[player_position.y][x] = 0;
        //          }
        //          break;
        //      }
        //      else if (allowed_positions[player_position.y][i] instanceof ChessPiece && allowed_positions[i][player_position.x].color != this.current_player) {
        //          for (let x = i; x < allowed_positions.length; x++) {
        //              allowed_positions[player_position.y][x] = 0;
        //          }
        //          // replace the enemies position with a 1 so it will get colored red
        //          allowed_positions[i][player_position.x] = 1
        //          break;
        //      }
        //  }

        // left
        //  for (let i = player_position.x; i >= 0; i--) {
        //      if (allowed_positions[player_position.y][i] instanceof ChessPiece && allowed_positions[player_position.y][i].color === this.current_player) {
        //          for (let x = i; x >= 0; x--) {
        //              allowed_positions[player_position.y][x] = 0;
        //          }
        //          break;
        //      }
        //      else if (allowed_positions[player_position.y][i] instanceof ChessPiece && allowed_positions[player_position.y][i].color != this.current_player) {
        //          for (let x = i; x >= 0; x--) {
        //              allowed_positions[player_position.y][x] = 0;
        //          }
        //          // replace the enemies position with a 1 so it will get colored red
        //          allowed_positions[player_position.y][i] = 1
        //          break;
        //      }
        //  }

        //straight backwards 
        //  for (let i = player_position.y; i < allowed_positions.length; i++) {
        //      if (allowed_positions[i][player_position.x] instanceof ChessPiece && allowed_positions[i][player_position.x].color === this.current_player) {
        //          // for correctness using y as the loop variable here and x in the other ones
        //          for (let y = i; y < allowed_positions.length; y++) {
        //              allowed_positions[y][player_position.x] = 0;
        //          }
        //          break;
        //      }
        //      // for documentation purposes the full else if statement is used here -> might cause problems when doing changes but its better for readability imo
        //      else if (allowed_positions[i][player_position.x] instanceof ChessPiece && allowed_positions[i][player_position.x].color != this.current_player) {
        //          // for correctness using y as the loop variable here and x in the other ones
        //          for (let y = i; y < allowed_positions.length; y++) {
        //              allowed_positions[y][player_position.x] = 0;
        //          }
        //          // reset the enemies position with a 1 so it will get colored red
        //          allowed_positions[i][player_position.x] = 1
        //          break;
        //      }
        //  }

        // ______  _                                     _ 
        // |  _  \(_)                                   | |
        // | | | | _   __ _   __ _   ___   _ __    __ _ | |
        // | | | || | / _` | / _` | / _ \ | '_ \  / _` || |
        // | |/ / | || (_| || (_| || (_) || | | || (_| || |
        // |___/  |_| \__,_| \__, | \___/ |_| |_| \__,_||_|
        //                    __/ |                        
        //                   |___/     

        //diagonal left top
        // for (let x = player_position.x, y = player_position.y; x >= 0 && y >= 0; x--, y--) {
        //     if (allowed_positions[y][x] instanceof ChessPiece && allowed_positions[y][x].color === this.current_player) {
        //         //introducing a second variable x2,y2
        //         for (let x2 = x, y2 = y; x2 >= 0 && y2 >= 0; x2--, y2--) {
        //             allowed_positions[y2][x2] = 0;
        //         }
        //         break;
        //     }
        //     // for documentation purposes the full else if statement is used here -> might cause problems when doing changes but its better for readability imo
        //     else if (allowed_positions[y][x] instanceof ChessPiece && allowed_positions[y][x].color != this.current_player) {
        //         for (let x2 = x, y2 = y; x2 >= 0 && y2 >= 0; y2--, x2--) {
        //             allowed_positions[y2][x2] = 0;
        //         }
        //         // reset the enemies position with a 1 so it will get colored red
        //         allowed_positions[y][x] = 1
        //         break;
        //     }
        // }

        //diagonal right bottom
        //  for (let x = player_position.x, y = player_position.y; x < allowed_positions.length && y < allowed_positions.length; x++, y++) {
        //      if (allowed_positions[y][x] instanceof ChessPiece && allowed_positions[y][x].color === this.current_player) {
        //          //introducing a second variable x2,y2
        //          for (let x2 = x, y2 = y; x2 < allowed_positions.length && y2 < allowed_positions.length; x2++, y2++) {
        //              allowed_positions[y2][x2] = 0;
        //          }
        //          break;
        //      }
        //      // for documentation purposes the full else if statement is used here -> might cause problems when doing changes but its better for readability imo
        //      else if (allowed_positions[y][x] instanceof ChessPiece && allowed_positions[y][x].color != this.current_player) {
        //          for (let x2 = x, y2 = y; x2 < allowed_positions.length && y2 < allowed_positions.length; x2++, y2++) {
        //              allowed_positions[y2][x2] = 0;
        //          }
        //          // reset the enemies position with a 1 so it will get colored red
        //          allowed_positions[y][x] = 1
        //          break;
        //      }
        //  }

        //  //diagonal right top
        //  for (let x = player_position.x, y = player_position.y; x < allowed_positions.length && y < allowed_positions.length; x++, y--) {
        //      if (allowed_positions[x][y] instanceof ChessPiece && allowed_positions[x][y].color === this.current_player) {
        //          //introducing a second variable
        //          for (let x2 = x, y2 = y; x2 >= 0 && y2 < allowed_positions.length; x2--, y2++) {
        //              allowed_positions[x2][y2] = 0;
        //          }
        //          break;
        //      }
        //      // for documentation purposes the full else if statement is used here -> might cause problems when doing changes but its better for readability imo
        //      else if (allowed_positions[x][y] instanceof ChessPiece && allowed_positions[x][y].color != this.current_player) {
        //          for (let x2 = x, y2 = y; x2 >= 0 && y2 < allowed_positions.length; x2--, y2++) {
        //              allowed_positions[x2][y2] = 0;
        //          }
        //          // reset the enemies position with a 1 so it will get colored red
        //          allowed_positions[x][y] = 1
        //          break;
        //      }
        //  }

        //  //diagonal left bottom 
        //  //commented out for testing purposes
        //  for (let x = player_position.x, y = player_position.y; x >= 0 && y < allowed_positions.length; x--, y++) {
        //      if (allowed_positions[y][x] instanceof ChessPiece && allowed_positions[y][x].color === this.current_player) {
        //          //introducing a second variable x2,y2
        //          for (let x2 = x, y2 = y; x2 >= 0 && y2 < allowed_positions.length; x2--, y2++) {
        //              allowed_positions[y2][x2] = 0;
        //          }
        //          break;
        //      }
        //      // for documentation purposes the full else if statement is used here -> might cause problems when doing changes but its better for readability imo
        //      else if (allowed_positions[y][x] instanceof ChessPiece && allowed_positions[y][x].color != this.current_player) {
        //          //introducing a second variable x2,y2
        //          for (let x2 = x, y2 = y; x2 >= 0 && y2 < allowed_positions.length; x2--, y2++) {
        //              allowed_positions[y2][x2] = 0;
        //          }
        //          // reset the enemies position with a 1 so it will get colored red
        //          allowed_positions[x][y] = 1
        //          break;
        //      }
        //  }
        return allowed_positions;
    }

    project_piece_position_to_movement_pattern = function (movement_pattern) {
        let resultArray = movement_pattern
        for (let i = 0; i < movement_pattern.length; i++) {
            for (let j = 0; j < movement_pattern[i].length; j++) {
                if (this.board[j][i] != null && movement_pattern[j][i] === 1) {
                    resultArray[j][i] = this.board[j][i]
                }
                else {
                }
            }
        }
        return resultArray
    }

    handleSquareClick = function (y, x) {
        //show movement pattern only for the active player
        if (this.board[y][x] != null) {
            if (this.board[y][x].color === this.current_player) {
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
                this.display_movement_pattern(this.board[y][x], x, y)
            }
        }

        /*
        check if the clicked square is a valid move
        check if there is an enemy on the square
        check if its players turn

        -> if null or enemy
            move to position/kill 
        */

        if (this.board[y][x] === null) {
            for (let i = 0; i < this.board.length; i++) {
                for (let j = 0; j < this.board[i].length; j++) {
                    if (this.board[j][i] != null) {
                        if (this.board[j][i].active) {
                            // hand over the active chess piece

                            if (this.validateMove(this.board[j][i], [x, y])) {

                                this.movePiece(this.board[j][i], [x, y])
                                console.log("checking for piece promotion after move")
                                this.check_for_pawn_promotion(this.board[y][x], [x, y])
                            }
                        }
                    }
                }
            }
        }

        else if (this.board[y][x] instanceof ChessPiece && this.board[y][x].color != this.current_player) {
            for (let i = 0; i < this.board.length; i++) {
                for (let j = 0; j < this.board[i].length; j++) {
                    if (this.board[j][i] != null) {
                        if (this.board[j][i].active) {
                            // hand over the active chess piece
                            if (this.validateMove(this.board[j][i], [x, y], this.board[y][x])) {
                                this.killPiece(this.board[y][x])
                                this.movePiece(this.board[j][i], [x, y])
                                console.log("checking for piece promotion after kill")
                                this.check_for_pawn_promotion(this.board[y][x], [x, y])

                            }
                            else {
                                continue
                            }
                        }
                    }
                }
            }
        }
    }

    movePiece = function (piece, to) {

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

        //if the move was valid - switch to the other player
        this.current_player = this.current_player === "white" ? "black" : "white"
        document.getElementById("turn").innerHTML = `It's <b>${this.current_player}'s</b> turn`
        this.render()

    }

    killPiece = function (piece) {
        piece.killed = true
        this.killed_pieces.push(piece)
        this.render_killed()
    }

    render_killed = function () {
        let killed_blk = document.getElementById('killedblk')
        killed_blk.innerHTML = ""
        let killed_wht = document.getElementById('killedwht')
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

    validateMove = function (piece, to, piece2) {
        //if there was no piece killed, just validate with the movement pattern
        if (piece2 === undefined) {
            let pattern = this.get_movement_pattern(piece, piece.position.x, piece.position.y)
            for (let i = 0; i < pattern.length; i++) {
                for (let j = 0; j < pattern[i].length; j++) {
                    const element = pattern[i][j];
                    if (element === 1) {
                        if (i === to[1] && j === to[0]) {
                            return true
                        }
                    }
                }
            }
            return false
        }

        // if there was a kill, check if the kill pattern is valid
        else if (piece2 != undefined) {
            //if the "killer" was a pawn
            // find all the 3's in the resultArray and check if the positions are the same as the position of the killed piece

            if (piece instanceof Pawn) {
                let pattern = this.get_movement_pattern(piece, piece.position.x, piece.position.y)
                for (let i = 0; i < pattern.length; i++) {
                    for (let j = 0; j < pattern[i].length; j++) {
                        let element = pattern[i][j];
                        if (element === 3) {
                            return true
                        }
                    }
                }
                return false
            }
            else {
                let pattern = this.get_movement_pattern(piece, piece.position.x, piece.position.y)
                for (let i = 0; i < pattern.length; i++) {
                    for (let j = 0; j < pattern[i].length; j++) {
                        const element = pattern[i][j];
                        if (element === 1) {
                            if (i === to[1] && j === to[0]) {
                                return true
                            }
                        }
                    }
                }
                return false
            }

        }

    }

    check_for_checkmate = function () {
        this.get_all_valid_moves_for_color(color)
    }

    check_for_pawn_promotion = function (piece, to) {
        // if a pawn reaches the other side of the board give a player the opportunity to select a new chesspiece
        if (piece instanceof Pawn) {
            // check if it is either a black or a white colored piece on row 0 or row 7 of the board
            // split into two lines to improve readability
            if (to[1] === 0 && piece.color === "white") {
                this.show_promotion_dialog(true, to[1], to[0], this.board[to[1]][to[0]].color, this.board[to[1]][to[0]])
            }

            if (to[1] === 7 && piece.color === "black") {
                this.show_promotion_dialog(true, to[1], to[0], this.board[to[1]][to[0]].color, this.board[to[1]][to[0]])
            }
        }

        else {
            return;
        }
    }

    get_all_valid_moves_for_color = function (color) {
        //this function will return all the possible moves for the other color, so we can determine the possible check positions
        opponent_color = ""
        if (color === "white") {
            opponent_color = "black"
        }

        else {
            opponent_color = "white"
        }

    }
    show_promotion_dialog = function (visibility, position_to_x, position_to_y, color_to_display, _piece) {
        let promotionOptionsElement = document.getElementById(`promotionOptions${color_to_display}`);
        const promotionOptions = [new Queen(color_to_display, -1, -1), new Rook(color_to_display, -1, -1), new Bishop(color_to_display, -1, -1), new Knight(color_to_display, -1, -1)]; // Queen, Rook, Bishop, Knight
        
        if (visibility) {
            // Display promotion options at the clicked square
            promotionOptionsElement.innerHTML = promotionOptions.map(piece => `<img class='sprite' id = '${piece.constructor.name}' src='${piece.imgUrl}'/>`).join('');
            promotionOptionsElement.addEventListener("click", (e) => { _piece.promote(e.target.id, this, position_to_x, position_to_y, color_to_display) });
            promotionOptionsElement.style.top = `${position_to_x * 50}px`;
            promotionOptionsElement.style.left = `${position_to_y * 50}px`;
            promotionOptionsElement.style.display = 'block';
        }

        else {
            promotionOptionsElement.innerHTML = ""
        }

    }
}

export { ChessBoard }