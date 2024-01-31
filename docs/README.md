![**Version**: 08-01-2024](https://img.shields.io/badge/version-08--01--2024-blueviolet?style=flat&logo=circle)     [![wakatime](https://wakatime.com/badge/user/a696287c-b2b2-469c-bea4-567b568dd0ca/project/018cc73c-d705-4ee4-b900-2e1565d7a220.svg)](https://wakatime.com/badge/user/a696287c-b2b2-469c-bea4-567b568dd0ca/project/018cc73c-d705-4ee4-b900-2e1565d7a220)
# Chess Game

This is the documentation of the functionality of this chess game

## 🧭 Contents

* [🧭 Contents](#-contents)
* [🎉 Introduction](#-introduction)
* [✅ Featureset](#-featureset)
* [🍱 Classes](#-classes)
* [🏃‍♂️ Movement Mechanics](#-movement-mechanics)

## 🎉 Introduction

This is a basic chess game created with JavaScript and DOM functions

## ✅ Featureset

- Single game multiplayer
- in browser game state storage
- Player gets shown possible moves for the selected piece

## 🍱 Classes

The Game consists of a single Class for the ChessBoard, and dedicated Classes for the Chess Pieces:

- ChessBoard
- ChessPiece
  - Pawn
  - Rook
  - Bishop
  - Queen
  - King
  - Knight

all the Specific ChessPiece (Pawn, Rook,...) classes inherit their main functions from ChessPiece

### ChessPiece

Every chess piece inherits the basic functionality from the super Class ChessPiece

there are piece-specific functions that are applied to the piece on instantiation

there are also piece specific functions where there is only a set of methods that get inherited according to an array in the Piece-specific class

more on that in the section [Piece Blocking](#piece-blocking)

## 🏃‍♂️ Movement Mechanics

### Movement Patterns

Every ChessPiece has a property `movement_pattern` which represents all the possible moves on the board

for example we have the movement_pattern of a `Knight`:

```javascript

    movement_pattern = [
       [[0, 1, 0, 1, 0],
        [1, 0, 0, 0, 1],
        [0, 0, 2, 0, 0],
        [1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0]]
    ]

```

The movement pattern consists of a multidimensional array in which the player's current position is represented by the number `2` (which is referred to as player_represenation) and the allowed moves are represented by the number `2`

A special case is the `Pawn`, for which we also have a "kill pattern" built into the movement pattern, that is represented by the number `3`

Therefore the `Knights` example movement pattern is also consisting of a series of nested arrays -> The `Pawn` brings many little nooks and crannies into consideration which dont apply to other ChessPieces

### Move Projection

To validate a move and to show the player possible moves, the movement_pattern is needed to be projected into the current board

---

- first the player_representation is searched in the movement_pattern and it's coordinates are saved in an array called ``pos_player_representation_shift``,
  for the example of the ``Knight`` this would look like

```javascript

console.log(pos_player_representation_shift);

>> [2,2]

```

these are the values that are used to shift the position of the movement_pattern onto the actual player's position on the board

if any of the movement_pattern's values is overlapping the border of the chessBoard, they are cut off

✅ the output value is referred to as resultArray

---

- afterwards the actual game layout is projected onto the resultArray with that output it is possible to check if there are any other pieces blocking the movement paths of the currently selected piece

  if so, the following `1` are removed from the resultArray

  after finsihing this step the final output can be used for either move Validation or to show the player possible moves

an example of a resultArray might look like:

here would be a rook in `[7, 7]` targeting the pawn in `[1, 7]`

```javascript
console.log(resultArray);

>> [[0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,2]]
```

## Piece Blocking

Each chesspiece inherits a rough movement pattern from the ChessPiece
Lets look at the ``Rook`` here:

- The rook has an array that contains all the possible movement directions as a string

```javascript
movement_directions = ["straight_backward", "straight_forward","straight_right", "straight_left"]
```

on instantiation of the Object the Figure inherits the corresponding methods from the super-class

for example the ``straight_forward`` function

<details>
<summary>straight_forward function</summary>

```javascript
straight_forward (player_position, allowed_positions, current_player) {

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
```
</details>

on call of the function, the game checks along the straight axis of the Piece, whether it is blocked by another piece and removes the ``1`` after the blocking piece so that the game can display the possible moves correctly on the board


## Move Validation

To validate a move, the previously generated resultArray is used to check if the piece is moved onto a position thath contains the number `1`

