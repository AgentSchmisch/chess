class ChessPiece {
    color = ""

    //add active flag to know if the piece is being clicked
    active = false
    killed = false

    //current position of the chesspiece
    position = {
        "x" : 0,
        "y" : 0
    }


    // add functtion checks for blocked piece




    constructor(color, y, x) {
        this.color = color;
        this.position.x = x
        this.position.y = y
    }
}

class Pawn extends ChessPiece {
    imgUrl = ""
    first_move = true
    movement_pattern = {"white":[
        [true, [
        [0, 1, 0],
        [3, 1, 3],
        [0, 2, 0]
    ]],
        [
        false,[
        [0, 0, 0],
        [3, 1, 3],
        [0, 2, 0]
        ]
    ]],
        "black":
        [[true, [
            [0, 2, 0],
            [3, 1, 3],
            [3, 1, 3]
        ]],
            [
            false,[
            [0, 2, 0],
            [3, 1, 3],
            [0, 0, 0]
            ]
        ]]

}
                                        
    constructor(color, y, x) {
        super(color, y, x)
        this.imgUrl = `./gameObjects/sprites/${color}/pawn.png`
    }
}

class Rook extends ChessPiece {
    imgUrl = ""
    movement_pattern =[[[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
                        [1,1,1,1,1,1,1,2,1,1,1,1,1,1,1],
                        [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],]]
                                        
    constructor(color, y, x) {
        super(color, y, x)
        this.imgUrl = `./gameObjects/sprites/${color}/rook.png`
    }
}

class Knight extends ChessPiece {
    imgUrl = ""
    movement_pattern = [
       [[0,1, 0, 1,0],
        [1,0, 0, 0,1],
        [0,0, 2, 0,0],
        [1,0, 0, 0,1],
        [0,1, 0, 1,0]]
    ]
                                  
    constructor(color, y, x) {
        super(color, y, x)
        this.imgUrl = `./gameObjects/sprites/${color}/knight.png`
    }}

class Bishop extends ChessPiece {
    imgUrl = ""
    movement_pattern = [[[1,0,0,0,0,0,0,0,0,0,0,0,1],
                         [0,1,0,0,0,0,0,0,0,0,0,1,0],
                         [0,0,1,0,0,0,0,0,0,0,1,0,0],
                         [0,0,0,1,0,0,0,0,0,1,0,0,0],
                         [0,0,0,0,1,0,0,0,1,0,0,0,0],
                         [0,0,0,0,0,1,0,1,0,0,0,0,0],
                         [0,0,0,0,0,0,2,0,0,0,0,0,0],
                         [0,0,0,0,0,1,0,1,0,0,0,0,0],
                         [0,0,0,0,1,0,0,0,1,0,0,0,0],
                         [0,0,0,1,0,0,0,0,0,1,0,0,0],
                         [0,0,1,0,0,0,0,0,0,0,1,0,0],
                         [0,1,0,0,0,0,0,0,0,0,0,1,0],
                         [1,0,0,0,0,0,0,0,0,0,0,0,1]]]
                                        
    constructor(color, y, x) {
        super(color, y, x)
        this.imgUrl = `./gameObjects/sprites/${color}/bishop.png`
    }}

class Queen extends ChessPiece {
    imgUrl = ""
    movement_pattern =[
    [
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [0,1,0,0,0,0,0,1,0,0,0,0,0,1,0],
    [0,0,1,0,0,0,0,1,0,0,0,0,1,0,0],
    [0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
    [0,0,0,0,1,0,0,1,0,0,1,0,0,0,0],
    [0,0,0,0,0,1,0,1,0,1,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,2,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,1,0,1,0,1,0,0,0,0,0],
    [0,0,0,0,1,0,0,1,0,0,1,0,0,0,0],
    [0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
    [0,0,1,0,0,0,0,1,0,0,0,0,1,0,0],
    [0,1,0,0,0,0,0,1,0,0,0,0,0,1,0],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
]]
                                        
    constructor(color, y, x) {
        super(color, y, x)
        this.imgUrl = `./gameObjects/sprites/${color}/queen.png`

    }}

class King extends ChessPiece {
    imgUrl = ""
    movement_pattern = [
        [
         [1, 1, 1],
         [1, 2, 1],
         [1, 1, 1]
]
     ]
                                        
    constructor(color, y, x) {
        super(color, y, x)
        this.imgUrl = `./gameObjects/sprites/${color}/king.png`
    }}

export {ChessPiece, Rook, Knight, Bishop, King, Queen, Pawn}