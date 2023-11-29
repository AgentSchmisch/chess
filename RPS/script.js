document.querySelector("#rock").addEventListener("click", rock)
document.querySelector("#paper").addEventListener("click", paper)
document.querySelector("#scissors").addEventListener("click", scissors)


function rock(){

    console.log("rock")
    return ""
}

function paper(){

    console.log("paper")
    return ""
}

function scissors(){

    console.log("scissors")
    return ""
}

function playEnemy(){
    let value = Math.floor(Math.random() * (3 - 0) + 0)

    let actions = ["rock", "paper", "scissors"]


    console.log(value)
    console.log(actions[value])

    return actions[value]
}

function evaluateWinner(player, computer){
    //Paper -> Rock
    //Rock -> Scissors
    //Rock -> Scissors

    //evaluate the action of the player and based on that decide if the computer has won or the player has won


    let actions = ["rock", "paper", "scissors"]

    let winner

    return winner
}