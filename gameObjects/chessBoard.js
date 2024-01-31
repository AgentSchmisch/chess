// TODO: improve render performance -> only rerender the changed items
// TODO: create board layout with respect to the board_configuration array

import { ChessPiece, Rook, Knight, Bishop, King, Queen, Pawn } from "./ChessPiece.js"
import { startNew } from "../script.js"
import { Board } from "../tests/configurations.js"

class ChessBoard {
    current_player = "white"

    killed_pieces = []

    constructor(configuration, board_old, current_player, killed_pieces) {
        if (configuration === "initial") {
            this.board = this.initializeBoard()
        }

        else {
            this.current_player = current_player
            this.killed_pieces = killed_pieces
            this.board = this.restore_Board(board_old)
        }

    }

    initializeBoard() {

        let board = []

        // clear the killed pieces
        this.killed_pieces = []

        //creating the basic game board, which gets filled with characters later
        for (let x = 0; x < 8; x++) {
            board[x] = [];
            for (let y = 0; y < 8; y++) {
                board[x][y] = null;
            }
        }

        // having to deep copy the array, because just returning the Board.initial property would just return a pointer
        // thus editing the object in configurations.js

        let deepCopy = Array.from({ length: 8 }, () => Array(8).fill(null));

        for (let i = 0; i < Board.initial.length; i++) {
            deepCopy[i] = [...Board.initial[i]];
        }

        return deepCopy

    }

    restore_Board(board_old) {
        /*
        This function will take the board state from the LocalStorage and restore all the objects on the board

        ## Parameters:
        - board_old: object that contains all the information per board square

        ## Return values:
        - board: the board array
        */

        let board = Array.from({ length: 8 }, () => Array(8).fill(0));

        for (let y = 0; y < board_old.length; y++) {
            for (let x = 0; x < board_old[y].length; x++) {

                if (board_old[y][x] != null) {
                    let key = Object.keys(board_old[y][x])[0]
                    let pieces = {
                        "Pawn": new Pawn(board_old[y][x][key].color, y, x, board_old[y][x][key].first_move),
                        "Knight": new Knight(board_old[y][x][key].color, y, x),
                        "Bishop": new Bishop(board_old[y][x][key].color, y, x),
                        "Rook": new Rook(board_old[y][x][key].color, y, x),
                        "King": new King(board_old[y][x][key].color, y, x, board_old[y][x][key].checked, board_old[y][x][key].possible_positions),
                        "Queen": new Queen(board_old[y][x][key].color, y, x),
                    }

                    board[y][x] = pieces[key]
                }

                else {
                    board[y][x] = null
                }
            }
        }
        this.render_killed()
        return board
    }

