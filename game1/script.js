const startbtn = document.querySelector("#start");
startbtn.addEventListener("click", startgame);

const tavernbtn = document.querySelector("#tavern");
tavernbtn.addEventListener("click", tavern);

const cavebtn = document.querySelector("#cave");
cavebtn.addEventListener("click", cave);

const intro = document.querySelector("#dialog");


const inventory = document.querySelector("#inventory");

const dialogbox = document.querySelector(".dialogbox");

const username = document.querySelector("#username");
const weapon = document.querySelector("#weapon");

const player = {
    name:"",
    items:[],
    health:100
}


function play(theme) {
    let audio = new Audio();
    switch (theme){
        case "ambient":
            track = "./audio/ambient.mp3";
            audio.src = track;
            audio.play();
        case "tavern":
            track = "./audio/tavern.mp3";
            audio.src = track;
            audio.play();
    }

}

function changeBackground(imgpath){
    const body = document.querySelector("body");

    body.style.backgroundImage = `url(${imgpath})`;
}

function remove_startcontainer(){
    const startcontainer = document.querySelector(".startcontainer");
    startcontainer.style.display="none";
}

function cave(){
    remove_startcontainer();
    changeBackground('./imgs/CaveEntry.avif')
    if (player.items.includes("sword")) {
        intro.innerHTML="You enter the cave. It is dark and damp. You encounter the guard of the treasure. You have a sword!";
    }
    else {
        intro.innerHTML="You enter the cave. It is dark and damp. You encounter the guard of the treasure. You dont have a weapon. GAME OVER"
    }

}

function tavern(){
    remove_startcontainer();
    document.querySelector("#options").style.display = "none";
    intro.innerHTML="You enter the tavern. It is a small, cozy place with a fire crackling. You see a bartender and a few patrons. You get a few drinks and get talking with the patrons. They tell you about a cave nearby that is rumored to be filled with treasure. You decide to go check it out. You leave the tavern and head towards the cave. You see a sign that says 'Beware of the Cave'. Do you enter the cave or go back to the tavern?";
    changeBackground('./imgs/TavernPatrons.jpg');
    //TODO: add fight scene
}


function startgame(){
    let playerName = document.querySelector("#playerName").value;

    if(playerName !== "" && typeof playerName === "string"){
        intro.innerHTML=`Welcome ${playerName}! You are a young adventurer who has just arrived in the town of Hogsmeade. You are looking for a place to stay for the night. You see a tavern, a hotel, and a stable. Which do you choose?`;
        const options = document.querySelector("#options").style.display = "flex"; 

        play("ambient");
        
        inventory.style.display="flex";
        dialogbox.style.justifyContent="space-between";
        player.name = playerName;
        username.innerHTML = `Name: ${player.name}`;
        remove_startcontainer();
    }

    else {
        intro.innerHTML="Please enter a name!";
        return;
    }
}


