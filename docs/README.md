![**Version**: 29-12-2023](https://img.shields.io/badge/version-29--12--2023-blueviolet?style=flat&logo=circle)

# Chess Game

This is the documentation of the functionality of this chess game

## 🧭 Contents

* [🧭 Contents](#-contents)
* [🎉 Introduction](#-introduction)
* [🍱 Classes](#-classes)
* [🏃‍♂️ Movement Mechanics](#-movement-mechanics)

## 🎉 Introduction

This is a basic chess game created with JavaScript and basic DOM functions

## 🍱 Classes

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


## Move Validation

To validate a move, the previously generated resultArray is used to check if the piece is moved onto a position thath contains the number `1`
