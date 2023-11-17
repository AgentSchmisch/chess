//TODO: add possibility to gain a sword to fight the guard of the cave

const startbtn = document.querySelector("#start");
startbtn.addEventListener("click", startGame);

const tavernbtn = document.querySelector("#tavern");
tavernbtn.addEventListener("click", tavern);

const cavebtn = document.querySelector("#cave");
cavebtn.addEventListener("click", cave);

const hotelbtn = document.querySelector("#hotel");
hotelbtn.addEventListener("click", hotel);

const stablebtn = document.querySelector("#shed");
stablebtn.addEventListener("click", shed);

const intro = document.querySelector("#dialog");

const inventory = document.querySelector("#inventory");

const dialogbox = document.querySelector(".dialogbox");

const username = document.querySelector("#username");
const weapon = document.querySelector("#weapon");

let audioPlayer = new Audio();

const player = {
    name:"",
    items:[],
    health:100
}


function play(theme) {
    let track = ""
    console.log(theme)
    switch (theme){
        case "ambient":
            console.log("playing ambient")
            audioPlayer.pause();
            track = "./audio/ambient.mp3";
            break;
            
        case "tavern":
            console.log("playing tavern")
            audioPlayer.pause();
            track = "./audio/tavern.mp3";
            break;
    }
    audioPlayer.src = track;
    audioPlayer.play();

}

function changeBackground(imgpath){
    const body = document.querySelector("body");

    body.style.backgroundImage = `url(${imgpath})`;
}

function remove_startcontainer(){
    const startcontainer = document.querySelector(".startcontainer");
    startcontainer.style.display="none";
}

function cave() {
    remove_startcontainer();
    changeBackground('./imgs/CaveEntry.avif')
    if (player.items.includes("sword")) {
        intro.innerHTML="You enter the cave. It is dark and damp. You encounter the guard of the treasure. You have a sword!";
        setTimeout(() => {
            //Fight scene
            intro.innerHTML="You fight the guard and win! You take the treasure and head back to the tavern to celebrate. YOU WIN!"
            changeBackground('./imgs/TavernPatrons.jpg');
        }, 7000);
    }
    else {
        intro.innerHTML="You enter the cave. It is dark and damp. You encounter the guard of the treasure. You dont have a weapon. GAME OVER"
    }

}

function tavern(){
    remove_startcontainer();
    play("tavern");
    document.querySelector("#options").style.display = "none";
    intro.innerHTML = "You enter the tavern. It is a small, cozy place with a fire crackling. You see a bartender and a few patrons. You get a few drinks and get talking with the patrons. They tell you about a cave nearby that is rumored to be filled with treasure. You decide to go check it out. You leave the tavern and head towards the cave. You see a sign that says 'Beware of the Cave'. Do you enter the cave or go back to the tavern?";
    changeBackground('./imgs/TavernPatrons.jpg');
    

    //TODO: add function cave else tavern
}

function hotel(){

}

function shed(){
    intro.innerHTML = "While taking your way to the shed, you encounter a sign that says 'Beware of the Cave'. Your curiousity gets sparked by the sign and you turn to the tavern to gather more information."
    tavern();
}


function startGame(){
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
        intro.innerHTML = "Please enter a name!";
        return;
    }
}


