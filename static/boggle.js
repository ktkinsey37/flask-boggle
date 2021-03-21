$scoreBoard = $("#score-board")
$guessedWordList = $("#guessed-word-list")
$timer = $("#timer")
$submitWord = $("#submit-word")
$submitTimer = $("#submit-timer")
$submitTimerForm = $("#submit-timer-form")
$body = $("#body *")
$alertBoard = $("#alert-board")
$guessedWords = $("#all-guessed-words p")
$gameOn = $(".game-on")
$gameOff = $(".game-off")
$highScore = $("#high-score")
$gamesPlayed = $("#games-played")

$gameOn.hide()
$gameOff.show()
$("#submit-score").hide()
$("#new-start-game").hide()
$("#high-score-board").hide()

class Game{
    constructor() {
        this.score = 0
        this.timer($submitTimer.val())
        $scoreBoard.text(0)
        this.wordList = []
        this.startGame()
    }

    startGame(){
        $submitWord.on('click', this.handle_submit.bind(this))
        $submitWord.show()
        $("#guessed-word-label").show()
        $("#guessed-word").show()
        $gameOn.show()
        $gameOff.hide()
        $timer.text("Ready?")
        $("#submit-score").hide()
    }

    async handle_submit(evt){
        evt.preventDefault();
        const word = $("#guessed-word").val();
        $("#guessed-word").val("");
        const results = await axios.get("/check", { params: {word: word}});
        const msg = results.data
        console.log(msg)
        if(msg === 'ok' && !this.wordList.includes(word)){
            this.handleScore(word)
            this.wordList.push(word)
            this.displayWordList()
        } else if (msg === 'ok' && this.wordList.includes(word)){
            $alertBoard.text("You used that word already!")
        } else if (msg === 'not-on-board'){
            $alertBoard.text("That's not on the board!")
        } else {
            $alertBoard.text("That's not a word!")
        }
    }

    timer(x){
        if (x === 0 || x === ""){x = 60}
        let count = x, timer = setInterval(function() {
        $timer.text(count);
        count--
        if(count == -1){
            clearInterval(timer)
            $timer.text("TIME'S UP!")
            Game.endGame()
        } ;
    }, 1000);
    }

    handleScore(word){
        this.score += word.length
        $scoreBoard.text(this.score)
    }

    static displayHighScore(gamesPlayed, highScore){
        $gamesPlayed.text(gamesPlayed)
        $highScore.text(highScore)
    }

    displayWordList(){
        $guessedWordList.empty()
        for (let idx in this.wordList){
            $guessedWordList.append(`<li>${this.wordList[idx]}</li>`)
        }
    }

    //had to make this static because when timer calls it with "this", the "this" refers to a window obj. how to i bind correctly to prevent this?
    static endGame(){
        console.log(game)
        console.log(this)
        $body.unbind()
        $submitWord.hide()
        $("#guessed-word-label").hide()
        $("#guessed-word").hide()
        $("#submit-score").show()
        $("#submit-score").click(game.submitScore)
        //would love to talk about how to not make this dependent on there being an existing game
    }

    async submitScore(){
        const response = await axios.post('http://127.0.0.1:5000/submit', {"score": game.score})
        // await axios({
        //     url: 'http://127.0.0.1:5000/submit',
        //     method: "POST",
        //     data: {"score": game.score},
        //     contentType: 'application/json;charset=utf-8',
        //     dataType: 'json',
        // });
        // Spend a ton of time trying to figure out why the above wasn't working. Could you look at it and tell me what you think?
        const gamesPlayed = response.data["games_played"]
        const highScore = response.data["high_score"]
        $("#submit-score").hide()
        $("#new-start-game").show()
        $("#high-score-board").show()
        Game.displayHighScore(gamesPlayed, highScore)
    }
}


$("#start-game").on("click", game = function(){
    game = new Game
    return game
})