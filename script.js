const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");

let firstOperand = null;
let operator = null;
let currentInput = "0";
let awaitingSecondOperand = false;

function updateDisplay() {
  resultEl.textContent = currentInput;
  expressionEl.textContent =
    firstOperand !== null && operator
      ? `${firstOperand} ${operator}`
      : "";
}

function inputNumber(digit) {
  if (awaitingSecondOperand) {
    currentInput = digit;
    awaitingSecondOperand = false;
  } else {
    currentInput = currentInput === "0" ? digit : currentInput + digit;
  }
}

function inputDecimal() {
  if (awaitingSecondOperand) {
    currentInput = "0.";
    awaitingSecondOperand = false;
    return;
  }
  if (!currentInput.includes(".")) {
    currentInput += ".";
  }
}

function compute(a, b, op) {
  switch (op) {
    case "add":
      return a + b;
    case "subtract":
      return a - b;
    case "multiply":
      return a * b;
    case "divide":
      return b === 0 ? NaN : a / b;
    default:
      return b;
  }
}

function handleOperator(nextOperator) {
  const inputValue = parseFloat(currentInput);

  if (operator && awaitingSecondOperand) {
    operator = nextOperator;
    return;
  }

  if (firstOperand === null) {
    firstOperand = inputValue;
  } else if (operator) {
    const result = compute(firstOperand, inputValue, operator);
    currentInput = `${parseFloat(result.toFixed(10))}`;
    firstOperand = result;
  }

  awaitingSecondOperand = true;
  operator = nextOperator;
}

function clearAll() {
  currentInput = "0";
  firstOperand = null;
  operator = null;
  awaitingSecondOperand = false;
}

function negate() {
  currentInput = `${parseFloat(currentInput) * -1}`;
}

function percent() {
  currentInput = `${parseFloat(currentInput) / 100}`;
}

function equals() {
  if (operator === null || awaitingSecondOperand) return;
  const inputValue = parseFloat(currentInput);
  const result = compute(firstOperand, inputValue, operator);
  currentInput = `${parseFloat(result.toFixed(10))}`;
  firstOperand = null;
  operator = null;
  awaitingSecondOperand = false;
}

document.querySelector(".keys").addEventListener("click", (event) => {
  const target = event.target;
  if (!target.matches("button")) return;

  const { number, action } = target.dataset;

  if (number !== undefined) {
    inputNumber(number);
    updateDisplay();
    return;
  }

  switch (action) {
    case "clear":
      clearAll();
      break;
    case "negate":
      negate();
      break;
    case "percent":
      percent();
      break;
    case "decimal":
      inputDecimal();
      break;
    case "equals":
      equals();
      break;
    case "add":
    case "subtract":
    case "multiply":
    case "divide":
      handleOperator(action);
      break;
  }

  updateDisplay();
});

document.addEventListener("keydown", (event) => {
  if (event.key >= "0" && event.key <= "9") {
    inputNumber(event.key);
  } else if (event.key === ".") {
    inputDecimal();
  } else if (event.key === "Enter" || event.key === "=") {
    equals();
  } else if (event.key === "Escape") {
    clearAll();
  } else if (event.key === "+") {
    handleOperator("add");
  } else if (event.key === "-") {
    handleOperator("subtract");
  } else if (event.key === "*") {
    handleOperator("multiply");
  } else if (event.key === "/") {
    event.preventDefault();
    handleOperator("divide");
  } else {
    return;
  }
  updateDisplay();
});

updateDisplay();
