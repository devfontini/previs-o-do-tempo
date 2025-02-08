const apiKey = "0e5810eebf50e24aed4185aaaf65d6c6"; // ⚠️ Coloque sua chave API válida aqui

document.addEventListener("DOMContentLoaded", () => {
    getLocationByIP();
});

// Botão de busca manual
document.getElementById("search-btn").addEventListener("click", () => {
    const city = document.getElementById("city-input").value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        alert("Digite um nome de cidade válido!");
    }
});

// 🔹 Obtém a localização do usuário via IP
async function getLocationByIP() {
    try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (data.city) {
            fetchWeather(data.city);
        } else {
            fetchWeather("São Paulo");
        }
    } catch (error) {
        console.error("Erro ao obter localização via IP. Usando fallback: São Paulo", error);
        fetchWeather("São Paulo");
    }
}

// 🔹 Busca a previsão do tempo pela cidade
async function fetchWeather(city) {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`);
        if (!res.ok) throw new Error("Erro ao buscar cidade. Verifique o nome digitado.");

        const data = await res.json();

        updateWeatherInfo(data);
        changeBackground(data.weather[0].main);
        fetchNearbyCities(data.coord.lat, data.coord.lon);
    } catch (error) {
        console.error("Erro ao buscar previsão do tempo", error);
        updateWeatherInfo(null);
    }
}

// 🔹 Atualiza os dados do clima na página
function updateWeatherInfo(data) {
    const cityName = document.getElementById("city-name");
    const temperature = document.getElementById("temperature");
    const feelsLike = document.getElementById("feels-like");
    const humidity = document.getElementById("humidity");
    const wind = document.getElementById("wind");

    if (data) {
        cityName.innerText = `📍 ${data.name}, ${data.sys.country}`;
        temperature.innerText = `🌡 Temperatura: ${data.main.temp.toFixed(1)}°C`;
        feelsLike.innerText = `🤔 Sensação térmica: ${data.main.feels_like.toFixed(1)}°C`;
        humidity.innerText = `💧 Umidade: ${data.main.humidity}%`;
        wind.innerText = `💨 Vento: ${data.wind.speed.toFixed(1)} km/h`;
    } else {
        cityName.innerText = "❌ Cidade não encontrada";
        temperature.innerText = "";
        feelsLike.innerText = "";
        humidity.innerText = "";
        wind.innerText = "";
    }
}

// 🔹 Obtém cidades próximas
async function fetchNearbyCities(lat, lon) {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=5&appid=${apiKey}&units=metric&lang=pt_br`);
        const data = await res.json();

        const nearbyCitiesContainer = document.getElementById("nearby-cities");
        nearbyCitiesContainer.innerHTML = ""; // Limpa antes de adicionar novas cidades

        data.list.forEach(city => {
            const cityBox = document.createElement("div");
            cityBox.classList.add("city-box");
            cityBox.innerText = `${city.name}: ${city.main.temp.toFixed(1)}°C`;
            nearbyCitiesContainer.appendChild(cityBox);
        });
    } catch (error) {
        console.error("Erro ao buscar cidades próximas", error);
    }
}

// 🔹 Muda a cor do fundo conforme o clima
function changeBackground(weather) {
    let bgColor = "#6db9ef"; // Azul padrão

    if (weather.includes("Rain")) bgColor = "#7a7a7a"; // Cinza para chuva
    if (weather.includes("Clouds")) bgColor = "#a0a0a0"; // Cinza claro para nublado
    if (weather.includes("Clear")) bgColor = "#ffcc00"; // Amarelo para ensolarado
    if (weather.includes("Snow")) bgColor = "#ffffff"; // Branco para neve

    document.body.style.background = `linear-gradient(180deg, ${bgColor}, #7ce7a3)`;
}
