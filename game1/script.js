//TODO: add possibility to gain a sword to fight the guard of the cave
//TODO: elongate storyline
//TODO: Test all possible paths according to twinery
//TODO: create screen for winning the game

//Add Event listeners for all buttons

const startbtn = document.querySelector("#start").addEventListener("click", startGame);

const tavernbtn = document.querySelector("#tavern").addEventListener("click", tavern);

const cavebtn = document.querySelector("#cave").addEventListener("click", cave);

const hotelbtn = document.querySelector("#hotel").addEventListener("click", hotel);

const stablebtn = document.querySelector("#shed").addEventListener("click", shed);

document.querySelector("#talk").addEventListener("click", talkToPerson);

document.querySelector("#lookAround").addEventListener("click", townOverview);

document.querySelector("#toCave").addEventListener("click", TavernToCave);
document.querySelector("#stay").addEventListener("click", () => gameOver("tavern"));

document.querySelector("#hotelToCave").addEventListener("click", hotelToCave);
document.querySelector("#hotelStay").addEventListener("click", () => gameOver("hotel"));


const intro = document.querySelector("#dialog");

const inventory = document.querySelector("#inventory");

const dialogbox = document.querySelector(".dialogbox");


let audioPlayer = new Audio();



const sword = {
    name:"a mighty Sword",
    damage : 20,
}

const dagger = {
    name:"a small Dagger",
    damage : 10,
}

const monster ={
    health:100,
    attackDamage:Math.floor(Math.random() * (15 - 3) + 3),
    sound : "./audio/monster.mp3",
    attack : function(){
        player.getDamage(this.attackDamage);
        player.update();
    },
    getDamage : function(val){
        this.health -= val;
        if (this.health <= 0){
            this.health = 0;
            win();
        }
    },
    update: function(){
        const monsterHealth = document.querySelector("#monsterHealth");
        monsterHealth.innerHTML = `Health: ${this.health}`;
    },

    toggleHealthvisibility: function(val){
        const monsterContainer = document.querySelector("#monster");

        if(val===true){
        monsterContainer.style.display = "flex";
        }

        else{
            monsterContainer.style.display = "none";
        }

    }
}

const player = {
    name: "",
    items: ["None"],
    health: 100,
    deaths: 0,
    win: false,
    update: function () {
        const username = document.querySelector("#username");
        const weapon = document.querySelector("#weapon");
        const health = document.querySelector("#health");
        username.innerHTML = `Name: ${this.name}`;

        if (this.items[0] === "None") {
        weapon.innerHTML = "Weapon: None";
        }
        else {
            weapon.innerHTML = `Weapon: ${this.items[0]["name"]}`;
        }
        health.innerHTML = `Health: ${this.health}`;
    },



    attack: function (damage) {
        
        monster.getDamage(damage);
        monster.update();
    },

    getDamage: function (val) {
        this.health -= val;
        if (this.health <= 0) {
            player.health = 0;
            gameOver("defeat");
        }
    },

   playerStats: {
        talkedToPerson:false,
        wentToTown:false,

        wentToTavern:false,
        wentToHotel:false,
        wentToShed:false,
        wentToCaveWithSword:false,

        wentToCaveWithoutWeapon:false,

        display: function(){
            
        },
    }
}

document.querySelector("#fight").addEventListener("click", ()=>player.attack(player.items[0]["damage"]));


function gameOver(cause) {

    if (cause==="cave"){
    setTimeout(() => {
        player.deaths++;
        environment.background('./imgs/gameover.jpg');
        intro.innerHTML = "You encounter the guard of the treasure. You dont have a weapon. GAME OVER"
        environment.play("gameOver");
        player.health = 0;
        player.update();
        setTimeout(startGame, 6000);
    }, 5000);
    }

    else if (cause==="tavern") {
        environment.background('./imgs/TavernPatrons.jpg');
        setTimeout(() => {
            intro.innerHTML = "You decide to stay in the tavern, you take a few drinks with the Patrons. You get drunk and fall asleep"
            player.deaths++;
            player.items[0] = "Beer";
            player.health = 0;
            player.update();
            environment.background('./imgs/TavernPatrons.jpg');
            environment.play("gameOver");

            setTimeout(()=>{startGame()
                environment.toggleTavernButtons(false)
            }, 6000);
        }, 5000);
    }
    else if (cause==="hotel") {
        environment.background('./imgs/hotel.jpg');
        setTimeout(()=>{
            intro.innerHTML = "You decide to stay in the hotel, the monster of the cave continues its mischief. You leave the town. GAME OVER"
            player.deaths++;
            player.health = 0;
            player.update();
            environment.background('./imgs/hotel.jpg');
            environment.play("gameOver");

            setTimeout(()=>{startGame()
                environment.toggleTavernButtons(false)
            }, 6000);
        })
    }
    else if (cause==="defeat"){
        player.deaths++;
        player.health = 0;
        player.update();
        intro.innerHTML ="You died. GAME OVER"
        environment.background('./imgs/hotel.jpg');
        environment.play("gameOver");
        environment.toggleFightContainer(false)
        monster.toggleHealthvisibility(false);
        environment.toggleInventory(false);
        monster.health = 0;
        player.health = 0;

        setTimeout(()=>{startGame()
            environment.toggleHotelInteractionButtons(false);
            monster.health = 100;
            player.health = 100;
            player.update();
        }, 6000);
    }
}

