document.getElementById('searchButton').addEventListener('click', fetchWeather);

const cityButtons = document.querySelectorAll('.city-btn');
cityButtons.forEach(button => {
    button.addEventListener('click', () => {
        document.getElementById('cityInput').value = button.innerText;
        fetchWeather();
    });
});

function fetchWeather() {
    const city = document.getElementById('cityInput').value;
    const apiKey = '4cc1f6bddddc15f19efc7b52b506e2ae';
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

    fetch(geoUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                fetchWeatherData(lat, lon, city);
            } else {
                alert('City not found');
            }
        })
        .catch(error => console.error('Error fetching geo data:', error));
}

function fetchWeatherData(lat, lon, city) {
    const apiKey = '4cc1f6bddddc15f19efc7b52b506e2ae';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    fetch(weatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            updateCurrentWeather(data);
            fetchForecast(lat, lon);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function updateCurrentWeather(data) {
    document.getElementById('cityName').innerText = `${data.name} (${new Date().toLocaleDateString()})`;
    document.getElementById('currentTemp').innerText = data.main.temp.toFixed(2);
    document.getElementById('currentWind').innerText = data.wind.speed.toFixed(2);
    document.getElementById('currentHumidity').innerText = data.main.humidity;
}

function fetchForecast(lat, lon) {
    const apiKey = '4cc1f6bddddc15f19efc7b52b506e2ae';
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => updateForecast(data))
        .catch(error => console.error('Error fetching forecast data:', error));
}

function updateForecast(data) {
    const forecastContainer = document.querySelector('.forecast-container');
    forecastContainer.innerHTML = '';
    const dailyData = data.list.filter(item => item.dt_txt.includes('12:00:00'));

    dailyData.forEach(day => {
        const date = new Date(day.dt_txt);
        const icon = day.weather[0].icon;
        const temp = day.main.temp.toFixed(2);
        const wind = day.wind.speed.toFixed(2);
        const humidity = day.main.humidity;

        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';

        forecastCard.innerHTML = `
            <h4>${date.toLocaleDateString()}</h4>
            <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${day.weather[0].description}">
            <p>Temp: ${temp} °F</p>
            <p>Wind: ${wind} MPH</p>
            <p>Humidity: ${humidity} %</p>
        `;

        forecastContainer.appendChild(forecastCard);
    });
}
