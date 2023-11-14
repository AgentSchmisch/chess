const startbtn = document.querySelector("#start");
startbtn.addEventListener("click", startgame);

const tavernbtn = document.querySelector("#tavern");
tavernbtn.addEventListener("click", tavern);

const cavebtn = document.querySelector("#cave");
cavebtn.addEventListener("click", cave);

const intro = document.querySelector("#dialog");

const body = document.querySelector("body");

const inventory = document.querySelector("#inventory");


const player = {
    name:"",
    items:[]
}


function play(theme) {
    switch (theme){
        case "ambient":
            var audio = new Audio("./audio/ambient.mp3");
            audio.play();
        case "tavern":
            var audio = new Audio("./audio/tavern.mp3");
            audio.play();
    }
}

function remove_startcontainer(){
    const startcontainer = document.querySelector(".startcontainer");
    startcontainer.style.display="none";
}

function cave(){
    remove_startcontainer();
    body.style.backgroundImage = "url('./imgs/CaveEntry.avif')";
    if (player.items.includes("sword")) {
        intro.innerHTML="You enter the cave. It is dark and damp. You encounter the guard of the treasure. You have a sword!";
    }
    else {
        intro.innerHTML="You enter the cave. It is dark and damp. You encounter the guard of the treasure. You dont have a weapon. GAME OVER"
    }
    
}

function tavern(){
    remove_startcontainer();
    const options = document.querySelector("#options").style.display = "none";
    intro.innerHTML="You enter the tavern. It is a small, cozy place with a fire crackling. You see a bartender and a few patrons. You get a few drinks and get talking with the patrons. They tell you about a cave nearby that is rumored to be filled with treasure. You decide to go check it out. You leave the tavern and head towards the cave. You see a sign that says 'Beware of the Cave'. Do you enter the cave or go back to the tavern?";
    body.style.backgroundImage = "url('./imgs/TavernPatrons.jpg')";
    //TODO: add fight scene
}


function startgame(){
    let playerName = document.querySelector("#playerName").value;

    if(playerName !== "" && typeof playerName === "string"){
        intro.innerHTML=`Welcome ${playerName}! You are a young adventurer who has just arrived in the town of Hogsmeade. You are looking for a place to stay for the night. You see a tavern, a hotel, and a stable. Which do you choose?`;
        const options = document.querySelector("#options").style.display = "flex"; 
        play("ambient");
        remove_startcontainer();
        inventory.style.display="flex";
        player.name = playerName;
    }

    else {
        intro.innerHTML="Please enter a name!";
        return;
    }
}