    render() {
        /*
        This function will render the current Board state
        ## Parameters:
        None

        ## Return values:
        None
*/
        const chessboardElement = document.getElementById('chessboard');
        //clear the chessboard every time its rerendered
        chessboardElement.innerHTML = '';

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const squareElement = document.createElement('div');
                squareElement.classList.add('square', (i + j) % 2 === 0 ? 'white' : 'black');
                squareElement.setAttribute("id", `${i}/${j}`)
                squareElement.innerHTML = this.board[i][j] instanceof ChessPiece ? `<img class='sprite' src='${this.board[i][j].imgUrl}'/>` : "";
                squareElement.addEventListener('click', () => this.handle_square_click(i, j));
                chessboardElement.appendChild(squareElement);
            }
        }
        document.getElementById("turn").innerHTML = `It's <b>${this.current_player}'s</b> turn`
    }

    save_board_state() {
        /*
This function will save the Board state to the LocalStorage
## Parameters:
None

## Return values:
None
*/
        localStorage.setItem("board_data", JSON.stringify(this))
        let temp_board = Array.from({ length: 8 }, () => Array(8).fill(0));
        for (let y = 0; y < this.board.length; y++) {
            for (let x = 0; x < this.board[y].length; x++) {
                let cell_data = {}
                if (this.board[y][x] != null) {
                    cell_data[this.board[y][x].constructor.name] = this.board[y][x]
                }
                else {
                    cell_data = null
                }

                temp_board[y][x] = cell_data

            }
        }
        localStorage.setItem("board", JSON.stringify(temp_board))
    }

    display_movement_pattern(object, x_pos, y_pos) {
        /*
This function will display the movement pattern of the currently klicked square
## Parameters:
- object -> the currently clicked object
- x_pos -> the clicked square's x-position
- y_pos -> the clicked square's y-position
 

## Return values:
None
*/
        object.active = true
        // remove the active class from any square
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                let elem = document.getElementById(`${i}/${j}`)
                elem.classList.remove("active", "kill")
            }
        }

        let king
        let resultArray = Array.from({ length: 8 }, () => Array(8).fill(0))

        // if the king has been found break the loop
        // outerloop is a label so we can break the loop once we found the king
        outerloop: for (let y = 0; y < this.board.length; y++) {
            for (let x = 0; x < this.board[y].length; x++) {
                if (this.board[y][x] instanceof King && this.board[y][x].color === this.current_player) {
                    king = this.board[y][x];
                    break outerloop
                }
            }
        }

        if (king.position.x === x_pos && king.position.y === y_pos) {
            // remove the positions that would be a check from the array
            for (let position of king.possible_positions) {
                resultArray[position[1]][position[0]] = 1
            }
        }

        else {
            resultArray = this.get_movement_pattern(object, x_pos, y_pos, this.current_player)
        }

        if (resultArray) {
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
    }

    get_movement_pattern(object, x_pos, y_pos, color) {
        /*
This function will get the movement pattern for a chesspiece
## Parameters:
- object -> the currently clicked object
- x_pos -> the clicked square's x-position
- y_pos -> the clicked square's y-position
- color -> the color of the piece

## Return values:
- possible_moves -> all the moves that the piece is allowed to make
*/
        //DONT TOUCH THIS FUNCTION ANYMORE YOURE ONLY CAUSING TROUBLE!!!!!!!!

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

    calculate_move_directions(player, allowed_positions, color) {
        //this method will calculate the possible movement directions
        // - straight ahead
        // - right
        // - back
        // - left
        // - diagonally in all directions
        // - the special movement pattern for the Knight

        if (!(player instanceof Knight)) {

            let player_position = player.position

            for (let i = 0; i < player.movement_directions.length; i++) {
                // allowed positions gets fed into the functions over and over again
                //therefore the final array get built up gradually
                allowed_positions = player[player.movement_directions[i]](player_position, allowed_positions, color);
            }
        }

        else {
            for (let y = 0; y < allowed_positions.length; y++) {
                for (let x = 0; x < allowed_positions[y].length; x++) {
                    if (allowed_positions[y][x] != 0)
                        if (allowed_positions[y][x].color != player.color) {
                            allowed_positions[y][x] = 1;
                        }
                        else {
                            allowed_positions[y][x] = 0;
                        }
                    allowed_positions[player.position.y][player.position.x] = 0
                }
            }
        }
        return allowed_positions;
    }

    project_piece_position_to_movement_pattern(movement_pattern) {
        /*
This function will project the current piece positions to the movement pattern
## Parameters:
- movement_pattern -> the movement pattern of the chess piece

## Return values:
- resultArray -> the projected chessboard
*/
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

    handle_square_click(y, x) {
        // this function will be called upon clicking a square

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
                // check if the king of the current player is in a check position
                // if so, dont allow any other moves than the ones that will protect the king
                // first the king is only allowed to move

                //find the king on the board
                let king
                for (let y = 0; y < this.board.length; y++) {
                    for (let x = 0; x < this.board[y].length; x++) {
                        if (this.board[y][x] instanceof King && this.board[y][x].color === this.current_player) {
                            king = this.board[y][x];
                        }
                    }
                }

                // if the king got clicked by the player
                if (king.checked && king.color === this.current_player) {
                    // allow the king to move on squares that are not under attack
                    if (king.position.x === x && king.position.y === y) {
                        console.log("selected the king")
                        this.display_movement_pattern(this.board[y][x], x, y)
                    }
                    // check if there is any piece that would prevent the move being a check
                    if (king.position.x != x || king.position.y != y) {
                        console.log("checking for pieces that could block the check");
                    }
                }

                // if the king is not in a check, allow all moves
                else if (!king.checked) {
                    this.display_movement_pattern(this.board[y][x], x, y)
                }
            }
        }

        /*
        check if the clicked square is a valid move
        check if there is an enemy on the square
        check if its players turn

        -> if null or enemy
            move to position/kill
        */

        // if the piece is moved to an empty position
        if (this.board[y][x] === null) {
            outerloop: for (let i = 0; i < this.board.length; i++) {
                for (let j = 0; j < this.board[i].length; j++) {
                    if (this.board[j][i] != null) {
                        if (this.board[j][i].active) {
                            // hand over the active chess piece
                            if (this.validateMove(this.board[j][i], [x, y])) {
                                this.board[j][i].movePiece(x, y, this);
                                //check if there is a pawn applicable for a promotion
                                this.check_for_pawn_promotion(this.board[y][x], [x, y])
                                this.current_player = this.current_player === "white" ? "black" : "white"
                                document.getElementById("turn").innerHTML = `It's <b>${this.current_player}'s</b> turn`
                                this.save_board_state();
                                if (this.check_for_checkmate(this.current_player)) {
                                    break outerloop;
                                }
                                else {
                                    //refresh the possible_positions for the enemy player as well
                                    this.check_for_forbidden_king_moves();
                                }
                            }
                        }
                    }
                }
            }
        }

        //if there is an enemy piece on the square
        else if (this.board[y][x] instanceof ChessPiece && this.board[y][x].color != this.current_player) {
            outerloop: for (let i = 0; i < this.board.length; i++) {
                for (let j = 0; j < this.board[i].length; j++) {
                    if (this.board[j][i] != null) {
                        if (this.board[j][i].active) {
                            // hand over the active chess piece and check if the move was valid
                            if (this.validateMove(this.board[j][i], [x, y], this.board[y][x])) {
                                this.board[y][x].killPiece(this);
                                this.board[j][i].movePiece(x, y, this);
                                //check if there is a pawn applicable for a promotion
                                this.check_for_pawn_promotion(this.board[y][x], [x, y])
                                this.current_player = this.current_player === "white" ? "black" : "white"
                                document.getElementById("turn").innerHTML = `It's <b>${this.current_player}'s</b> turn`
                                this.save_board_state()
                                if (this.check_for_checkmate(this.current_player)) {
                                    break outerloop;
                                }
                                else {
                                    this.check_for_forbidden_king_moves();
                                }
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

    render_killed() {
        // This function will display the killed pieces on the side of the board
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

    validateMove(piece, to, piece2) {
        /*
        This function will validate the move that a player has done
        ## Parameters:
        - piece -> the moved chesspiece
        - to -> the position the piece got moved to
        - piece2 -> undefined, in case no piece was killed, has a value if a piece has been captured
        

        ## Return values:
        true - in case move was valid
        false - in case move was not valid
        */

        //if there was no piece killed, just validate with the movement pattern
        if (piece2 === undefined) {
            // if the piece was a King use only the positions from possible_positions
            if (piece instanceof King) {
                for (let position of piece.possible_positions) {
                    if (position[0] === to[0] && position[1] === to[1]) {
                        return true
                    }

                    else {
                        return false
                    }
                }
            }
            // for any other piece use the movement pattern
            else {

                let pattern = this.get_movement_pattern(piece, piece.position.x, piece.position.y, this.current_player)
                if (pattern[to[1]][to[0]] === 1) {
                    return true
                }
                else
                    return false
            }
        }

        // if there was a kill, check if the kill pattern is valid
        else if (piece2 != undefined) {
            if (piece instanceof King) {
                for (let position of piece.possible_positions) {
                    if (position[0] === to[0] && position[1] === to[1]) {
                        return true
                    }

                    else {
                        return false
                    }
                }
            }
            //if the "killer" was a pawn
            else if (piece instanceof Pawn) {
                let pattern = this.get_movement_pattern(piece, piece.position.x, piece.position.y, this.current_player)
                if (pattern[to[1]][to[0]] === 3) {
                    return true
                }
                else
                    return false
            }

            else {
                let pattern = this.get_movement_pattern(piece, piece.position.x, piece.position.y, this.current_player)
                if (pattern[to[1]][to[0]] === 1) {
                    return true
                }
                else
                    return false

            }

        }
    }

    check_for_checkmate(current_player) {
         /*this function will check for the king of a color being in a checkmate position
         Parameters
         - current_player -> The current player

        return values
        - true -> if the king is in a checkmate position
        - false -> if everything is fine
         */
        let valid_moves = this.get_all_valid_moves_for_color(current_player)
        let king
        // find the current position of the king
        for (let y = 0; y < this.board.length; y++) {
            for (let x = 0; x < this.board[y].length; x++) {
                if (this.board[y][x] instanceof King) {
                    if (this.board[y][x].color === current_player) {
                        king = this.board[y][x]
                    }
                }
                else
                    continue;
            }
        }
        // get the movement pattern for the king
        let movement_pattern = this.get_movement_pattern(king, king.position.x, king.position.y, king.color);
        // compare the valid_moves to the movement_pattern and check if there are any possible positions left
        for (let y = 0; y < movement_pattern.length; y++) {
            for (let x = 0; x < movement_pattern[y].length; x++) {
                //possible solution:
                //check for a 1 or 3 on the kings position
                if (valid_moves[king.position.y][king.position.x] === 1 || valid_moves[king.position.y][king.position.x] === 3) {
                    king.checked = true
                }

                else
                    king.checked = false
            }
        }
        console.log(`${king.color}'s king is checked`, king.checked)

        // variable to store number of remaining moves in
        let possible_moves = []

        if (king.checked) {
            // check if there are any alternative moves
            // if not, kill the king and show gameover
            for (let y = 0; y < movement_pattern.length; y++) {
                for (let x = 0; x < movement_pattern[y].length; x++) {
                    if (movement_pattern[y][x] === 1) {
                        if (valid_moves[y][x] >= 1) {
                            // if an enemy piece can move to this position do nothing
                        }
                        // there are still moves that the king can make, add the x,y coordinates to the possible positions array
                        else {
                            possible_moves.push([x, y]);
                            this.board[king.position.y][king.position.x].possible_positions = possible_moves
                            return false
                        }
                    }
                }
            }
            if (possible_moves.length === 0) {
                this.show_gameover_dialog(king.color)
                return true
            }

        }


    }

    check_for_pawn_promotion(piece, to) {
        // This function will check if there is a pawn of the opposite color on the first rank

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

    check_for_en_passant() {
        //TODO: implement this function
    }

    get_all_valid_moves_for_color(color) {
        //this function will return all the possible moves for the other color, so we can determine the possible check positions


        let opponent_color = ""
        let final = Array.from({ length: 8 }, () => Array(8).fill(0));
        let all_moves = []
        if (color === "white") {
            opponent_color = "black"
        }

        else {
            opponent_color = "white"
        }

        // gather all the figures of one color, then calculate all the possible moves that can be done by this color
        // overlay the the current pieces on the board
        //if the opponent color = white start from the
        if (opponent_color === "white") {
            for (let y = 0; y < this.board.length; y++) {
                for (let x = 0; x < this.board[y].length; x++) {
                    //ommit own and empty chesspieces
                    if (this.board[y][x] != null) {
                        if (this.board[y][x].color === opponent_color) {
                            // doing a lot of steps at the same time ... final result is the movement pattern per piece merged with the current board state
                            let movements_for_piece = this.get_movement_pattern(this.board[y][x], this.board[y][x].position.x, this.board[y][x].position.y, opponent_color)
                            let board_param = this.board[y][x].constructor.name
                            let obj = {}
                            obj[board_param] = movements_for_piece
                            all_moves.push(obj)
                        }
                    }
                }
            }

            for (let i = 0; i < all_moves.length; i++) {
                if (all_moves[i]["Pawn"] != undefined) {
                    for (let y = 0; y < all_moves[i]["Pawn"].length; y++) {
                        for (let x = 0; x < all_moves[i]["Pawn"][y].length; x++) {
                            if (all_moves[i]["Pawn"][x][y] === 3) {
                                if (final[x][y] < 3) {
                                    // if the value is already 3, dont set another one
                                    final[x][y] = all_moves[i]["Pawn"][x][y]
                                }
                            }
                        }
                    }
                }

                else {
                    let key = Object.keys(all_moves[i])[0]
                    for (let y = 0; y < all_moves[i][key].length; y++) {
                        for (let x = 0; x < all_moves[i][key][y].length; x++) {
                            if (all_moves[i][key][x][y] === 1) {
                                if (final[x][y] < 1) {
                                    // if the value is already 1, dont set another one
                                    final[x][y] = all_moves[i][key][x][y]
                                }
                            }
                        }
                    }
                }
            }
        }

        // if the opponents color is black start from the bottom bc the white pieces are needed to be checked
        else if (opponent_color === "black") {
            for (let y = this.board.length - 1; y >= 0; y--) {
                for (let x = this.board[y].length - 1; x >= 0; x--) {
                    //ommit own and empty chesspieces
                    if (this.board[y][x] != null) {
                        if (this.board[y][x].color === opponent_color) {
                            // doing a lot of steps at the same time ... final result is the movement pattern per piece merged with the current board state
                            let movements_for_piece = this.get_movement_pattern(this.board[y][x], this.board[y][x].position.x, this.board[y][x].position.y, opponent_color)
                            let board_param = this.board[y][x].constructor.name
                            let obj = {}
                            obj[board_param] = movements_for_piece
                            all_moves.push(obj)
                        }
                    }
                }
            }

            for (let i = 0; i < all_moves.length; i++) {
                if (all_moves[i]["Pawn"] != undefined) {
                    for (let y = 0; y < all_moves[i]["Pawn"].length; y++) {
                        for (let x = 0; x < all_moves[i]["Pawn"][y].length; x++) {
                            if (all_moves[i]["Pawn"][x][y] === 3) {
                                if (final[x][y] < 3) {
                                    // if the value is already 3, dont set another one
                                    final[x][y] = all_moves[i]["Pawn"][x][y]
                                }
                            }
                        }
                    }
                }

                else {
                    let key = Object.keys(all_moves[i])[0]
                    for (let y = 0; y < all_moves[i][key].length; y++) {
                        for (let x = 0; x < all_moves[i][key][y].length; x++) {
                            if (all_moves[i][key][x][y] === 1) {
                                if (final[x][y] < 1) {
                                    // if the value is already 1, dont set another one
                                    final[x][y] = all_moves[i][key][x][y]
                                }
                            }
                        }
                    }
                }
            }
        }
        return final;
    }

    show_promotion_dialog(visibility, position_to_x, position_to_y, color_to_display, _piece) {
        // this function will show a dialog once a pawn is ready to be promoted

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

    show_gameover_dialog(winner) {
        // This function will show the gameover dialog
        
        let gameOverContainer = document.querySelector(".gameOver")
        let winnerContainer = document.querySelector(".winner")
        let gameContainer = document.querySelector(".gameScreen")
        gameContainer.style.display = "none"
        gameOverContainer.style.display = "flex"
        winnerContainer.innerHTML = `
        <img class='sprite' src='gameObjects/sprites/${winner}/queen.png'/>
        <div><b>${winner}</b> wins the game</div>
        `
        localStorage.clear();
        console.log("game over")
        let newGame = document.getElementById("new1")
        newGame.addEventListener("click", startNew)
        console.log(`${winner} wins the game`)
    }

    check_for_forbidden_king_moves() {
        /*
        this function will refresh the possible moves array for each color
        */

        // find the king on the board and save its position to a variable
        let white_king
        let black_king

        for (let y = 0; y < this.board.length; y++) {
            for (let x = 0; x < this.board[y].length; x++) {
                if (this.board[y][x] instanceof King) {
                    if (this.board[y][x].color === "black") {
                        black_king = this.board[y][x]
                    }

                    if (this.board[y][x].color === "white") {
                        white_king = this.board[y][x]
                    }
                }
            }
        }
        // get the moves per color array, the function reverses the color from the parameter
        let moves_white = this.get_all_valid_moves_for_color("black")
        let moves_black = this.get_all_valid_moves_for_color("white")

        //get the moves for the kings, to compare them with the opponents moves
        let white_king_moves = this.get_movement_pattern(white_king, white_king.position.x, white_king.position.y, "white")
        let black_king_moves = this.get_movement_pattern(black_king, black_king.position.x, black_king.position.y, "black")
        console.log(moves_white, black_king_moves)
        //remove all old possible positions from the array
        this.board[black_king.position.y][black_king.position.x].possible_positions = []
        this.board[white_king.position.y][white_king.position.x].possible_positions = []

        for (let y = 0; y < black_king_moves.length; y++) {
            for (let x = 0; x < black_king_moves[y].length; x++) {
                // if there is a 1 of the white moves array, dont add the position to the possible moves array
                if (black_king_moves[y][x] === 1) {
                    if (moves_white[y][x] === 1 || moves_white[y][x] === 3) {
                    }
                    else {
                        this.board[black_king.position.y][black_king.position.x].possible_positions.push([x, y])
                    }
                }
            }
        }

        for (let y = 0; y < white_king_moves.length; y++) {
            for (let x = 0; x < white_king_moves[y].length; x++) {
                // if there is a 1 of the white moves array, dont add the position to the possible moves array
                if (white_king_moves[y][x] === 1) {
                    if (moves_black[y][x] === 1 || moves_black[y][x] === 3) {
                    }
                    else {
                        this.board[white_king.position.y][white_king.position.x].possible_positions.push([x, y])
                    }
                }
            }
        }

        console.log("result of illegal move calculation: ", this.board[black_king.position.y][black_king.position.x])
    }
}
export { ChessBoard }