
//Initializing variables to target html elements
var ins = document.getElementById("instructions");
var numWins = document.getElementById("w");
var partsFilled = document.getElementById("filled");
var numGuessesLeft = document.getElementById("gL");
var lettersGuessedDis = document.getElementById("lg");
var albumCollage = document.getElementsByClassName("img-border");
var displayAlbum = document.getElementById("display-image");
var artistIndex= 0;
//Status tells wether or not the game is active 
var playing = true;

//Initializing player guess
var playerGuess = ""

//Array of Words to choose from
var myWords = ["kendrick lamar", "kanye west", "drake"];
var artistArray=[{artistName: "kendrick lamar", alreadyGuessed: false, albumImg: "assets/images/kendricklamar.jpg"},{artistName: "kanye west",alreadyGuessed: false,
albumImg: "assets/images/kanyewest.jpg"},{artistName:"drake", alreadyGuessed: false, albumImg:"assets/images/drake.jpg"}]
//Array of images for rapper album art work
var albumArt = { "kendrick lamar": "assets/images/kendricklamar.jpg", "kanye west": "assets/images/kanyewest.jpg", "drake": "assets/images/drake.jpg" }

//Object that contains all valid inputs. When the user guesses a letter, it is removed from valid inputs until the next word is generated. 
var validGuesses = {
    "a": true, "b": true, "c": true, "d": true, "e": true, "f": true, "g": true, "h": true, "i": true, "j": true, "k": true, "l": true, "m": true, "n": true, "o": true,
    "p": true, "q": true, "r": true, "s": true, "t": true, "u": true, "v": true, "w": true, "x": true, "y": true, "z": true,
    alphabet: "abcdefghijklmnopqrstuvwxyz",
    //This function allows every letter a-z to be guessed again
    resetVG: function () {
        for (p = 0; p < 26; p++) {
            this[this.alphabet.charAt(p)] = true;
        }
    }
}

//Current Word Object
var currentWord = {
    word: " ", displayWord: [],

    //Function that gets a word from my array of words and sets the current word to it
    getWord: function () {
        artistIndex = Math.floor(Math.random() * artistArray.length)
        debugger;
        if(!(artistArray[artistIndex].alreadyGuessed)){
            return artistArray[artistIndex].artistName;
            debugger
        }
        else{
            debugger;
            this.getWord();
        }
    },
    /*Function that checks the player's input to see if it is in my word. If the player's input is in my word, it will update the display. After that it check's if the 
    word has been completely filled in. If the word has been completely filled in, then the player's score will be updated and a new word will be chosen. If the word 
    has not been completed, we wait for next input. If the player's guess was incorrect we subtract 1 from their guesses left and add their input to letters guessed. 
     */
    verifyGuess: function (pg) {
        //Start by assuming the player did not have a correct guess
        var correctGuess = false;
        //Compare the player's guess with every letter in the current word
        for (i = 0; i < this.word.length; i++) {
            //If the player's guess is in the word, this will update the display word at all the indexes where that letter is so it can be revealed to the player
            //and update the fact the player has guessed a letter correctly
            if (pg == this.word.charAt(i)) {
                this.displayWord[i] = pg;
                validGuesses[pg] = false;
                correctGuess = true;
            }
        }
        //If the player's guess was not found in the current word then they lose a guess and the letter is added to the list of incorrect guesses. If this causes
        //the player to run out of guesses, then we call the game over function
        if (!correctGuess) {
            guessesLeft -= 1;
            lettersGuessed += pg;
            validGuesses[pg] = false;
            if (guessesLeft == 0) {
                this.gameOver();
            }
        }
        //If the user has found every lettter in the current word, the word complete function is  called
        if (this.displayWord.join("").trim() == this.word.trim()) {

            this.wordComplete();
        }
    },

    /*When this function is called it is because all letters have been correctly guessed. The list of incorrect guesses is reset, The display album will be revealed to be the 
    artist who was just found. The artist's album art work will also be updated in the album collage. A new word is picked and passed to the display word.  a new word is picked
   , the number of wins is incremeneted and guesses are reset. We then call the function to revalidate all inputs a-z */
    wordComplete: function () {
        artistArray[artistIndex].alreadyGuessed = true;
        debugger
        lettersGuessed = "";
        var idString = this.word;
        idString = idString.replace(/\s+/g, '');
        var updatedAlbum = document.getElementById(idString);
        updatedAlbum.setAttribute("src", albumArt[currentWord.word]);
        displayAlbum.setAttribute("src", albumArt[currentWord.word]);
        currentWord.word = this.getWord();
        debugger
        this.setDisplayWord();
        debugger
        wins++;
        guessesLeft = 10;
        debugger
        validGuesses.resetVG();
        debugger

    },

    //This function sets the display word to be a number of dashes in the spots of the letters and " " of the word
    setDisplayWord: function () {
        this.displayWord = [];
        for (l = 0; l < this.word.length; l++) {
            if (this.word.charAt(l) != " ") {
                this.displayWord[l] = "_";
            }
            else {
                this.displayWord[l] = " ";
            }
        }
        return this.displayWord;
    },
    //sets the playing status to false so that the player can reset the game
    gameOver: function () {
        playing = false;
        ins.textContent = "You are out of guesses! Press any key to restart..."
    }
}

