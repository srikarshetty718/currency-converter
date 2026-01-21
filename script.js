// script.js
const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const resultValue = document.getElementById("resultValue");
const fromSymbol = document.getElementById("fromSymbol");
const toSymbol = document.getElementById("toSymbol");
const swapBtn = document.getElementById("swap");

const symbols = {
  USD: "$", EUR: "€", INR: "₹", GBP: "£", JPY: "¥",
  AUD: "$", CAD: "$", CHF: "Fr", CNY: "¥", HKD: "$",
  NZD: "$", SEK: "kr", NOK: "kr", DKK: "kr", SGD: "$",
  KRW: "₩", ZAR: "R", RUB: "₽", BRL: "R$", MXN: "$",
  IDR: "Rp", TRY: "₺", PLN: "zł", THB: "฿", PHP: "₱"
};

const codes = Object.keys(symbols);

// Populate Dropdown Menus
codes.forEach(code => {
  fromCurrency.add(new Option(code, code));
  toCurrency.add(new Option(code, code));
});

// Set default values
fromCurrency.value = "INR";
toCurrency.value = "USD";

async function convert() {
  const amount = parseFloat(amountInput.value);
  const from = fromCurrency.value;
  const to = toCurrency.value;

  // Update currency symbols in UI
  fromSymbol.textContent = symbols[from];
  toSymbol.textContent = symbols[to];

  // Logic for empty/invalid amount
  if (isNaN(amount) || amount <= 0) {
    resultValue.textContent = "0.00";
    return;
  }

  // Local calculation if currencies are the same
  if (from === to) {
    resultValue.textContent = amount.toFixed(2);
    return;
  }

  resultValue.textContent = "..."; // Show loading state

  try {
    const response = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`);
    const data = await response.json();
    
    if (data.rates && data.rates[to]) {
      resultValue.textContent = data.rates[to].toFixed(2);
    } else {
      resultValue.textContent = "Error";
    }
  } catch (error) {
    console.error("API Error:", error);
    resultValue.textContent = "Offline";
  }
}

// Swap Button Logic
swapBtn.addEventListener("click", () => {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
  convert();
});

// Event Listeners for changes
amountInput.addEventListener("input", convert);
fromCurrency.addEventListener("change", convert);
toCurrency.addEventListener("change", convert);

// Initial conversion on page load
convert();
