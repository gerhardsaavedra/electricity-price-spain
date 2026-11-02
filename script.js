const cheapest = document.querySelector('.cheapest');

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
        console.log(prices);

    } catch (error) {
        console.error(error);
        cheapest.textContent = `Could not load today's prices. Please try again later.`;
    }
}

loadPrices();