function win(){
    player.win=true
    environment.toggleFightContainer(false);
    environment.toggleInventory(false);
    monster.toggleHealthvisibility(false);
    environment.background("./imgs/TavernPatrons.jpg");
    intro.innerHTML = "You fight the guard and win! You take the treasure and head back to the tavern to celebrate. YOU WIN!"
    player.playerStats.display()
}


function cave() {
    environment.toggleStartContainer(false);
    environment.play("cave");
    environment.background('./imgs/CaveEntry.avif')
    if (player.items.includes(sword)) {
        intro.innerHTML = "You enter the cave. It is dark and damp. You encounter the guard of the treasure. You have a sword!";
        setTimeout(() => {
            monster.toggleHealthvisibility(true);
            environment.play("tavern")
            environment.toggleFightContainer(true);
            intro.innerHTML = "You fight the guard and win! You take the treasure and head back to the tavern to celebrate. YOU WIN!"
            environment.background('./imgs/TavernPatrons.jpg');
        }, 10000);
    }

    else if (player.items.includes(dagger)){
        intro.innerHTML = "You enter the cave. It is dark and damp. You encounter the guard of the treasure. You have a small Dagger!";
        setTimeout(() => {
            monster.toggleHealthvisibility(true);
            environment.toggleFightContainer(true);
            fight();
        }, 10000);
    }

    else {

        player.playerStats.wentToCaveWithoutWeapon = true;

        environment.toggleTownOptionsButtons(false);
        intro.innerHTML = "You enter the cave. It is dark and damp."
        gameOver("cave");
    }
}

function fight(){
    let maxtime = 3000
    let mintime = 750
    let randtime = Math.floor(Math.random() * (maxtime - mintime) + mintime)
    let intervalID = setInterval(()=>{
        if (monster.health > 0){
            console.log(intervalID)
            player.getDamage(monster.attackDamage)
            console.log(player.health)
            player.update();
        }
        else {
            console.log(intervalID)
            clearInterval(intervalID);
        }
        
    }, randtime);
    
}

function tavern() {
    environment.toggleTownOptionsButtons(false);
    environment.toggleStartContainer(false);

    environment.play("tavern");

    player.playerStats.wentToTavern = true;

    intro.innerHTML = "You enter the tavern. It is a small, cozy place with a fire crackling. You see a bartender and a few patrons. You get a few drinks and get talking with the patrons. They tell you about a cave nearby that is rumored to be filled with treasure.";
    environment.background('./imgs/TavernPatrons.jpg');
    setTimeout(() => {
        intro.innerHTML = "You are intrigued by the story and want to check it out. You ask the patrons for directions."
        environment.toggleTavernButtons(true);
    }, 7000);
    
}

function TavernToCave(){
    intro.innerHTML = "You decide to go check it out. You leave the tavern and head towards the cave. Before leaving, the patrons give you a sword. On your way to the cave you see a sign that says <i>'Beware of the Cave'</i>."
    player.items[0] = sword;
    player.update();
    setTimeout(cave, 17000)
}

function hotel() {
    player.playerStats.wentToHotel = true;

    environment.background('./imgs/hotel.jpg');
    environment.toggleTownOptionsButtons(false);

    intro.innerHTML = "You enter the hotel, there is a free room, you go to sleep. During the night you get repeatedly waken by scary noises."
    setTimeout(() => {
        intro.innerHTML = "The next morning you ask the porter about the noises. He tells you that there is a spooky cave near the town. No one has ever returned from there."
        setTimeout(() => {
            intro.innerHTML = "You are intrigued by the story and want to check it out. You ask the porter for directions. Do you want to stay in the hotel or go to the cave?"
            environment.toggleHotelInteractionButtons(true);
        }, 10000);
    }, 10000);

}

function hotelToCave(){
    environment.toggleHotelInteractionButtons(false);
    intro.innerHTML ="You decide to go check it out. You leave the hotel and head towards the cave. Before leaving the hotel, the porter gives you a small Dagger. On your way to the cave you see a sign that says <i>'Beware of the Cave'</i>."
    player.items[0] = dagger;
    player.update();
    setTimeout(cave, 10000)
}

function shed() {
    player.playerStats.wentToShed = true;

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

        console.log (playerName)

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

    player.playerStats.talkedToPerson = true;

    environment.toggleStartContainer(false);
    environment.background("./imgs/npcInteraction.jpg")
    intro.innerHTML = "You talk to the person and he tells you about a tavern, a hotel and a shed where do you want to go?";
    setTimeout((state) => environment.toggleTownOptionsButtons(state), 5000, true);

    environment.toggleTownInteractionButtons(false);
    inventory.style.display = "flex";
    dialogbox.style.justifyContent = "space-between";
}

function townOverview() {

    player.playerStats.wentToTown = true;

    environment.toggleStartContainer(false);
    intro.innerHTML = "You look around the town and see a tavern, a hotel, a shed and a cave. Where do you want to go?";
    environment.toggleTownOptionsButtons(true);
    environment. toggleTownInteractionButtons(false);

    environment.background('./imgs/background.jpg');
    inventory.style.display = "flex";
    dialogbox.style.justifyContent = "space-between";
}


