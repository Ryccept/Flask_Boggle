const form = $("#guess");

score = 0;

// This function runs when a user enters and submits a word on our form. When that happens, it goes to a specific route on our server. This route obtains the argument and then runs the built-in function to verify if it is a word AND on the board. It then returns that answer.
async function checkGuess(answer) {
  const resp = await axios.get("http://127.0.0.1:5000/verify_word", {
    params: { guess: `${answer}` },
  });
  let verification = resp.data.result;

  console.log(verification);
  if (verification == "ok") {
    console.log("You found a word!");
    const earnedPoints = answer.length;
    score = score + earnedPoints;
    return "You found a word!";
  }
  if (verification == "not-on-board") {
    console.log("Valid word, but it is not on this board...");
    return "Valid word, but it is not on this board...";
  }
  if (verification == "not-word") {
    console.log("This is not a valid word...");
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
  }
}, 1000);

//this sets up what will occur when the button/form is submitted
$(form).on("submit", async function (e) {
  e.preventDefault();
  let guess = $("[name='guess']").val();
  console.log(guess);
  const msg = await checkGuess(guess);

  $("#verification").text(msg);
  $("#score").text(`Current Score: ${score}`);
});

//this sets up the reset button to refresh the page:
$(window).on("click", function (e) {
  const target = e.target;
  const cls = $(target).attr("class");
  if (cls == "reset") {
    location.reload();
  }
});
