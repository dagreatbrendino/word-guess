
//Initializing variables to target html elements
var ins = document.getElementById("instructions");
var numWins = document.getElementById("w");
var partsFilled = document.getElementById("filled");
var numGuessesLeft = document.getElementById("gL");
var lettersGuessedDis = document.getElementById("lg");
var albumCollage = document.getElementsByClassName("img-border");
var displayAlbum = document.getElementById("display-image");
//Status tells wether or not the game is active 
var playing = true;

//Initializing player guess
var playerGuess = ""
//Array of all the hip hop artist objects that are used by the object currentWord to pull relevant information
var artistArray=[{artistName: "kendrick lamar", alreadyGuessed: false, albumImg: "assets/images/kendricklamar.jpg"},{artistName: "kanye west",alreadyGuessed: false,
    albumImg: "assets/images/kanyewest.jpg"},{artistName:"drake", alreadyGuessed: false, albumImg:"assets/images/drake.jpg"}, 
    {artistName: "j cole", alreadyGuessed: false, albumImg:"assets/images/jcole.jpg"}, {artistName: "tupac", alreadyGuessed: false, albumImg:"assets/images/tupac.jpg"},
    {artistName: "tyler the creator", alreadyGuessed: false, albumImg:"assets/images/tylerthecreator.jpg"},{artistName:"pusha t", alreadyGuessed: false, albumImg:"assets/images/pushat.jpg"},
    {artistName:"earl sweatshirt", alreadyGuessed: false, albumImg:"assets/images/earlsweatshirt.jpg"}, {artistName:"mac miller", alreadyGuessed: false, albumImg:"assets/images/macmiller.jpg"},
    {artistName:"vince staples", alreadyGuessed: false, albumImg:"assets/images/vincestaples.jpg"}, {artistName:"chance the rapper", alreadyGuessed: false, albumImg:"assets/images/chancetherapper.jpg"},
    {artistName:"frank ocean", alreadyGuessed: false, albumImg:"assets/images/frankocean.jpg"}]

var firstIndex = (Math.floor(Math.random()* 3));
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
    word: " ", displayWord: [], artistIndex: firstIndex, 

    //Function that returns the current word
    getWord: function () {
        return this.word;
    },
    //Function that takes in an artist and sets them equal to the current word
    setWord: function (artist){
        
        this.word = artist;
    },
    //Function that returns the index of the current artist object being referenced 
    getArtistIndex: function(){
        return this.artistIndex;
    },
    //Function picks a new index to grab an artist from the artist array. Importantly, it cannot pick an index for an artist that the player has already found
    setArtistIndex: function() {
        this.artistIndex = Math.floor(Math.random()* artistArray.length)
        if ((artistArray[this.artistIndex].alreadyGuessed)){
            this.setArtistIndex();
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

    /*When this function is called it is because all letters have been correctly guessed. The artist object is updated to reflect that it has already been found. The list of 
    incorrect guesses is reset, The display album will be revealed to be the artist who was just found. The artist's album art work will also be updated in the album collage.
    The player's score increases by one. If the player has guessed every artist, the playerWon() function is called, and the game is over. If the player has not yet won
    A new word is picked and passed to the display word. The player is then given 5 additional guesses We then call the function to revalidate all inputs a-z */
    wordComplete: function () {
        artistArray[this.artistIndex].alreadyGuessed = true;
        lettersGuessed = "";
        var idString = this.word;
        idString = idString.replace(/\s+/g, '');
        var updatedAlbum = document.getElementById(idString);
        updatedAlbum.setAttribute("src", artistArray[this.artistIndex].albumImg);
        displayAlbum.setAttribute("src", artistArray[this.artistIndex].albumImg);
        wins++;
        if (wins === artistArray.length){
            this.playerWon();
        }
        if(( guessesLeft < 7)){
             guessesLeft += 5;
        }
        validGuesses.resetVG();
        debugger
        if(playing){
            this.setArtistIndex();
            this.setWord(artistArray[this.artistIndex].artistName);
            this.setDisplayWord();
        }
    },

    //This function sets the display word to be a number of dashes in the spots of the letters and " " of the word
    setDisplayWord: function () {
        this.displayWord = [];
        for (l = 0; l < currentWord.word.length; l++) {
            if (this.word.charAt(l) != " ") {
                this.displayWord[l] = "_";
            }
            else {
                this.displayWord[l] = " ";
            }
        }
        return this.displayWord;
    },
    //Resets all the variables back to their original state. 
    resetVars: function(){
        wins = 0;
        lettersGuessed = "";
        for (r=0; r < artistArray.length; r++){
            artistArray[r].alreadyGuessed = false;
        }
        currentWord.setArtistIndex();
        currentWord.setWord(artistArray[currentWord.artistIndex].artistName);
        debugger
        currentWord.setDisplayWord();
        debugger
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
        ins.textContent = "Guess the artists unlock their albums!"
        for (a=0;a < 13; a++){
            albumCollage[a].setAttribute("src","assets/images/placeholderalbum.jpg");
        }
    },
    //sets the playing status to false so that the player can reset the game
    gameOver: function () {
        playing = false;
        ins.textContent = "You are out of guesses! Press any key to restart..."
    },
    playerWon: function () {
        playing = false;
        ins.textContent ="Congrats! You found every artist! Press any key to play again..."
    }
}

//Initialize letters the player has already guessed
var lettersGuessed = "";

//Wins
var wins = 0;

//Number of Guesses Left
var guessesLeft = 10;
//This sets the first word 
currentWord.setWord(artistArray[currentWord.artistIndex].artistName);

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
        currentWord.resetVars();
    }
}
