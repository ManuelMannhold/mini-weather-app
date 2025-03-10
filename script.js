const API_KEY = "9004c77f2c8ea2918108d3858c2fed6c";

async function getData() {
  let inputValue = document.getElementById("input-city");
  if (inputValue.value === "") {
  } else {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${inputValue.value}&appid=${API_KEY}&units=metric&lang=de`
    );
    let responseAsJson = await response.json();
    console.log(responseAsJson);

    if (responseAsJson.cod == "404") {
      displayError();
    } else {
      displayWeather(responseAsJson);
      setBackground(responseAsJson);
    }
    inputValue.value = "";
  }
}

function displayWeather(weather) {
  let weatherName = weather.name;
  let weatherTemp = weather.main.temp.toFixed(0);
  let weatherHumidity = weather.main.humidity;
  let sunriseTime = getSunriseTime(weather);
  let sunsetTime = getSunsetTime(weather);
  let emoji = getWeatherEmoji(weather);
  let currentTime = getTimezone(weather);
  let weatherCard = document.getElementById("weather-card");
  weatherCard.innerHTML = "";

  weatherCard.innerHTML += displayWeatherTemplate(
    weatherName,
    weatherTemp,
    weatherHumidity,
    sunriseTime,
    sunsetTime,
    emoji,
    currentTime
  );
}

function displayWeatherTemplate(
  weatherName,
  weatherTemp,
  weatherHumidity,
  sunriseTime,
  sunsetTime,
  emoji,
  currentTime
) {
  return `
<div class="card">
        <header>
            <div id="city-name">${weatherName}</div>
        </header>
                <div class="weather-info">
                    <span>
                        <div class="temperature">${weatherTemp}°C</div>
                            <div class="emoji-weather">
                                ${emoji}
                            </div>
                    </span>
                    <div class="humidity">Luftfeuchtigkeit: ${weatherHumidity}%</div>
                </div>
                <div class="sunset">
                <span class="bold">
                    Aktuelle Zeit: ${currentTime} Uhr
                </span>
                    <span class="bold">
                        Sonnenaufgang: ${sunriseTime} Uhr
                    </span>
                    <span class="bold">
                    Sonnenuntergang: ${sunsetTime} Uhr
                    </span>
                </div>

        </div>
        `;
}

function getSunriseTime(weather) {
  let sunrise = weather.sys.sunrise;
  let sunriseDate = new Date(sunrise * 1000);
  let hours = sunriseDate.getHours();
  let minutes = sunriseDate.getMinutes().toString().padStart(2, "0");
  let sunriseTime = `${hours}:${minutes}`;

  return sunriseTime;
}

function getSunsetTime(weather) {
  let sunset = weather.sys.sunset;
  let sunsetDate = new Date(sunset * 1000);
  let hours = sunsetDate.getHours();
  let minutes = sunsetDate.getMinutes().toString().padStart(2, "0");
  let sunsetTime = `${hours}:${minutes}`;

  return sunsetTime;
}

function getTimezone(weather) {
  let timezone = weather.timezone;
  let timezoneDate = (timezone = new Date());
  let hours = timezoneDate.getHours();
  let minutes = timezoneDate.getMinutes().toString().padStart(2, "0");
  let tiemzoneTime = `${hours}:${minutes}`;

  return tiemzoneTime;
}

function displayError() {
  let container = document.getElementById("weather-card");

  return (container.innerHTML = `<div class="card-error">Keine Daten vorhanden.</div>`);
}

function getWeatherEmoji(weather) {
  let weathers = weather.weather[0].id;

  if (weathers >= 200 && weathers < 300) {
    return "⛈";
  } else if (weathers >= 300 && weathers < 400) {
    return "🌧";
  } else if (weathers >= 500 && weathers < 600) {
    return "🌧";
  } else if (weathers >= 600 && weathers < 700) {
    return "❄";
  } else if (weathers >= 700 && weathers < 800) {
    return "🌫";
  } else {
    return "☀";
  }
}

function setBackground(city) {
  let container = document.querySelector(".container");
  let cityTime = city.timezone;
  let cityTimes = new Date(cityTime);
  let hours = cityTimes.getHours();
  let minutes = cityTimes.getMinutes().toString().padStart(2, "0");
  let time = `${hours}:${minutes}`;

  if (time > getSunsetTime(city)) {
    document.querySelector(".card").classList.add("night");
    container.classList.add("night-container");
    container.classList.remove("day-container");
  } else {
    document.querySelector(".card").classList.add("day");
    container.classList.add("day-container");
    container.classList.remove("night-container");
  }
}
