const apiKey = "735728b3418832fb3ae99dfae1b771a7"; // Replace with your OpenWeather API key
function getWeatherByCity() {
 const city = document.getElementById("cityInput").value;
 if (city === "") {
 alert("Please enter a city name");
 return;
 }
 fetchWeatherData(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
 fetchForecastData(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
}
function getWeatherByLocation() {
 if (navigator.geolocation) {
 navigator.geolocation.getCurrentPosition(position => {
 const lat = position.coords.latitude;
 const lon = position.coords.longitude;
 fetchWeatherData(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
 fetchForecastData(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
 });
 } else {
 alert("Geolocation not supported by your browser");
 }
}
function fetchWeatherData(url) {
 fetch(url)
 .then(res => res.json())
 .then(data => {
 document.getElementById("currentWeather").innerHTML = `
 <h3>${data.name}, ${data.sys.country}</h3>
 <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="icon">
 <p>■ ${data.main.temp}°C</p>
 <p>■ ${data.weather[0].description}</p>
 <p>■ Humidity: ${data.main.humidity}%</p>
 `;
 });
}
function fetchForecastData(url) {
 fetch(url)
 .then(res => res.json())
 .then(data => {
 const forecastContainer = document.getElementById("forecast");
 forecastContainer.innerHTML = "";
 const forecastList = data.list.filter(item => item.dt_txt.includes("12:00:00"));
 forecastList.forEach(item => {
 forecastContainer.innerHTML += `
 <div class="forecast-card">
 <p>${new Date(item.dt_txt).toLocaleDateString()}</p>
 <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="icon">
 <p>${item.main.temp}°C</p>
 <p>${item.weather[0].description}</p>
 </div>
 `;
 });
 });
}