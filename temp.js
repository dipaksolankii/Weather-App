const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessContainer = document.querySelector(
  ".grant-location-container"
);
const searchForm = document.querySelector("[data-searchForm ]");
const loadingScreen = document.querySelector(".loading-container");

const API_KEY = "6a26602192b32d9b1c0fcd357f07e557";
// Setting defaul tab
let currentTab = userTab;
currentTab.classList.add("current-tab");

function switchTab(clickedTab) {
  if (clickedTab != currentTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    if (!searchForm.classList.contains("active")) {
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      getFromSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => {
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});

function getFromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    grantAccessContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

function getLocation() {
  // w3schools for geolocation API
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    // make alert for not supports geolocation
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

getFromSessionStorage();

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  // grant permission container invisible
  grantAccessContainer.classList.remove("active");

  // make loader visible
  loadingScreen.classList.add("active");

  // API call!!!
  try {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    console.log("User - Api Fetch Data", data);

    //remove load screen
    loadingScreen.classList.remove("active");
    //add user info scree
    userInfoContainer.classList.add("active");

    renderWeatherInfo(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
    console.log("Error, during fetching weather");
  }
}

function renderWeatherInfo(weatherInfo) {
  // we've to fetch elements where we have to show data of weather
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  // we use optional chaining ->   ?.   -is syntax
  //fetch city name thorugh JSON
  cityName.innerText = weatherInfo?.name;

  //fetch country flag using flagcdn
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

  // getting weather description like cloudy/sunny
  desc.innerText = weatherInfo?.weather?.[0]?.main;

  //getting description as an img
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

  //getting temp
  temp.innerText = `${weatherInfo?.main?.temp} °C`;

  //getting windspeed
  windspeed.innerText = `${weatherInfo?.wind?.speed.toFixed(2)}m/s`;

  // getting humidity info
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;

  //getting cloudiness info
  cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

const searchInput = document.querySelector("[data-searchInp]");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
    let cityName = searchInput.value;

  if (cityName === "") {
    return;
  } else {
    fetchUserWeatherInfo(cityName);
    cityName = "";
  }
});

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await res.json();

    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    //error handle!!
  }
}