//Initialize letters the player has already guessed
var lettersGuessed = "";

//Wins
var wins = 0;

//Number of Guesses Left
var guessesLeft = 10;

//This sets the first word 
currentWord.word = currentWord.getWord();

//This calls the function to set the display word to be a number of dashes equivalent to the number of letters in the word
currentWord.displayWord = currentWord.setDisplayWord();

//Sets placeholder so the player can see the structure of the word they need to guess
var joinDW = ""
for (q = 0; q < currentWord.displayWord.length; q++) {
    joinDW += currentWord.displayWord[q];
    //Adds a non breaking space to the display word because you can't add multiple spaces in a row to a string without a non-breaking char
    joinDW += "\xa0"
}
//Initializes rest of display
partsFilled.textContent = joinDW;
numWins.textContent = wins;
gL.textContent = guessesLeft;

//Function that Executes when the Player Presses a Key
document.onkeyup = function (event) {

    //We're Playing the Game and haven't lost
    if (playing) {

        playerGuess = event.key;
        //Attempts to check wether or not the players guess is valid. If the guess is valid, the game checks if the guess is in the word. 
        try {

            if (validGuesses[playerGuess]) {
                currentWord.verifyGuess(playerGuess);

            }
            else {
                // alert("you already guessed that letter")

            }

        }
        catch (e) {
            alert("Please enter a letter a-z! " + e.message)
            ProcessExceptionInformation(e.message, e.stack)

        }
        //updates the preview of the word if needeed
        joinDW = ""
        for (n = 0; n < currentWord.displayWord.length; n++) {
            joinDW += currentWord.displayWord[n];
            //Adds a non breaking space to the display word because you can't add multiple spaces in a row to a string without a non-breaking char
            joinDW += "\xa0"
        }
        //updates the rest of the desplay
        numWins.textContent = wins;
        partsFilled.textContent = joinDW;
        numGuessesLeft.textContent = guessesLeft;
        lettersGuessedDis.textContent = lettersGuessed;
    }
    //Reset the Game
    else {
        //Reset our variables
        wins = 0;
        lettersGuessed = "";
        currentWord.word = currentWord.getWord();
        currentWord.setDisplayWord();
        guessesLeft = 10;
        validGuesses.resetVG();
        playing = true;
        joinDW = ""
       
        for (n = 0; n < currentWord.displayWord.length; n++) {
            joinDW += currentWord.displayWord[n];
            //Adds a non breaking space to the display word because you can't add multiple spaces in a row to a string without a non-breaking char
            joinDW += "\xa0"
        }
        //reset the display
        numWins.innerHTML = wins;
        partsFilled.textContent = joinDW;
        numGuessesLeft.textContent = guessesLeft;
        lettersGuessedDis.textContent = lettersGuessed;
        ins.textContent = "Try to guess these rappers"
        for (a=0;a < 13; a++){
            albumCollage[a].setAttribute("src","assets/images/placeholderalbum.jpg");
        }
       
    }
}
