const apiKey = "644ce177f2832521a036c130adc9e8da";
let icon = document.querySelector(".weathericon");
let weatherTitle = document.querySelector(".weathertitle");
let temperature = document.querySelector(".temperatureoutput");
let cloudInfo = document.querySelector(".cloudinfooutput");
let actualTime = document.querySelector(".actualtimeoutput");
let localTime = document.querySelector(".localtimeoutput");
let wind = document.querySelector(".windoutput");
let cloudiness = document.querySelector(".cloudinessoutput");
let pressureInfo = document.querySelector(".pressureoutput");
let humidityInfo = document.querySelector(".humidityoutput");
let sunriseInfo = document.querySelector(".sunriseoutput");
let sunsetInfo = document.querySelector(".sunsetoutput");
let coordsInfo = document.querySelector(".coordoutput");

const getWeatherData = () => {
  let city = document.querySelector("#city").value;
  if (!isNaN(city)) {
    console.log("Variable is a number");

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=en,&appid=${apiKey}&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        processData(data);
      })
      .catch((error) => console.log("Error loading: ", error));
  } else if (typeof city === "string") {
    console.log("Variable is a string");
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},&appid=${apiKey}&lang=en&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        processData(data);
      })
      .catch((error) => console.log("Error loading: ", error));
  } else {
    window.alert("Please enter a ZIP code or city name!");
    console.log("no input");
  }
};

