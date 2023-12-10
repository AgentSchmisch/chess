document.querySelector("#rock").addEventListener("click", rock)
document.querySelector("#paper").addEventListener("click", paper)
document.querySelector("#scissors").addEventListener("click", scissors)

function play(theme) {
    // create the audioPlayer used to 
    let audioPlayer = new Audio();
    
    switch (theme) {
        case "rock":
            console.log("test"+theme)
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
            break;
        case "loose":
            audioPlayer.pause();
            track = "./audio/loose.mp3"
            break;
    }

    audioPlayer.src = track;
    audioPlayer.play();
}

// Create a player object that contains information
const player = {
    wins: 0,
    attempts: 0,
    action: "",
}
// derive a computer object from the player to differ the player from the computer generated values
const computer = Object.assign({}, player)

player.update = function () {
    // using a ternary operator to determine whether the plural form of win should be used
    document.querySelector("#scorePlayer").innerHTML = `Player: ${this.wins} ${this.wins < 2 ? "Win" : "Wins"}`;
}

computer.update = function () {
    // using a ternary operator to determine whether the plural form of win should be used
    document.querySelector("#scoreComputer").innerHTML = `Computer: ${this.wins} ${this.wins < 2 ? "Win" : "Wins"}`;
}
// adding a win method to the player object
player.win = function () {
    this.wins++;
    this.update();
    play("win")
    this.blink();

    eval = document.querySelector("#evaluation")
    eval.innerHTML = "Player wins"
    eval.style.backgroundColor = "lightgreen"
}

player.loose = function () {
    computer.wins++;
    computer.update()

    play("loose")
    eval = document.querySelector("#evaluation")
    eval.innerHTML = "Computer wins"
    eval.style.backgroundColor = "salmon"
}

// adding a tie function to the player object
player.tie = function(){
    eval = document.querySelector("#evaluation")
    eval.innerHTML = "It's a tie"
    eval.style.backgroundColor = "white"
}
// adding a blink function to the player object
player.blink = function(){
    document.querySelector("#scorePlayer").classList.add("flashName");
    setTimeout(()=>{
        document.querySelector("#scorePlayer").classList.remove("flashName");
    }, 3100);
}
// creating the rock function
function rock() {
    player.action = "rock";
    play("rock");
    computer.action = playEnemy();

    //for statistic purposes we track the players attempts in the game
    player.attempts++;
    setTimeout(()=>{
        //compare the results of the player and the computer and present the result
        evaluateWinner(player.action, computer.action)
        console.log("Computer: " + computer.action + "/ Player: " + player.action)
    }, 2000);
    return ""
}

//compareable to the rock function, just different things happening to the DOM
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

//compareable to the rock function, just different things happening to the DOM
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
    //pick a random number between 0 and 3
    let value = Math.floor(Math.random() * (3 - 0) + 0)

    //"map" the random value to an action of the computer
    //using a multi dim array to apply the styles of the Fontawesome icons to the DOM Object and the action to evaluate the winner
    let actions = [["rock", "fa-solid fa-hand-back-fist fa-5x"], ["paper", "fa-solid fa-hand fa-5x"], ["scissors", "fa-solid fa-hand-scissors fa-5x"]]
    let i = 1;
    let count = 0;

    //Animation of the computer
    let intervalID = setInterval(() => {
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
    // change the icon on the computer side every 300ms

    return actions[value][0]

}

function evaluateWinner(_player, _computer) {
    //following rules apply
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