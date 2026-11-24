const cheapest = document.querySelector('.cheapest');
const priceList = document.querySelector('.price-list');
const mostExpensive = document.querySelector('.most-expensive');

function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function toHourlyPrices(values) {
    const hourlyPrices = [];
    for (const item of values) {
        const date = new Date(item.datetime);
        const hour = date.getHours();
        const price = item.value / 1000;
        hourlyPrices.push({ hour, price });
    }
    return hourlyPrices;
}

function renderPrices(prices) {
    for (const item of prices) {
        const formattedHour = formatHour(item.hour);
        const formattedPrice = formatPrice(item.price);
        const li = document.createElement('li');
        li.textContent = `${formattedHour} - ${formattedPrice}`;
        priceList.appendChild(li);
    }
}

function findCheapestHour(prices) {
    let cheapestHour = prices[0];
    for (const item of prices) {
        if (item.price < cheapestHour.price) {
            cheapestHour = item;
        }
    }
    return cheapestHour;
}

function formatPrice(price) {
    return `${price.toFixed(3)} €/kWh`;
}

function formatHour(hour) {
    return `${String(hour).padStart(2, '0')}:00`;
}

function findMostExpensiveHour(prices) {
    let mostExpensiveHour = prices[0];
    for (const item of prices) {
        if (item.price > mostExpensiveHour.price) {
            mostExpensiveHour = item;
        }
    }
    return mostExpensiveHour;
}

async function loadPrices() {
    try {
        const todayDate = getTodayDate();
        const url = `https://apidatos.ree.es/es/datos/mercados/precios-mercados-tiempo-real?start_date=${todayDate}T00:00&end_date=${todayDate}T23:59&time_trunc=hour`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response was not ok, ${response.status}`);
        }
        const data = await response.json();
        const values = data.included[0].attributes.values;
        const prices = toHourlyPrices(values);
        renderPrices(prices);
        const cheapestHourData = findCheapestHour(prices);
        cheapest.textContent = `Cheapest hour: ${formatHour(cheapestHourData.hour)} (${formatPrice(cheapestHourData.price)})`;
        const mostExpensiveHourData = findMostExpensiveHour(prices);
        mostExpensive.textContent = `Most expensive hour: ${formatHour(mostExpensiveHourData.hour)} (${formatPrice(mostExpensiveHourData.price)})`;
    } catch (error) {
        console.error(error);
        cheapest.textContent = `Could not load today's prices. Please try again later.`;
        mostExpensive.textContent = `Could not load most expensive hour. Please try again later.`;
    }
}

loadPrices();
