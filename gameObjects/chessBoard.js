// TODO: improve render performance -> only rerender the changed items
// TODO: create board layout with respect to the board_configuration array

import { ChessPiece, Rook, Knight, Bishop, King, Queen, Pawn } from "./ChessPiece.js"
import { startNew } from "../script.js"

class ChessBoard {
    constructor(configuration, board_old, current_player, killed_pieces, piece) {
        if (configuration === "initial") {
            this.board = this.initializeBoard()
            console.log(this.board)
        }
        else if (configuration === "demo") {
            this.board = this.initializeDemoBoard(piece)
        }

        else {
            this.current_player = current_player
            this.killed_pieces = killed_pieces
            this.board = this.restore_Board(board_old)
        }

    }

    current_player = "white"

    killed_pieces = []

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
    initializeDemoBoard = function (piece) {
        let board = Array.from({ length: 8 }, () => Array(8).fill(0));

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
        return board
    }

    restore_Board = function (board_old) {
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
                        "King": new King(board_old[y][x][key].color, y, x),
                        "Queen": new Queen(board_old[y][x][key].color, y, x),
                    }

                    board[y][x] = pieces[key]
                }

                else {
                    board[y][x] = null
                }
            }
        }

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
        document.getElementById("turn").innerHTML = `It's <b>${this.current_player}'s</b> turn`
    }

    save_board_state = function () {
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

    display_movement_pattern = function (object, x_pos, y_pos) {
        object.active = true
        // remove the active class from any square
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                let elem = document.getElementById(`${i}/${j}`)
                elem.classList.remove("active", "kill")
            }
        }

        let resultArray = this.get_movement_pattern(object, x_pos, y_pos, this.current_player)
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

    get_movement_pattern = function (object, x_pos, y_pos, color) {

        //TODO: implement check condition for the king of the color being in check
        let king
        let movement_pattern

        for (let y = 0; y < this.board.length; y++) {
            for (let x = 0; x < this.board[y].length; x++) {
                if (this.board[y][x] instanceof King && this.board[y][x].color === color) {
                    king = this.board[y][x]
                }
            }
        }

        if (king.checked && king.position.x != x_pos && king.position.y != y_pos) {

        }
        else {


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
            console.log(possible_moves)

            return possible_moves
        }
    }

    calculate_move_directions = function (player, allowed_positions, color) {
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
                                this.board[j][i].movePiece(x, y, this);
                                //check if there is a pawn applicable for a promotion
                                this.check_for_pawn_promotion(this.board[y][x], [x, y])
                                this.current_player = this.current_player === "white" ? "black" : "white"
                                document.getElementById("turn").innerHTML = `It's <b>${this.current_player}'s</b> turn`
                                this.check_for_checkmate(this.current_player)
                                this.save_board_state();
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
                                this.board[y][x].killPiece(this);
                                this.board[j][i].movePiece(x, y, this);
                                //check if there is a pawn applicable for a promotion
                                this.check_for_pawn_promotion(this.board[y][x], [x, y])
                                this.current_player = this.current_player === "white" ? "black" : "white"
                                document.getElementById("turn").innerHTML = `It's <b>${this.current_player}'s</b> turn`
                                this.check_for_checkmate(this.current_player)
                                this.save_board_state()
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
            let pattern = this.get_movement_pattern(piece, piece.position.x, piece.position.y, this.current_player)
            if (pattern[to[1]][to[0]] === 1) {
                return true
            }

            else
                return false
        }

        // if there was a kill, check if the kill pattern is valid
        else if (piece2 != undefined) {
            //if the "killer" was a pawn
            if (piece instanceof Pawn) {
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

    check_for_checkmate = function (current_player) {
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
        console.log("movement_king", movement_pattern)
        console.log("possible enemy moves", valid_moves)
        // compare the valid_moves to the movement_pattern and check if there are any possible positions left
        for (let y = 0; y < movement_pattern.length; y++) {
            for (let x = 0; x < movement_pattern[y].length; x++) {
                //if the king is surrounded by the own people, it will also go to checkmate with current implementation
                //possible solution: 
                //check for a 1 or 3 on the kings position
                if (valid_moves[king.position.y][king.position.x] === 1 || valid_moves[king.position.y][king.position.y] === 1) {
                    king.checked = true
                }
                else
                    king.checked = false
            }
        }
        console.log(`${king.color}'s king is checked`, king.checked)

        // variable to store number of remaining moves in
        let possible_moves = 0

        if (king.checked) {
            // check if there are any alternative moves
            // if not, kill the king and show gameover

            for (let y = 0; y < movement_pattern.length; y++) {
                for (let x = 0; x < movement_pattern[y].length; x++) {
                    if (movement_pattern[y][x] === 1) {
                        if (valid_moves[y][x] >= 1) {
                            // if an enemy piece can move to this position
                        }

                        else {
                            possible_moves += 1;
                        }
                    }
                }
            }
            if (possible_moves === 0) {
                this.show_gameover_dialog(king.color)
            }
            console.log(possible_moves)

        }


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
        // overlay the the current
        if (opponent_color === "white") {
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
            //TODO: get_movement_pattern for rook still not working correctly
            console.log(all_moves)

            for (let i = 0; i < all_moves.length; i++) {
                console.log(all_moves[i])
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
    show_gameover_dialog = function (winner) {
        let gameOverContainer = document.querySelector(".gameOver")
        let winnerContainer = document.querySelector(".winner")
        let gameContainer = document.querySelector(".gameScreen")
        gameContainer.style.display = "none"
        gameOverContainer.style.display = "block"
        winnerContainer.innerHTML = `
        <img class='sprite' src='gameObjects/sprites/${winner}/queen.png'/>
        <div><b>${winner}</b> wins the game</div>
        `
        localStorage.clear();
        let newGame = document.getElementById("new").addEventListener("click", startNew)
        console.log(`${winner} wins the game`)
    }

}

export { ChessBoard }