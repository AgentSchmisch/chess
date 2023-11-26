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
            case "playerDamage":
                audioPlayer.pause();
                track = "./audio/gameOver.mp3";
                break;
            case "sleep":
                audioPlayer.pause();
                track = "./audio/sleeping.mp3";
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
    },

    toggleHotelInteractionButtons: function (val) {
        const hotelContainer = document.querySelector("#hotelContainer");
        if (val === true) {
            hotelContainer.style.display = "flex";
        }

        else {
            hotelContainer.style.display = "none";
        }
    },

    toggleFightContainer: function (val) {
        const fightContainer = document.querySelector("#fightContainer");
        if (val === true) {
            fightContainer.style.display = "flex";
        }

        else {
            fightContainer.style.display = "none";
        }
    },

    toggleInventory: function(val){
        const inventory = document.querySelector("#inventory");
        if(val === true){
            inventory.style.display = "flex";
        }
        else{
            inventory.style.display = "none";
        }
    }

}