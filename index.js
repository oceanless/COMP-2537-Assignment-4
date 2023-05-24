


const setup = () => {
  let firstCard = null;
  let secondCard = null;
  let comparing = false;
  $(".card").on(("click"), function () {
    if ($(this).hasClass("flip") || comparing) {
      return;
    }
    $(this).toggleClass("flip");

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
      } else {
        console.log("no match")
        comparing = true;
        setTimeout(() => {
          $(`#${firstCard.id}`).parent().toggleClass("flip");
          $(`#${secondCard.id}`).parent().toggleClass("flip");
          firstCard = null;
          secondCard = null;
          comparing = false;
        }, 1000)

      }
    }
  });
}

$(document).ready(setup)