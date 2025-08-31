// API endpoint for currency exchange rates
const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

// Get DOM elements
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('from-currency');
const toCurrencySelect = document.getElementById('to-currency');
const swapButton = document.getElementById('swap-btn');
const convertedAmountSpan = document.getElementById('converted-amount');
const toCurrencyTextSpan = document.getElementById('to-currency-text');

let currencyRates = {};

// Function to fetch currency rates from the API and populate the dropdowns
async function fetchAndPopulateCurrencies() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    currencyRates = data.rates;

    const currencies = Object.keys(currencyRates);
    currencies.forEach(currency => {
      const option1 = document.createElement('option');
      option1.value = currency;
      option1.textContent = currency;
      fromCurrencySelect.appendChild(option1);

      const option2 = document.createElement('option');
      option2.value = currency;
      option2.textContent = currency;
      toCurrencySelect.appendChild(option2);
    });

    // Set default values and perform initial conversion
    fromCurrencySelect.value = 'USD';
    toCurrencySelect.value = 'EUR';
    convertCurrency();
  } catch (error) {
    console.error('Error fetching currency rates:', error);
    convertedAmountSpan.textContent = 'Error fetching rates';
    toCurrencyTextSpan.textContent = '';
  }
}

// Function to perform the conversion
function convertCurrency() {
  const amount = parseFloat(amountInput.value);
  const fromCurrency = fromCurrencySelect.value;
  const toCurrency = toCurrencySelect.value;

  if (isNaN(amount) || amount < 0) {
    convertedAmountSpan.textContent = 'Invalid amount';
    toCurrencyTextSpan.textContent = '';
    return;
  }

  // Conversion logic: (amount / from_rate) * to_rate
  const rateFrom = currencyRates[fromCurrency];
  const rateTo = currencyRates[toCurrency];
  
  if (!rateFrom || !rateTo) {
      console.error('Rates not available for selected currencies.');
      convertedAmountSpan.textContent = 'Rates not found';
      toCurrencyTextSpan.textContent = '';
      return;
  }
  
  const convertedValue = (amount / rateFrom) * rateTo;

  // Update the UI
  convertedAmountSpan.textContent = convertedValue.toFixed(2);
  toCurrencyTextSpan.textContent = toCurrency;
}

// Function to swap the selected currencies
function swapCurrencies() {
  const temp = fromCurrencySelect.value;
  fromCurrencySelect.value = toCurrencySelect.value;
  toCurrencySelect.value = temp;
  convertCurrency();
}

// Add event listeners
amountInput.addEventListener('input', convertCurrency);
fromCurrencySelect.addEventListener('change', convertCurrency);
toCurrencySelect.addEventListener('change', convertCurrency);
swapButton.addEventListener('click', swapCurrencies);

// Initial setup
fetchAndPopulateCurrencies();
