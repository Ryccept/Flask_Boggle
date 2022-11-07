const form = $("#guess");

let score = 0;
//This is to keep track of submitted words. Resets when counter ends.
let guessedWords = new Set();

// This function runs when a user enters and submits a word on our form. When that happens, it goes to a specific route on our server. This route obtains the argument and then runs the built-in function to verify if it is a word AND on the board. It then returns that answer.
async function checkGuess(answer) {
  const resp = await axios.get("http://127.0.0.1:5000/verify_word", {
    params: { guess: `${answer}` },
  });
  let verification = resp.data.result;

  //once the response is recieved, we can then set up multiple scenarios
  if (verification == "ok") {
    const earnedPoints = answer.length;
    score = score + earnedPoints;
    return "You found a word!";
  }
  if (verification == "not-on-board") {
    return "Valid word, but it is not on this board...";
  }
  if (verification == "not-word") {
    return "This is not a valid word...";
  }
}

// This function runs when a user runs out of time.
async function endGame(score) {
  const resp = await axios.post("http://127.0.0.1:5000/end_game", {
    currentScore: `${score}`,
  });
  console.log(resp.data.highscore);
}

// This sets up the timer and establishes what happens in the end game!
let timer = 60;
const countdown = setInterval(async function () {
  timer--;
  $("#timer").text(`Time Remaining: ${timer}`);
  if (timer == 0) {
    clearInterval(countdown);
    form.hide();
    $("#verification").text("All out of time!");
    $("#score").text(`Your Score is: ${score}`);

    await endGame(score);
    $(".reset").show();
    guessedWords.clear();
  }
}, 1000);

//this sets up what will occur when the button/form is submitted
$(form).on("submit", async function (e) {
  e.preventDefault();
  let guess = $("[name='guess']").val();
  console.log(guess);

  //this prevents duplicates from being used
  if (guessedWords.has(guess)) {
    const msg = "You already entered this word!";
    $("#verification").text(msg);
  } else {
    const msg = await checkGuess(guess);
    $("#verification").text(msg);
    $("#score").text(`Current Score: ${score}`);
    guessedWords.add(guess);
  }
});

//this sets up the reset button to refresh the page:
$(window).on("click", function (e) {
  const target = e.target;
  const cls = $(target).attr("class");
  if (cls == "reset") {
    location.reload();
  }
});
