//TODO: add possibility to gain a sword to fight the guard of the cave
//TODO: elongate storyline

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

document.querySelector("#talk").addEventListener("click", talkToPerson);

document.querySelector("#lookAround").addEventListener("click", townOverview);


const intro = document.querySelector("#dialog");

const inventory = document.querySelector("#inventory");

const dialogbox = document.querySelector(".dialogbox");


let audioPlayer = new Audio();

const player = {
    name: "",
    items: [],
    health: 100,

    update: function () {
        const username = document.querySelector("#username");
        const weapon = document.querySelector("#weapon");
        const health = document.querySelector("#health");
        username.innerHTML = `Name: ${player.name}`;
        weapon.innerHTML = `Weapon: ${player.items}`;
        health.innerHTML = `Health: ${player.health}`;
    }
}
const environment = {

    toggleTavernButtons: function (val) {
        const taverncontainer = document.querySelector("#tavernContainer");

        if (val === true) {
            taverncontainer.style.display = "flex";
        }

        else {
            taverncontainer.style.display = "none";
        }

    },

    play: function (theme) {
        let track = ""
        switch (theme) {
            case "ambient":
                audioPlayer.pause();
                track = "./audio/ambient.mp3";
                break;

            case "tavern":
                audioPlayer.pause();
                track = "./audio/tavern.mp3";
                break;
            case "cave":
                audioPlayer.pause();
                track = "./audio/cave.mp3";
                break;
            case "gameOver":
                audioPlayer.pause();
                track = "./audio/gameOver.mp3";
                break;
        }
        audioPlayer.src = track;
        audioPlayer.play();
    },

    background: function (imgpath) {
        const body = document.querySelector("body");

        body.style.backgroundImage = `url(${imgpath})`;
    },

    toggleStartContainer: function (val) {
        if (val === true) {
            const startcontainer = document.querySelector(".startcontainer");
            startcontainer.style.display = "flex";
        }

        else {
            const startcontainer = document.querySelector(".startcontainer");
            startcontainer.style.display = "none";
        }
    },

    toggleTownOptionsButtons: function (val) {
        const townoptions = document.querySelector("#townoptions");

        if (val === true) {
            townoptions.style.display = "flex";

            tavernbtn.addEventListener("click", tavern);
            cavebtn.addEventListener("click", cave);
            hotelbtn.addEventListener("click", hotel);
            stablebtn.addEventListener("click", shed);
        }

        else {
            townoptions.style.display = "none";
        }
    },

    toggleTownInteractionButtons: function (val) {
        const townInteraction = document.querySelector("#townInteraction");
        if (val === true) {
            townInteraction.style.display = "flex";
        }

        else {
            townInteraction.style.display = "none";
        }
    }


}


function gameOver() {
    setTimeout(() => {
        environment.background('./imgs/gameover.jpg');
        environment.toggleTownSquareButtons(false);
        intro.innerHTML = " You encounter the guard of the treasure. You dont have a weapon. GAME OVER"
        environment.play("gameOver");
        player.health = 0;
        player.update();
        setTimeout(startGame, 6000);
    }, 5000);
}


function cave() {
    environment.toggleStartContainer(false);
    environment.play("cave");
    environment.background('./imgs/CaveEntry.avif')
    if (player.items.includes("Sword")) {
        intro.innerHTML = "You enter the cave. It is dark and damp. You encounter the guard of the treasure. You have a sword!";
        setTimeout(() => {
            environment.play("tavern")
            intro.innerHTML = "You fight the guard and win! You take the treasure and head back to the tavern to celebrate. YOU WIN!"
            environment.background('./imgs/TavernPatrons.jpg');
        }, 10000);
    }
    else {
        environment.toggleTownOptionsButtons(false);
        intro.innerHTML = "You enter the cave. It is dark and damp."
        gameOver();
    }
}


function tavern() {
    environment.toggleStartContainer(false);
    environment.play("tavern");

    document.querySelector("#options").style.display = "none";
    intro.innerHTML = "You enter the tavern. It is a small, cozy place with a fire crackling. You see a bartender and a few patrons. You get a few drinks and get talking with the patrons. They tell you about a cave nearby that is rumored to be filled with treasure.";
    environment.background('./imgs/TavernPatrons.jpg');
    setTimeout(() => {
        intro.innerHTML = "You are intrigued by the story and want to check it out. You ask the patrons for directions."
        environment.toggleTavernButtons(true);
    }, 7000);
    setTimeout(() => {
        intro.innerHTML = "You decide to go check it out. You leave the tavern and head towards the cave. Before leaving, the patrons give you a sword. On your way to the cave you see a sign that says <i>'Beware of the Cave'</i>. Do you enter the cave or go back to the tavern?"
        player.items[0] = "Sword";
        player.update();
        setTimeout(cave, 15000)
    }, 15000);
}

function hotel() {
    environment.background('./imgs/hotel.jpg');
    hideMenuButtons();
    intro.innerHTML = "You enter the hotel, there is a free room, you go to sleep. During the night you get repeatedly waken by scary noises."
    setTimeout(() => {
        intro.innerHTML = "The next morning you ask the "
    }, 10000);
}


function shed() {
    intro.innerHTML = "While taking your way to the shed, you encounter a sign that says <i>'Beware of the Cave'</i>. Your curiousity gets sparked by the sign and you turn to the tavern to gather more information."
    setTimeout(tavern, 7000);
}


function startGame() {
    environment.background('./imgs/background.jpg');

    let playerName = document.querySelector("#playerName").value;

    if (playerName !== "" && typeof playerName === "string") {
        environment.toggleStartContainer(false);
        intro.innerHTML = `Welcome <b>${playerName}</b>! You are a young adventurer who has just arrived in the town of Hogsmeade. You are looking for a place to stay for the night. You see a Person in front of a House, do you want to speak to the person or take a look around the town?`;
        environment.toggleTownOptionsButtons(false);
        document.querySelector("#options").style.display = "flex";
        environment.toggleTownInteractionButtons(true);

        environment.play("ambient");

        player.name = playerName;
        player.update();

        environment.toggleStartContainer(false);
    }

    else {
        intro.innerHTML = "Please enter a name!";
        return;
    }
}

function talkToPerson() {
    environment.toggleStartContainer(false);
    environment.background("./imgs/npcInteraction.jpg")
    intro.innerHTML = "You talk to the person and he tells you about a tavern, a hotel and a shed where do you want to go?";
    setTimeout((state) => environment.toggleTownOptionsButtons(state), 5000, true);

    environment.toggleTownInteractionButtons(false);
    inventory.style.display = "flex";
    dialogbox.style.justifyContent = "space-between";
}

function townOverview() {
    environment.toggleStartContainer(false);
    intro.innerHTML = "You look around the town and see a tavern, a hotel, a shed and a cave. Where do you want to go?";
    environment.toggleTownOptionsButtons(true);
    environment. toggleTownInteractionButtons(false);

    environment.background('./imgs/background.jpg');
    inventory.style.display = "flex";
    dialogbox.style.justifyContent = "space-between";
}


