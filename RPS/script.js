document.querySelector("#rock").addEventListener("click", rock)
document.querySelector("#paper").addEventListener("click", paper)
document.querySelector("#scissors").addEventListener("click", scissors)

const player = {
    wins : 0,
    attempts : 0,
    action:"",
}


const computer = Object({}, player)


function rock(){
    player.action = "rock";
    computer.action = playEnemy();
    player.attempts++;
    evaluateWinner(player.action,computer.action)
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

function evaluateWinner(_player, _computer){
    //Paper -> Rock
    //Rock -> Scissors
    //Rock -> Scissors

    //evaluate the action of the player and based on that decide if the computer has won or the player has won
    if (_player === "rock"){
        if(_computer === "rock"){
            console.log("it's a tie")
        }

        else if(_computer === "paper"){
            console.log("computer wins")
        }

        else if(_computer === "scissors"){
            player.wins++;
        }
    }
    else if(_player === "paper"){
        if(_computer === "rock"){
            player.wins++;
        }

        else if(_computer === "paper"){
            console.log("its a tie")
        }

        else if(_computer === "scissors"){
            console.log("computer wins")
        }
    }
    else if(_player === "scissors"){
        if(_computer === "rock"){
            console.log("computer wins")
        }

        else if(_computer === "paper"){
            player.wins++;
        }

        else if(_computer === "scissors"){
            console.log("its a tie")
        }
    }

    let actions = ["rock", "paper", "scissors"]

    let winner = null

    return winner
}