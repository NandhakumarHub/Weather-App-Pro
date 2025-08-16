const apiKey = "735728b3418832fb3ae99dfae1b771a7"; // Replace with your OpenWeather API key

// Fetch weather by city
function getWeatherByCity() {
  const city = document.getElementById("cityInput").value;
  if (city === "") {
    alert("Please enter a city name");
    return;
  }
  fetchWeatherData(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
  fetchForecastData(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
}

// Fetch weather by location
function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      fetchWeatherData(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
      fetchForecastData(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
    });
  } else {
    alert("Geolocation not supported by this browser.");
  }
}

// Current weather display
function fetchWeatherData(url) {
  fetch(url)
    .then(response => response.json())
    .then(data => displayWeather(data))
    .catch(error => console.error("Error fetching weather:", error));
}

function displayWeather(data) {
  const weatherDiv = document.getElementById("currentWeather");
  weatherDiv.innerHTML = "";

  if (data.cod !== 200) {
    weatherDiv.innerHTML = `<p>City not found!</p>`;
    return;
  }

  const city = data.name;
  const temp = Math.round(data.main.temp) + "°C";
  const desc = data.weather[0].description;
  const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  weatherDiv.innerHTML = `
    <h2>${city}</h2>
    <img src="${icon}" alt="${desc}">
    <p><strong>${temp}</strong></p>
    <p>${desc}</p>
  `;
}

// Forecast display
function fetchForecastData(url) {
  fetch(url)
    .then(response => response.json())
    .then(data => displayForecast(data))
    .catch(error => console.error("Error fetching forecast:", error));
}

function displayForecast(data) {
  const forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = "";

  const dailyData = {};

  data.list.forEach(item => {
    const date = item.dt_txt.split(" ")[0];
    if (!dailyData[date]) {
      dailyData[date] = item;
    }
  });

  Object.keys(dailyData).slice(0, 5).forEach(date => {
    const item = dailyData[date];
    const temp = Math.round(item.main.temp) + "°C";
    const desc = item.weather[0].description;
    const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

    const card = document.createElement("div");
    card.className = "forecast-card";
    card.innerHTML = `
      <h4>${date}</h4>
      <img src="${icon}" alt="${desc}">
      <p>${temp}</p>
      <p>${desc}</p>
    `;
    forecastDiv.appendChild(card);
  });
}
