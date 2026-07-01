const apiKey = "fb9be4be712c42c5a47131953260107";
const searchButton = document.getElementById("search-button");
const citySearch = document.getElementById("city-search");
const cityDisplay = document.getElementById("city");
const temperatureDisplay = document.getElementById("temperature");
const feelslikeDisplay = document.getElementById("feelslike");
const conditionTextDisplay = document.getElementById("condition_text");
const weatherIcon = document.getElementById("weather-icon");

function getWeather() {
  const cityName = citySearch.value.trim();
  if (cityName !== "") {
    console.log("Szukam pogody dla: ", cityName);
    const city = cityName;
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=pl`;
    getWeatherData(city, url);
  } else {
    alert("Wpisz poprawne miasto!");
  }
}
searchButton.addEventListener("click", getWeather);

function getWeatherData(city, url) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Problem z pobraniem danych: " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      showData(
        data.location.name,
        data.current.temp_c,
        data.current.feelslike_c,
        data.current.condition.text,
        data.current.condition.icon,
      );
    })
    .catch((error) => {
      console.error("Wystąpił błąd:", error);
      alert("Wpisz poprawne miasto!");
    });
}

function showData(
  location_name,
  current_temp,
  feelslike_c,
  condition_text,
  condition_icon,
) {
  cityDisplay.textContent = `Miasto: ${location_name}`;
  temperatureDisplay.textContent = `Temperatura: ${current_temp}°C`;
  feelslikeDisplay.textContent = `Odczuwalna: ${feelslike_c}°C`;
  conditionTextDisplay.textContent = `Pogoda: ${condition_text}`;

  weatherIcon.src = `https:${condition_icon}`;
  weatherIcon.alt = condition_text;
}
