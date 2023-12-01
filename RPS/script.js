document.querySelector("#rock").addEventListener("click", rock)
document.querySelector("#paper").addEventListener("click", paper)
document.querySelector("#scissors").addEventListener("click", scissors)

function play(theme) {
    let audioPlayer = new Audio();

    switch (theme) {
        case "loose":
            audioPlayer.pause();
            track = "./audio/loose.mp3";
            break;
        case "rock":
            audioPlayer.pause();
            track = "./audio/rock.mp3";
            break;
        case "paper":
            audioPlayer.pause();
            track = "./audio/paper.mp3";
            break;
        case "scissors":
            audioPlayer.pause();
            track = "./audio/scissors.mp3";
            break;
        case "win":
            audioPlayer.pause();
            track = "./audio/win.mp3"
    }
}



const player = {
    wins: 0,
    attempts: 0,
    action: "",

}

const computer = Object.assign({}, player)

player.update = function () {
    document.querySelector("#scorePlayer").innerHTML = `Player: ${this.wins} ${this.wins < 2 ? "Win" : "Wins"}`;
}

computer.update = function () {
    document.querySelector("#scoreComputer").innerHTML = `Computer: ${this.wins} ${this.wins < 2 ? "Win" : "Wins"}`;
}

player.win = function () {
    this.wins++;
    this.update();
    play("win")
    this.blink();

    eval = document.querySelector("#evaluation")
    eval.innerHTML = "Player wins"
    eval.style.backgroundColor = "lightgreen"
    //TODO: add audio to player if he wins
}
player.loose = function () {
    computer.wins++;
    computer.update()

    play("loose")
    eval = document.querySelector("#evaluation")
    eval.innerHTML = "Computer wins"
    eval.style.backgroundColor = "salmon"

    //TODO: add audio if the player looses
}

player.tie = function(){
    eval = document.querySelector("#evaluation")
    eval.innerHTML = "It's a tie"
    eval.style.backgroundColor = "white"
}

player.blink = function(){
    document.querySelector("#scorePlayer").classList.add("flashName");
    setTimeout(()=>{
        document.querySelector("#scorePlayer").classList.remove("flashName");
    }, 3100);
}

function rock() {
    player.action = "rock";
    play("rock");
    computer.action = playEnemy();
    player.attempts++;
    setTimeout(()=>{
        evaluateWinner(player.action, computer.action)
        console.log("Computer: " + computer.action + "/ Player: " + player.action)
    }, 2000);
    return ""
}

function paper() {
    player.action = "paper";
    play("paper")
    computer.action = playEnemy();
    player.attempts++;
    setTimeout(()=>{
        evaluateWinner(player.action, computer.action)
        console.log("Computer: " + computer.action + "/ Player: " + player.action)
    }, 2000);
    return ""
}

function scissors() {
    player.action = "scissors";
    play("scissors")
    computer.action = playEnemy();
    player.attempts++;
    setTimeout(()=>{
        evaluateWinner(player.action, computer.action)
        console.log("Computer: " + computer.action + "/ Player: " + player.action)
    }, 2000);

    return ""
}

function playEnemy() {
    let value = Math.floor(Math.random() * (3 - 0) + 0)

    let actions = [["rock", "fa-solid fa-hand-back-fist fa-5x"], ["paper", "fa-solid fa-hand fa-5x"], ["scissors", "fa-solid fa-hand-scissors fa-5x"]]
    let i = 1;
    let count = 0;
    //Animation of the computer
    let intervalID = setInterval(() => {
        console.log(i)
        document.querySelector("#computer").className = actions[i-1][1];
        if (i===actions.length && count != 2){
            count++;
            i=1;
        }
        else if(count===2){
            clearInterval(intervalID)
            document.querySelector("#computer").className = actions[value][1];  

        }
        i++;
        
    }, 300);

    return actions[value][0]

}

function evaluateWinner(_player, _computer) {
    //Paper -> Rock
    //Rock -> Scissors
    //Rock -> Scissors

    //evaluate the action of the player and based on that decide if the computer has won or the player has won
    if (_player === "rock") {
        if (_computer === "rock") {
            player.tie();
        }

        else if (_computer === "paper") {
            player.loose();
        }

        else if (_computer === "scissors") {
            player.win();
        }
    }

    else if (_player === "paper") {
        if (_computer === "rock") {
            player.win();
        }

        else if (_computer === "paper") {
            player.tie();
        }

        else if (_computer === "scissors") {
            player.loose();
        }
    }

    else if (_player === "scissors") {
        if (_computer === "rock") {
            player.loose();
        }

        else if (_computer === "paper") {
            player.win();
        }

        else if (_computer === "scissors") {
            player.tie();
        }
    }
}