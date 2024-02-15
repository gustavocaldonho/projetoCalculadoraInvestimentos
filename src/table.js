const isNonEmptyArray = (arrayElement) => {
  // É um array? (true ou false) && tamanho > 0 (true ou false).
  return Array.isArray(arrayElement) && arrayElement.length > 0;
};

export const createTable = (columnsArray, dataArray, tableId) => {
  // Se não forem arrays preenchidos:
  if (
    !isNonEmptyArray(columnsArray) ||
    !isNonEmptyArray(dataArray) ||
    !tableId //se vier null, undefined, '' -> falsy
  ) {
    throw new Error(
      "Para a correta execução, precisamos de um array com as colunas, outro com as informações das linhas e também o id do elemento tabela selecionado."
    );
  }

  const tableElement = document.getElementById(tableId);
  // Se não recuperar nenhum elemento (null) || Se passar um elemento que não era 'table'.
  if (!tableElement || tableElement.nodeName !== "TABLE") {
    throw new Error("Id informado não corresponde a nenhum elemento table.");
  }

  createTableHeader(tableElement, columnsArray);
  createTableBody(tableElement, dataArray, columnsArray);
};

function createTableHeader(tableReference, columnsArray) {
  function createTheadElement(tableReference) {
    const thead = document.createElement("thead"); //<thead></thead>
    tableReference.appendChild(thead); //<table><thead></thead></table>
    return thead;
  }

  // Recupera um elemento por um seletor (id, classe, etc.). | ?? -> operador de coalescência nula (se o valor da esquerda for null, use o valor da direita).
  const tableHeaderReference =
    tableReference.querySelector("thead") ?? createTheadElement(tableReference);
  //<table><thead></thead></table>

  const headerRow = document.createElement("tr"); //<tr></tr>
  // Adicionando estilo a cada linha do header (cssClass se refere a cada item da lista passada):
  ["bg-blue-900", "text-slate-200", "sticky", "top-0"].forEach((cssClass) =>
    headerRow.classList.add(cssClass)
  );
  for (const tableColumnObject of columnsArray) {
    const headerElement = /*html*/ `<th class='text-center' >${tableColumnObject.columnLabel}</th>`;
    headerRow.innerHTML += headerElement; //usa a extensão es6-string-html, para que seja feita a formatação em html da string criada.
  }
  //<tr><th class='text-center'>Nome da Coluna</th><th class='text-center'>Nome da Coluna</th></tr>
  tableHeaderReference.appendChild(headerRow);
}
function createTableBody(tableReference, tableItems, columnsArray) {
  function createTbodyElement(tableReference) {
    const tbody = document.createElement("tbody");
    tableReference.appendChild(tbody);
    return tbody;
  }

  // Se já tiver um tbody na página html, pegue a referência dele (passada como parâmetro), se não tiver esse elemento tbody, então crie um tbody (função createTbodyElement()).
  const tableBodyReference =
    tableReference.querySelector("tbody") ?? createTbodyElement(tableReference);

  // '.entries()' dá acesso ao Iterator, isto é, uma espécie de gerenciador de iterações que atua sobre uma coleção de dados.
  for (const [itemIndex, tableItem] of tableItems.entries()) {
    const tableRow = document.createElement("tr");

    // Se o índice for ímpar (resto da divisão por 2 diferente de zero).
    if (itemIndex % 2 !== 0) {
      tableRow.classList.add("bg-blue-200");
    }

    for (const tableColumn of columnsArray) {
      const formatFn = tableColumn.format ?? ((info) => info); //atribuindo a uma variável, a função passada como parâmetro.
      tableRow.innerHTML += /*html*/ `<td class="text-center">${formatFn(
        tableItem[tableColumn.accessor]
      )}</td>`; //usa a extensão es6-string-html, para que seja feita a formatação em html da string criada.
    }

    tableBodyReference.appendChild(tableRow);
  }
}
