document.querySelector("#rock").addEventListener("click", rock)
document.querySelector("#paper").addEventListener("click", paper)
document.querySelector("#scissors").addEventListener("click", scissors)

const player = {
    wins : 0,
    attempts : 0,
    action:"",


}

const computer = Object.assign({}, player)

player.update = function(){
    document.querySelector("#scorePlayer").innerHTML = `Player: ${this.wins} ${this.wins < 2 ? "Win" : "Wins" }`;
}

computer.update = function(){
    document.querySelector("#scoreComputer").innerHTML = `Computer: ${this.wins} ${this.wins < 2 ? "Win" : "Wins" }`;
}

player.win = function(){
    this.wins++;
    //TODO: add audio to player if he wins
}
player.loose = function(){

    //TODO: add audio if the player looses
}


function rock(){
    player.action = "rock";
    computer.action = playEnemy();
    player.attempts++;
    evaluateWinner(player.action, computer.action)
    console.log("Computer: " + computer.action + "/ Player: " + player.action)
    return ""
}

function paper(){
    player.action = "paper";
    computer.action = playEnemy();
    player.attempts++;
    evaluateWinner(player.action, computer.action)
    console.log("Computer: " + computer.action + "/ Player: " + player.action)
    return ""
}

function scissors(){
    player.action = "scissors";
    computer.action = playEnemy();
    player.attempts++;
    evaluateWinner(player.action, computer.action)
    console.log("Computer: " + computer.action + "/ Player: " + player.action)
    return ""
}

function playEnemy(){
    let value = Math.floor(Math.random() * (3 - 0) + 0)

    let actions = [["rock","fa-solid fa-hand-back-fist fa-5x"], ["paper","fa-solid fa-hand fa-5x"], ["scissors","fa-solid fa-hand-scissors fa-5x"]]
    document.querySelector("#computer").className = actions[value][1];
    return actions[value][0]
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
            computer.wins++;
            computer.update();
        }

        else if(_computer === "scissors"){
            player.wins++;
            player.update();
        }
    }

    else if(_player === "paper"){
        if(_computer === "rock"){
            player.wins++;
            player.update();
        }

        else if(_computer === "paper"){
            console.log("its a tie")
        }

        else if(_computer === "scissors"){
            console.log("computer wins")
            computer.wins++;
            computer.update();
        }
    }

    else if(_player === "scissors"){
        if(_computer === "rock"){
            console.log("computer wins")
            computer.wins++;
            computer.update();
        }

        else if(_computer === "paper"){
            player.wins++;
            player.update();
        }

        else if(_computer === "scissors"){
            console.log("its a tie");
        }
    }

}