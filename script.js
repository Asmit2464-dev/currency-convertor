// // Get elements from HTML
// let amountInput = document.getElementById("amount");
// let fromCurrency = document.getElementById("fromCurrency");
// let toCurrency = document.getElementById("toCurrency");
// let convertBtn = document.getElementById("convertBtn");
// let resultText = document.getElementById("result");

// // API base URL (free, no API key)
// let API_URL = "https://api.exchangerate-api.com/v4/latest/";

// // Add click event to button
// convertBtn.addEventListener("click", async function () {

//     // Get input values
//     let amount = amountInput.value;
//     let from = fromCurrency.value;
//     let to = toCurrency.value;

//     // Basic validation
//     if (amount === "" || amount <= 0) {
//         resultText.innerText = "Please enter a valid amount";
//         return;
//     }

//     try {
//         // fetch() gets data from API
//         // await means "wait until data comes"
//         let response = await fetch(API_URL + from);

//         // Convert response to JSON
//         let data = await response.json();

//         // Get conversion rate
//         let rate = data.rates[to];

//         // Final converted amount
//         let convertedAmount = amount * rate;

//         // Show result (fixed to 2 decimals)
//         resultText.innerText = `${amount} ${from} = ${convertedAmount.toFixed(2)} ${to}`;

//     } catch (error) {
//         // If API fails
//         resultText.innerText = "Error fetching data!";
//         console.log(error);
//     }
// });
// Get elements
let amountInput = document.getElementById("amount");
let fromCurrency = document.getElementById("fromCurrency");
let toCurrency = document.getElementById("toCurrency");
let fromFlag = document.getElementById("fromFlag");
let toFlag = document.getElementById("toFlag");
let convertBtn = document.getElementById("convertBtn");
let resultText = document.getElementById("result");

// Currency API
const API_URL = "https://api.exchangerate-api.com/v4/latest/USD";

// Flag API base
const FLAG_API = "https://flagsapi.com";

// This object maps currency → country (used for flags)
// Covers MOST major currencies
const currencyToCountry = {
    USD: "US",
    INR: "IN",
    EUR: "EU",
    GBP: "GB",
    JPY: "JP",
    AUD: "AU",
    CAD: "CA",
    CHF: "CH",
    CNY: "CN",
    NZD: "NZ",
    SGD: "SG",
    HKD: "HK",
    SEK: "SE",
    NOK: "NO",
    ZAR: "ZA",
    RUB: "RU",
    BRL: "BR",
    MXN: "MX",
    KRW: "KR",
    AED: "AE",
    SAR: "SA"
    // Remaining currencies will use default flag
};

// Fetch all currencies and populate dropdowns
async function loadCurrencies() {
    try {
        let response = await fetch(API_URL);
        let data = await response.json();

        let currencies = Object.keys(data.rates); // 100+ currencies 🎯

        currencies.forEach((currency) => {
            let option1 = document.createElement("option");
            option1.value = currency;
            option1.innerText = currency;
            fromCurrency.appendChild(option1);

            let option2 = document.createElement("option");
            option2.value = currency;
            option2.innerText = currency;
            toCurrency.appendChild(option2);
        });

        // Default selections
        fromCurrency.value = "USD";
        toCurrency.value = "INR";

        updateFlag(fromCurrency, fromFlag);
        updateFlag(toCurrency, toFlag);

    } catch (error) {
        console.log("Error loading currencies", error);
    }
}

// Update flag when currency changes
function updateFlag(selectElement, imgElement) {
    let currency = selectElement.value;
    let countryCode = currencyToCountry[currency] || "UN"; 
    // UN = fallback if country not found

    imgElement.src = `${FLAG_API}/${countryCode}/flat/64.png`;
}

// Event listeners for dropdown change
fromCurrency.addEventListener("change", () => {
    updateFlag(fromCurrency, fromFlag);
});

toCurrency.addEventListener("change", () => {
    updateFlag(toCurrency, toFlag);
});

// Convert currency
convertBtn.addEventListener("click", async () => {
    let amount = amountInput.value;

    if (amount === "" || amount <= 0) {
        resultText.innerText = "Enter valid amount";
        return;
    }

    try {
        let response = await fetch(
            `https://api.exchangerate-api.com/v4/latest/${fromCurrency.value}`
        );
        let data = await response.json();

        let rate = data.rates[toCurrency.value];
        let finalAmount = (amount * rate).toFixed(2);

        resultText.innerText =
            `${amount} ${fromCurrency.value} = ${finalAmount} ${toCurrency.value}`;

    } catch (error) {
        resultText.innerText = "Conversion failed";
        console.log(error);
    }
});

// Load currencies on page load
loadCurrencies();
