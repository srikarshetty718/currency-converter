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
  AUD: "$", CAD: "$", CHF: "CHF", CNY: "¥", HKD: "$",
  NZD: "$", SEK: "kr", NOK: "kr", DKK: "kr", SGD: "$",
  KRW: "₩", ZAR: "R", RUB: "₽", BRL: "R$", MXN: "$",
  IDR: "Rp", TRY: "₺", AED: "د.إ", SAR: "﷼",
  PLN: "zł", THB: "฿", MYR: "RM", PHP: "₱"
};

const currencies = Object.keys(symbols);

currencies.forEach(code => {
  fromCurrency.innerHTML += `<option value="${code}">${code}</option>`;
  toCurrency.innerHTML += `<option value="${code}">${code}</option>`;
});

fromCurrency.value = "INR";
toCurrency.value = "USD";

async function convert() {
  const amount = parseFloat(amountInput.value) || 0;
  const from = fromCurrency.value;
  const to = toCurrency.value;

  fromSymbol.textContent = symbols[from];
  toSymbol.textContent = symbols[to];

  const res = await fetch(`https://api.exchangerate.host/latest?base=${from}`);
  const data = await res.json();
  const rate = data.rates[to];

  const converted = amount * rate;
  resultValue.textContent = converted.toFixed(2);
}

swapBtn.addEventListener("click", () => {
  [fromCurrency.value, toCurrency.value] = [toCurrency.value, fromCurrency.value];
  convert();
});

amountInput.addEventListener("input", convert);
fromCurrency.addEventListener("change", convert);
toCurrency.addEventListener("change", convert);

convert();
