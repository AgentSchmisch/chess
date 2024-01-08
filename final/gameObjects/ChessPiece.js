import { ChessBoard } from "./chessBoard.js"

class ChessPiece {
    color = ""

    //add active flag to know if the piece is being clicked
    active = false
    killed = false

    //current position of the chesspiece
    position = {
        "x": 0,
        "y": 0
    }

    killPiece(board) {
        this.killed = true
        board.killed_pieces.push(this)
        board.render_killed()
    }

    movePiece(x, y, board) {
        //move the piece to the new location
        board.board[y][x] = this
        //remove the old piece from the original position
        board.board[this.position["y"]][this.position["x"]] = null

        if (this instanceof Pawn) {
            this.first_move = false
        }

        // refresh the parameters of the specific object
        this.position["x"] = x;
        this.position["y"] = y;

        //deactivate the piece
        this.active = false

        board.render()

    }

    movement_directions = []

    setMovementDirections() {
        // add the corresponding movement directions to each object according to the movement_directions array
        for (let x = 0; x < this.movement_directions.length; x++) {
            this[this.movement_directions[x]] = this[this.movement_directions[x]].bind(this);
        }
    }

    // add functtion checks for blocked piece
    straight_forward(player_position, allowed_positions, current_player) {

        for (let i = player_position.y; i >= 0; i--) {

            if (allowed_positions[i][player_position.x] instanceof ChessPiece && allowed_positions[i][player_position.x].color === current_player) {
                // for correctness using y as the loop variable here and x in the other ones
                for (let y = i; y >= 0; y--) {
                    allowed_positions[y][player_position.x] = 0;
                }
                break;
            }
            // for documentation purposes the full else if statement is used here -> might cause problems when doing changes but its better for readability imo
            else if (allowed_positions[i][player_position.x] instanceof ChessPiece && allowed_positions[i][player_position.x].color != current_player) {
                // for correctness using y as the loop variable here and x in the other ones
                for (let y = i; y >= 0; y--) {
                    allowed_positions[y][player_position.x] = 0;
                }
                // reset the enemies position with a 1 so it will get colored red
                allowed_positions[i][player_position.x] = 1
                break;
            }
        }

        return allowed_positions;
    }

    straight_backward(player_position, allowed_positions, current_player) {
        for (let i = player_position.y; i < allowed_positions.length; i++) {
            if (allowed_positions[i][player_position.x] instanceof ChessPiece && allowed_positions[i][player_position.x].color === current_player) {
                // for correctness using y as the loop variable here and x in the other ones
                for (let y = i; y < allowed_positions.length; y++) {
                    allowed_positions[y][player_position.x] = 0;
                }
                break;
            }
            // for documentation purposes the full else if statement is used here -> might cause problems when doing changes but its better for readability imo
            else if (allowed_positions[i][player_position.x] instanceof ChessPiece && allowed_positions[i][player_position.x].color != current_player) {
                // for correctness using y as the loop variable here and x in the other ones
                for (let y = i; y < allowed_positions.length; y++) {
                    allowed_positions[y][player_position.x] = 0;
                }
                // reset the enemies position with a 1 so it will get colored red
                allowed_positions[i][player_position.x] = 1
                break;
            }
        }
        return allowed_positions;
    }

    straight_right(player_position, allowed_positions, current_player) {
        for (let i = player_position.x; i < allowed_positions.length; i++) {
            if (allowed_positions[player_position.y][i] instanceof ChessPiece && allowed_positions[player_position.y][i].color === current_player) {
                for (let x = i; x < allowed_positions.length; x++) {
                    allowed_positions[player_position.y][x] = 0;
                }
                break;
            }
            else if (allowed_positions[player_position.y][i] instanceof ChessPiece && allowed_positions[i][player_position.x].color != current_player) {
                for (let x = i; x < allowed_positions.length; x++) {
                    allowed_positions[player_position.y][x] = 0;
                }
                // replace the enemies position with a 1 so it will get colored red
                allowed_positions[player_position.y][i] = 1
                break;
            }
        }
        return allowed_positions
    }

    straight_left(player_position, allowed_positions, current_player) {
        for (let i = player_position.x; i >= 0; i--) {
            if (allowed_positions[player_position.y][i] instanceof ChessPiece && allowed_positions[player_position.y][i].color === current_player) {
                for (let x = i; x >= 0; x--) {
                    allowed_positions[player_position.y][x] = 0;
                }
                break;
            }
            else if (allowed_positions[player_position.y][i] instanceof ChessPiece && allowed_positions[player_position.y][i].color != current_player) {
                for (let x = i; x >= 0; x--) {
                    allowed_positions[player_position.y][x] = 0;
                }
                // replace the enemies position with a 1 so it will get colored red
                allowed_positions[player_position.y][i] = 1
                break;
            }
        }
        return allowed_positions
    }

