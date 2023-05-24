$(document).ready(() => {
  $("#startButton").show(); 
  $("#game_grid").hide();
  $("#info").hide();

  $("#startButton").on("click", () => {
    $("#startButton").hide();
    startGame();
  });

  $("#resetButton").on("click", () => {
    resetGame();
  });

  async function startGame() {
    let firstCard = null;
    let secondCard = null;
    let comparing = false;
    let pairsFound = 0;
    let clickCount = 0;
    let timer;
    let timePassed = 0;
    let gameStarted = false;

    const difficulty = $("input[name='options']:checked").val();
    let maxTime;
    let cardAmount;

    if (difficulty === "easy") {
      maxTime = 100; 
      cardAmount = 6; 
    } else if (difficulty === "medium") {
      maxTime = 200; 
      cardAmount = 12; 
    } else {
      maxTime = 300; 
      cardAmount = 24; 
    }

    $("#totalPairs").text(cardAmount / 2);
    $("#timer").text(maxTime);
    $("#clock").text(timePassed);

    const pokemons = await getRandomPokemons(cardAmount / 2);
    const pokemonImages = pokemons.flatMap(pokemon => [pokemon.sprites.front_default, pokemon.sprites.front_default]);

    generateGameGrid(cardAmount, pokemonImages);

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
        if (firstCard.src === secondCard.src) {
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
      if (pairsFound === cardAmount / 2) {
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
      $("#numPairsLeft").text(cardAmount / 2 - pairsFound);
      $("#numClicks").text(clickCount);
    }

    async function getRandomPokemons(count) {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${count}`);
      const data = await response.json();
      const pokemons = data.results;

      const promises = pokemons.map(async pokemon => {
        const response = await fetch(pokemon.url);
        return await response.json();
      });

      return Promise.all(promises);
    }

    function generateGameGrid(cardAmount, pokemonImages) {
      const gameGrid = $("#game_grid");
      gameGrid.empty(); // Clear the game grid

      for (let i = 1; i <= cardAmount; i++) {
        const card = $("<div>")
          .addClass("card")
          .append($("<img>").addClass("front_face").attr("id", "img" + i).attr("src", getRandomPokemonImage(pokemonImages)))
          .append($("<img>").addClass("back_face").attr("src", "back.webp"));
        gameGrid.append(card);
      }
    }

    function getRandomPokemonImage(pokemonImages) {
      const randomIndex = Math.floor(Math.random() * pokemonImages.length);
      const image = pokemonImages[randomIndex];
      pokemonImages.splice(randomIndex, 1); // Remove the selected image from the array
      return image;
    }

    function startTimer() {
      clock = setInterval(() => {
        timePassed++;
        updateTimer();
        if (timePassed === (maxTime + 1)) {
          stopTimer();
          $("header").text("Time's up!");
          $("#game_grid").text("Try again!");
          $("#game_grid").on("click", () => {
            window.location.href = "./index.html";
          });
        }
      }, 1000);
    }
    

    function stopTimer() {
      clearInterval(clock);
    }

    function updateTimer() {
      $("#clock").text(timePassed);
    }

    gameStarted = true;
    startTimer();

    // Show the game and header
    $("#game_grid").show();
    $("#info").show();
  }
});


