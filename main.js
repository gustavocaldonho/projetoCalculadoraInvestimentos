import { generateReturnsArray } from "./src/investmentGoals";
import { Chart } from "chart.js/auto";

const finalMoneyChart = document.getElementById("final-money-distribution");
const progressionChart = document.getElementById("progression");
const form = document.getElementById("Investment-form");
const clearFormButton = document.getElementById("clear-form");
let doughnutChartReference = {};
let progressionChartReference = {};

function formatCurrency(value) {
  return value.toFixed(2); //especifica a quantidade de casas decimais.
}

function renderProgression(evt) {
  // Com o comando abaixo, impediremos que a página seja recarregada e que os campos do formulário sejam limpos.
  evt.preventDefault();

  // Quando uma div estiver marcada com '.error', o formulário não é enviado, isto é, os cálculos não serão feitos ('!!document.querySelector(".error")' retorna false ou true) -> as '!!' servem para indicar se o valor é true ou false.
  if (document.querySelector(".error")) {
    return;
  }

  resetCharts(); //limpando os gráficos.

  // Uma vez que os elementos recuperados do form tenham o atributo 'name' especificado em suas tags, eles podem ser recuperados da seguinte forma:
  //   const startingAmount = Number(form["starting-amount"].value);

  const startingAmount = Number(
    document.getElementById("starting-amount").value.replace(",", ".")
  );
  const additionalContribution = Number(
    document.getElementById("additional-contribution").value.replace(",", ".")
  );
  const timeAmount = Number(document.getElementById("time-amount").value);
  const timeAmountPeriod = document.getElementById("time-amount-period").value;
  const returnRate = Number(
    document.getElementById("return-rate").value.replace(",", ".")
  );
  const returnRatePeriod = document.getElementById("evaluation-period").value;
  const taxRate = Number(
    document.getElementById("tax-rate").value.replace(",", ".")
  );

  const returnsArray = generateReturnsArray(
    startingAmount,
    timeAmount,
    timeAmountPeriod,
    additionalContribution,
    returnRate,
    returnRatePeriod
  );

  const finalInvestmentObject = returnsArray[returnsArray.length - 1];

  doughnutChartReference = new Chart(finalMoneyChart, {
    type: "doughnut",
    data: {
      labels: ["Total investido", "Rendimento", "Imposto"],
      datasets: [
        {
          data: [
            formatCurrency(finalInvestmentObject.investedAmount),
            formatCurrency(
              finalInvestmentObject.totalInterestReturns * (1 - taxRate / 100)
            ),
            formatCurrency(
              finalInvestmentObject.totalInterestReturns * (taxRate / 100)
            ),
          ],
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
          ],
          hoverOffset: 4,
        },
      ],
    },
  });

  progressionChartReference = new Chart(progressionChart, {
    type: "bar",
    data: {
      labels: returnsArray.map((investmentObject) => investmentObject.month), //meses
      datasets: [
        {
          label: "Total Investido",
          data: returnsArray.map((investmentObject) =>
            formatCurrency(investmentObject.investedAmount)
          ), //criando uma segunda lista somente com os valores investidos de cada mês.
          backgroundColor: "rgb(255, 99, 132)",
        },
        {
          label: "Retorno de Investimento",
          data: returnsArray.map((investmentObject) =>
            formatCurrency(investmentObject.interestReturns)
          ), //criando uma segunda lista somente com os retornos de investimentos de cada mês.
          backgroundColor: "rgb(54, 162, 235)",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    },
  });
}

function isObjectEmpty(obj) {
  // 'Object.keys' retorna uma lista com todas as chaves do objeto (se o objeto estiver vazio, retorna uma lista vazia, já que não possui chaves).
  return Object.keys(obj).length === 0;
}

function resetCharts() {
  // Quando os dois gráficos precisarem ser limpos.
  if (
    !isObjectEmpty(doughnutChartReference) &&
    !isObjectEmpty(progressionChartReference)
  ) {
    doughnutChartReference.destroy();
    progressionChartReference.destroy();
  }
}

function clearForm() {
  form["starting-amount"].value = "";
  form["additional-contribution"].value = "";
  form["time-amount"].value = "";
  form["return-rate"].value = "";
  form["tax-rate"].value = "";

  resetCharts();

  // Retorna todos os elementos que se adequam com a pesquisa indicada.
  const errorInputsContainers = document.querySelectorAll(".error");

  for (const errorInputContainer of errorInputsContainers) {
    errorInputContainer.classList.remove("error");
    errorInputContainer.parentElement.querySelector("p").remove();
  }
}

// O parâmetro 'evt' se refere a um objeto que é retornado ao chamar a função 'addEventListener'.
function validateInput(evt) {
  // console.log(evt.target); //pega o elemento que sofreu o 'blur'.

  if (evt.target.value === "") {
    return; //sai da função.
  }

  const { parentElement } = evt.target; //elemento pai (receberá a borda vermelha).
  const grandParentElement = evt.target.parentElement.parentElement; //elemento avô (receberá a mensagem de erro).
  const inputValue = evt.target.value.replace(",", ".");

  if (
    //se o campo possuir um valor inválido.
    (isNaN(inputValue) || Number(inputValue) <= 0) &&
    !parentElement.classList.contains("error")
  ) {
    // Objetivo: <p class="text-red-500">Insira um valor numérico e maior do que zero</p>;
    const errorTextElement = document.createElement("p"); //criando o elemento '<p></p>'.
    errorTextElement.classList.add("text-red-500"); //adicionando uma classe ao objeto '<p class="text-red-500"></p>'.
    errorTextElement.innerText = "Insira um valor numérico e maior do que zero"; //acrescentando um texto ao elemento '<p class="text-red-500">Insira um valor numérico e maior do que zero</p>'.

    parentElement.classList.add("error"); //pinta a borda do elemento.
    grandParentElement.appendChild(errorTextElement); //acrescenta um elemento à parte final da tag referenciada.
  } else if (
    // Se o usuário corrigir o erro do campo, inserindo um valor válido, a indicação de erro deve sumir.
    parentElement.classList.contains("error") &&
    !isNaN(inputValue) &&
    Number(inputValue) > 0
  ) {
    parentElement.classList.remove("error");
    grandParentElement.querySelector("p").remove(); //pesquisando um elemento dentro da tag 'grandparenteElement' por meio de um dado, como uma classe, id, nome da tag (p, div, ...), etc. e removendo o mesmo.
  }
}

for (const formElement of form) {
  // Todos os campos relevantes são inputs e possuem a tag 'name'.
  if (formElement.tagName === "INPUT" && formElement.hasAttribute("name")) {
    // Retorna um objeto para a função 'validateInput'.
    formElement.addEventListener("blur", validateInput);
  }
}

// Retorna um objeto, sendo este passado para a função 'renderProgression'.
form.addEventListener("submit", renderProgression);
clearFormButton.addEventListener("click", clearForm);