    diagonal_left_top(player_position, allowed_positions, current_player) {
        for (let x = player_position.x, y = player_position.y; x >= 0 && y >= 0; x--, y--) {
            if (allowed_positions[y][x] instanceof ChessPiece && allowed_positions[y][x].color === current_player) {
                //introducing a second variable x2,y2
                for (let x2 = x, y2 = y; x2 >= 0 && y2 >= 0; x2--, y2--) {
                    allowed_positions[y2][x2] = 0;
                }
                break;
            }
            // for documentation purposes the full else if statement is used here -> might cause problems when doing changes but its better for readability imo
            else if (allowed_positions[y][x] instanceof ChessPiece && allowed_positions[y][x].color != current_player) {
                for (let x2 = x, y2 = y; x2 >= 0 && y2 >= 0; y2--, x2--) {
                    allowed_positions[y2][x2] = 0;
                }
                // reset the enemies position with a 1 so it will get colored red
                allowed_positions[y][x] = 1
                break;
            }
        }
        return allowed_positions
    }

    diagonal_left_bottom(player_position, allowed_positions, current_player) {
        for (let x = player_position.x, y = player_position.y; x >= 0 && y < allowed_positions.length; x--, y++) {
            if (allowed_positions[y][x] instanceof ChessPiece && allowed_positions[y][x].color === current_player) {
                //introducing a second variable x2,y2
                for (let x2 = x, y2 = y; x2 >= 0 && y2 < allowed_positions.length; x2--, y2++) {
                    allowed_positions[y2][x2] = 0;
                }
                break;
            }
            // for documentation purposes the full else if statement is used here -> might cause problems when doing changes but its better for readability imo
            else if (allowed_positions[y][x] instanceof ChessPiece && allowed_positions[y][x].color != current_player) {
                //introducing a second variable x2,y2
                for (let x2 = x, y2 = y; x2 >= 0 && y2 < allowed_positions.length; x2--, y2++) {
                    allowed_positions[y2][x2] = 0;
                }
                // reset the enemies position with a 1 so it will get colored red
                allowed_positions[x][y] = 1
                break;
            }
        }
        return allowed_positions
    }

    diagonal_right_top(player_position, allowed_positions, current_player) {
        for (let x = player_position.x, y = player_position.y; x < allowed_positions.length && y >= 0; x++, y--) {
            if (allowed_positions[y][x] instanceof ChessPiece && allowed_positions[y][x].color === current_player) {
                //introducing a second variable
                for (let x2 = x, y2 = y; y2 >= 0 && x2 < allowed_positions.length; x2++, y2--) {
                    allowed_positions[y2][x2] = 0;
                }

                break;
            }
            // for documentation purposes the full else if statement is used here -> might cause problems when doing changes but its better for readability imo
            else if (allowed_positions[y][x] instanceof ChessPiece && allowed_positions[y][x].color != current_player) {
                for (let x2 = x, y2 = y; y2 >= 0 && x2 < allowed_positions.length; x2++, y2--) {
                    allowed_positions[y2][x2] = 0;
                }
                // reset the enemies position with a 1 so it will get colored red
                allowed_positions[y][x] = 1
                break;
            }
        }
        return allowed_positions
    }

    diagonal_right_bottom(player_position, allowed_positions, current_player) {
        for (let x = player_position.x, y = player_position.y; x < allowed_positions.length && y < allowed_positions.length; x++, y++) {
            if (allowed_positions[y][x] instanceof ChessPiece && allowed_positions[y][x].color === current_player) {
                //introducing a second variable x2,y2
                for (let x2 = x, y2 = y; x2 < allowed_positions.length && y2 < allowed_positions.length; x2++, y2++) {
                    allowed_positions[y2][x2] = 0;
                }
                break;
            }
            // for documentation purposes the full else if statement is used here -> might cause problems when doing changes but its better for readability imo
            else if (allowed_positions[y][x] instanceof ChessPiece && allowed_positions[y][x].color != current_player) {
                for (let x2 = x, y2 = y; x2 < allowed_positions.length && y2 < allowed_positions.length; x2++, y2++) {
                    allowed_positions[y2][x2] = 0;
                }
                // reset the enemies position with a 1 so it will get colored red
                allowed_positions[y][x] = 1
                break;
            }
        }
        return allowed_positions
    }