const processData = (data) => {
  console.log(data);
  const cityName = data.name;
  const coordLat = data.coord.lat;
  const coordLon = data.coord.lon;
  const humidity = data.main.humidity;
  const pressure = data.main.pressure;
  const feelsLike = data.main.feels_like;
  const temp = data.main.temp;
  const tempMax = data.main.temp_max;
  const tempMin = data.main.temp_min;
  const country = data.sys.country;
  let sunRise = data.sys.sunrise;
  let sunSet = data.sys.sunset;
  let timeZone = data.timezone;
  const visibility = data.visibility;
  const weatherDescription = data.weather[0].description;
  const weatherIcon = data.weather[0].icon;
  let windDegree = data.wind.deg;
  const windSpeed = data.wind.speed;

  // Wind direction calculation. It checks the degree value and matches it with a direction and later outputs it.
  let i = windDegree;
  if (i >= 349 && i <= 11) {
    windDegree = +i + "° from North";
  } else if (i >= 12 && i <= 33) {
    windDegree = +i + "° from North-Northeast";
  } else if (i >= 34 && i <= 56) {
    windDegree = +i + "° from Northeast";
  } else if (i >= 57 && i <= 78) {
    windDegree = +i + "° from East-Northeast";
  } else if (i >= 79 && i <= 101) {
    windDegree = +i + "° from East";
  } else if (i >= 102 && i <= 123) {
    windDegree = +i + "° from East-Southeast";
  } else if (i >= 124 && i <= 146) {
    windDegree = +i + "° from Southeast";
  } else if (i >= 147 && i <= 168) {
    windDegree = +i + "° from South-Southeast";
  } else if (i >= 169 && i <= 191) {
    windDegree = +i + "° from South";
  } else if (i >= 192 && i <= 213) {
    windDegree = +i + "° from South-Southwest";
  } else if (i >= 214 && i <= 236) {
    windDegree = +i + "° from Southwest";
  } else if (i >= 237 && i <= 258) {
    windDegree = +i + "° from West-Southwest";
  } else if (i >= 259 && i <= 281) {
    windDegree = +i + "° from West";
  } else if (i >= 282 && i <= 303) {
    windDegree = +i + "° from West-Northwest";
  } else if (i >= 304 && i <= 326) {
    windDegree = +i + "° from Northwest";
  } else if (i >= 327 && i <= 348) {
    windDegree = +i + "° from North-Northwest";
  }
  // Calculation of timestamps into dates
  sunRise = new Date(sunRise * 1000);
  sunSet = new Date(sunSet * 1000);

  // Calculation of times
  let localeTime = new Date().getTime();
  console.log(localeTime);
  let date = new Date(localeTime - 3600 * 2000 + data.timezone * 1000);
  console.log(date);
  timeZone = date.toLocaleTimeString();
  console.log(timeZone);
  // Fetch the 5-day forecast or the 3-hour forecasts
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${coordLat}&lon=${coordLon}&appid=${apiKey}&units=metric&lang=en`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      let outputForecast = document.querySelector(".forecast");
      const timeInterval = data.list;

      timeInterval.forEach((timestamp) => {
        const html = `<div class=forecastitem> <h2 class=forecastday>${timestamp.dt_txt} </h2>
        <div class = tempforecastbox> <img src="http://openweathermap.org/img/wn/${timestamp.weather[0].icon}@2x.png" > <h2> ${timestamp.main.temp} °</h2></div>
        <div class= forecastdescr><h2>${timestamp.weather[0].description} </h2></div>
        </div>`;
        outputForecast.insertAdjacentHTML("beforeend", html);
      });
    })
    .catch((error) => console.log("Error loading: ", error));
  // Output into HTML

  weatherTitle.innerHTML = `Weather in ${cityName},${country}`;
  temperature.innerHTML = `${temp} °C`;
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`
  );
  cloudInfo.innerHTML = `${weatherDescription}`;
  actualTime.innerHTML = new Date();
  localTime.innerHTML = `${timeZone}`;
  wind.innerHTML = `${windDegree},${windSpeed} m/s`;
  cloudiness.innerHTML = `${weatherDescription}`;
  pressureInfo.innerHTML = `${pressure} hPa`;
  humidityInfo.innerHTML = `${humidity} %`;
  sunriseInfo.innerHTML = `0${sunRise.getHours()}:${sunRise.getMinutes()}`;
  sunsetInfo.innerHTML = `${sunSet.getHours()}:${sunSet.getMinutes()}`;
  coordsInfo.innerHTML = `[${coordLat.toFixed(2)},${coordLon.toFixed(2)}]`;
  };
  
  // Execution of the app when the Enter key is pressed. When Enter is pressed on the "Submit" button, the function is executed
  city.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
      getWeatherData();
    }
  });
  
  // Makes the forecast section swipeable
  
  const container = document.querySelector(".forecast");
  const innerContainers = document.querySelectorAll(".forecastitem");
  let isDragging = false;
  let initialX, currentX;
  
  const handleDragStart = (event) => {
    isDragging = true;
    initialX = event.type.startsWith("touch")
      ? event.touches[0].clientX
      : event.clientX;
  };
  
  const handleDragMove = (event) => {
    if (!isDragging) return;
    event.preventDefault();
    currentX = event.type.startsWith("touch")
      ? event.touches[0].clientX
      : event.clientX;
    const diffX = currentX - initialX;
  
    if (
      (container.scrollLeft === 0 && diffX > 0) ||
      (container.scrollLeft === container.scrollWidth - container.offsetWidth &&
        diffX < 0)
    ) {
      isDragging = false;
      return;
    }
  
    container.scrollLeft -= diffX;
    initialX = currentX;
  };
  
  const handleDragEnd = () => {
    isDragging = false;
  };
  
  const stopEventPropagation = (event) => {
    event.stopPropagation();
  };
  
  container.addEventListener("mousedown", handleDragStart);
  container.addEventListener("mousemove", handleDragMove);
  container.addEventListener("mouseup", handleDragEnd);
  container.addEventListener("touchstart", handleDragStart);
  container.addEventListener("touchmove", handleDragMove);
  container.addEventListener("touchend", handleDragEnd);
  
  innerContainers.forEach((innerContainer) => {
    innerContainer.addEventListener("mousemove", stopEventPropagation);
    innerContainer.addEventListener("wheel", stopEventPropagation);
  });
  
  container.addEventListener("wheel", (event) => {
    event.preventDefault();
    container.scrollLeft += event.deltaY;
  });
  // Set start position to the leftmost side of the container
  const firstInnerContainer = innerContainers[0];
  