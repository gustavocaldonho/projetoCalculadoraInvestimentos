import { generateReturnsArray } from "./src/investmentGoals";

const form = document.getElementById("Investment-form");

function renderProgression(evt) {
  // Com o comando abaixo, impediremos que a página seja recarregada e que os campos do formulário sejam limpos.
  evt.preventDefault();

  // Uma vez que os elementos recuperados do form tenham o atributo 'name' especificado em suas tags, eles podem ser recuperados da seguinte forma:
  //   const startingAmount = Number(form["starting-amount"].value);

  const startingAmount = Number(
    document.getElementById("starting-amount").value
  );
  const additionalContribution = Number(
    document.getElementById("additional-contribution").value
  );
  const timeAmount = Number(document.getElementById("time-amount").value);
  const timeAmountPeriod = document.getElementById("time-amount-period").value;
  const returnRate = Number(document.getElementById("return-rate").value);
  const returnRatePeriod = document.getElementById("evaluation-period").value;
  const taxRate = Number(document.getElementById("tax-rate").value);

  const returnsArray = generateReturnsArray(
    startingAmount,
    timeAmount,
    timeAmountPeriod,
    additionalContribution,
    returnRate,
    returnRatePeriod
  );

  console.log(returnsArray);
}

// Retorna um objeto, sendo este passado para a função 'renderProgression'.
form.addEventListener("submit", renderProgression);