    constructor(color, y, x) {
        this.color = color;
        this.position.x = x
        this.position.y = y
    }
}

class Pawn extends ChessPiece {
    imgUrl = ""
    first_move = true
    movement_pattern_shift = {
        "white": [2, 1],
        "black": [0, 1]
    }

    // due to the assymetry of the movement pattern of the pawn, it is nessecary to add the color to it
    movement_pattern = {
        "white": [
            [true, [
                [0, 1, 0],
                [3, 1, 3],
                [0, 2, 0]
            ]],
            [
                false, [
                    [0, 0, 0],
                    [3, 1, 3],
                    [0, 2, 0]
                ]
            ]],
        "black":
            [[true, [
                [0, 2, 0],
                [3, 1, 3],
                [0, 1, 0]
            ]],
            [
                false, [
                    [0, 2, 0],
                    [3, 1, 3],
                    [0, 0, 0]
                ]
            ]]
    }

    movement_directions = ["straight_backward", "straight_forward"]
    // needing board, x,y,color
    promote(toCreate, board, x, y, color) {
        // object of possible pieces that can be created
        let possiblePieces = {
            "Knight": new Knight(color, x, y),
            "Queen": new Queen(color, x, y),
            "Rook": new Rook(color, x, y),
            "Bishop": new Bishop(color, x, y),
        }
        // create a new instance of the selected chesspiece
        board.board[x][y] = possiblePieces[toCreate];
        // make the promotiondialog for the current color invisible
        board.show_promotion_dialog(false, "", "", color, "")
        board.render();
    }

    constructor(color, y, x, first_move) {
        if (first_move != undefined) {
            super(color,y,x)
            this.imgUrl = `./gameObjects/sprites/${color}/pawn.png`
            this.setMovementDirections();
            this.first_move = first_move
        }
        else {
            super(color, y, x)
            this.imgUrl = `./gameObjects/sprites/${color}/pawn.png`
            this.setMovementDirections();
        }
    }
}

class Rook extends ChessPiece {
    imgUrl = ""
    movement_pattern_shift = [7, 7]
    movement_pattern = [[
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]]]

    movement_directions = ["straight_backward", "straight_forward", "straight_right", "straight_left"]

    constructor(color, y, x) {
        super(color, y, x)
        this.imgUrl = `./gameObjects/sprites/${color}/rook.png`
    }
}

class Knight extends ChessPiece {
    imgUrl = ""
    movement_pattern_shift = [2, 2]
    movement_pattern = [
        [
            [0, 1, 0, 1, 0],
            [1, 0, 0, 0, 1],
            [0, 0, 2, 0, 0],
            [1, 0, 0, 0, 1],
            [0, 1, 0, 1, 0]]
    ]

    constructor(color, y, x) {
        super(color, y, x)
        this.imgUrl = `./gameObjects/sprites/${color}/knight.png`
    }

}

class Bishop extends ChessPiece {
    imgUrl = ""
    movement_pattern_shift = [6, 6]
    movement_pattern = [[
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]]]

    movement_directions = ["diagonal_left_bottom", "diagonal_left_top", "diagonal_right_bottom", "diagonal_right_top"]

    constructor(color, y, x) {
        super(color, y, x)
        this.imgUrl = `./gameObjects/sprites/${color}/bishop.png`
    }
}

class Queen extends ChessPiece {
    imgUrl = ""
    movement_pattern_shift = [7, 7]
    movement_pattern = [
        [
            [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
            [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
            [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
            [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        ]]

    movement_directions = ["straight_backward", "straight_forward", "straight_right", "straight_left", "diagonal_left_bottom", "diagonal_left_top", "diagonal_right_bottom", "diagonal_right_top"]

    constructor(color, y, x) {
        super(color, y, x)
        this.imgUrl = `./gameObjects/sprites/${color}/queen.png`

    }
}

class King extends ChessPiece {
    imgUrl = ""
    movement_pattern_shift = [1, 1]
    movement_pattern = [
        [
            [1, 1, 1],
            [1, 2, 1],
            [1, 1, 1]
        ]
    ]

    movement_directions = ["straight_backward", "straight_forward", "straight_right", "straight_left", "diagonal_left_bottom", "diagonal_left_top", "diagonal_right_bottom", "diagonal_right_top"]

    constructor(color, y, x) {
        super(color, y, x)
        this.imgUrl = `./gameObjects/sprites/${color}/king.png`
    }
}

// also exporting the super class, useful for checking if a field contains a chesspiece -> smaller numbner of if conditions
export { ChessPiece, Rook, Knight, Bishop, King, Queen, Pawn }