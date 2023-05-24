$(document).ready(() => {
  $("#startButton").show(); // Show the start button
  $("#game_grid").hide();
  $("#info").hide();

  $("#startButton").on("click", () => {
    $("#startButton").hide(); // Hide the start button when clicked
    startGame();
  });

  $("#resetButton").on("click", () => {
    resetGame();
  });

  function startGame() {
    let firstCard = null;
    let secondCard = null;
    let comparing = false;
    let pairsFound = 0;
    const totalPairs = $(".card").length / 2;
    let clickCount = 0;
    $("#totalPairs").text(totalPairs);
    let timer;
    let timePassed = 0;
    let gameStarted = false;

    $(".card").on(("click"), function () {
      if ($(this).hasClass("flip") || comparing) {
        return;
      }
      $(this).toggleClass("flip");
      clickCount++;
      updateHeader();

      if (!firstCard)
        firstCard = $(this).find(".front_face")[0];
      else {
        secondCard = $(this).find(".front_face")[0];
        console.log(firstCard, secondCard);
        if (
          firstCard.src
          ==
          secondCard.src
        ) {
          console.log("match")
          $(`#${firstCard.id}`).parent().off("click");
          $(`#${secondCard.id}`).parent().off("click");
          firstCard = null;
          secondCard = null;
          pairsFound++;
          updateHeader();
          win();
        } else {
          console.log("no match")
          comparing = true;
          setTimeout(() => {
            $(`#${firstCard.id}`).parent().toggleClass("flip");
            $(`#${secondCard.id}`).parent().toggleClass("flip");
            firstCard = null;
            secondCard = null;
            comparing = false;
            updateHeader();
          }, 1000)

        }
      }
    });

    function win() {
      if (pairsFound === totalPairs) {
        setTimeout(() => {
          alert("You win!");

          const winMessage = "You win!";
          $('#winMessage').text(winMessage);
          stopTimer();

        }, 1000);
      }
    }

    function updateHeader() {
      $("#numMatches").text(pairsFound);
      $("#numPairsLeft").text(totalPairs - pairsFound);
      $("#numClicks").text(clickCount);
    }

    function startTimer() {
      timer = setInterval(() => {
        timePassed++;
        updateTimer();
      }, 1000);
    }

    function stopTimer() {
      clearInterval(timer);
    }

    function updateTimer() {
      $("#timer").text(timePassed);
    }

    function resetGame() {
      stopTimer();
      timePassed = 0;
      updateTimer();
      gameStarted = false;
      $(".card").removeClass("flip");
      $(".card").off("click");
      $("#game_grid").hide();
      $("#info").hide();
      $("#startButton").show();
    }

    gameStarted = true;
    startTimer();

    // Show the game and header
    $("#game_grid").show();
    $("#info").show();
  }
});
