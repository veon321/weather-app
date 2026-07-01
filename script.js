const apiKey = "fb9be4be712c42c5a47131953260107";
const searchButton = document.getElementById("search-button");
const citySearch = document.getElementById("city-search");
const cityDisplay = document.getElementById("city");
const temperatureDisplay = document.getElementById("temperature");
const feelslikeDisplay = document.getElementById("feelslike");
const conditionTextDisplay = document.getElementById("condition_text");
const weatherIcon = document.getElementById("weather-icon");
const timeDisplay = document.getElementById("time");
const forecastContainer = document.getElementById("forecast-container");
const weatherContainer = document.querySelector(".weather-container");

const hourlyForecastDisplay = document.getElementById("hourly-forecast");
const dailyForecastDisplay = document.getElementById("daily-forecast");

function getWeather() {
  const cityName = citySearch.value.trim();
  if (cityName !== "") {
    console.log("Searching weather for: ", cityName);
    const city = cityName;
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&lang=en`;
    getWeatherData(city, url);
  } else {
    alert("Please enter a valid city!");
  }
}
searchButton.addEventListener("click", getWeather);

function getWeatherData(city, url) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Data fetch error: " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      forecastContainer.classList.remove("hidden");
      weatherContainer.classList.add("expanded");

      showData(
        data.location.name,
        data.current.temp_c,
        data.current.feelslike_c,
        data.current.condition.text,
        data.current.condition.icon,
        data.location.localtime,
      );
      showForecast(data.forecast.forecastday);
    })
    .catch((error) => {
      console.error("An error occurred:", error);
      alert("Please enter a valid city!");
    });
}

function showData(
  location_name,
  current_temp,
  feelslike_c,
  condition_text,
  condition_icon,
  localtime,
) {
  cityDisplay.textContent = `City: ${location_name}`;
  temperatureDisplay.textContent = `Temperature: ${current_temp}°C`;
  feelslikeDisplay.textContent = `Feels like: ${feelslike_c}°C`;
  conditionTextDisplay.textContent = `Weather: ${condition_text}`;

  weatherIcon.src = `https:${condition_icon}`;
  weatherIcon.alt = condition_text;

  timeDisplay.textContent = `Local time: ${localtime}`;
}

function showForecast(forecastDays) {
  hourlyForecastDisplay.innerHTML = "";
  dailyForecastDisplay.innerHTML = "";

  const todayHours = forecastDays[0].hour;
  const selectedHours = [9, 12, 15, 18, 21];

  todayHours.forEach((hour) => {
    const hourNumber = new Date(hour.time).getHours();
    if (selectedHours.includes(hourNumber)) {
      const hourCard = document.createElement("div");
      hourCard.className = "forecast-card";
      hourCard.innerHTML = `
        <p>${hourNumber}:00</p>
        <img src="https:${hour.condition.icon}" alt="${hour.condition.text}">
        <p><strong>${hour.temp_c}°C</strong></p>
      `;
      hourlyForecastDisplay.appendChild(hourCard);
    }
  });

  forecastDays.forEach((day) => {
    const date = new Date(day.date).toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
    });
    const dayCard = document.createElement("div");
    dayCard.className = "forecast-card-day";
    dayCard.innerHTML = `
      <p class="forecast-date">${date}</p>
      <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
      <p><strong>${day.day.avgtemp_c}°C</strong></p>
    `;
    dailyForecastDisplay.appendChild(dayCard);
  });
}
