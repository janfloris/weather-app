const apiKeyOpenWeather = "86a867295839346ffe70674de8eef195";
const apiKeyPixaBay = "36815996-aa926cadda8d303d9cfe5178f";

const getWeatherData = () => {
  // Previous contents are cleared
  const outputOne = document.querySelector(".outputcontainer");
  outputOne.innerHTML = "";
  const outputTwo = document.querySelector(".forecastcontainer");
  outputTwo.innerHTML = "";
  const outputThree = document.querySelector(".outputcontainersec");
  outputThree.innerHTML = "";

  // The input in the text field is now stored in the variable
  let city = document.querySelector("#city").value;

  // It is checked whether a number or a text is contained in the input. typeof city always outputs String even for a number. Therefore, I used !isNaN as a check operator. So if condition for number or string is possible. If a city is found that the API can find for us, then the loaded data is passed to the processData function.
  if (!isNaN(city)) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=en,&appid=${apiKeyOpenWeather}&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        processData(data);
      })
      .catch((error) => console.log("Error loading: ", error));
  } else if (typeof city === "string") {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},&appid=${apiKeyOpenWeather}&lang=en&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        processData(data);
      })
      .catch((error) => console.log("Error loading: ", error));
  } else {
    window.alert("Please enter a postal code or city!");
  }
};

const processData = (data) => {
  // All data from the data package of the above Fetches are stored in appropriate variables.
  // The city input is saved again in a variable so that the name of the city can be output in the city background later
  let inputValue = city.value;
  const cityName = data.name;
  const coordLat = data.coord.lat;
  const coordLon = data.coord.lon;
  // The latitude is also stored so that the weather map receives exact latitudes and the iframe can function properly
  const coordinatesWeatherCard = `?lat=${data.coord.lat}&lon=${data.coord.lon}&detailLat=${data.coord.lat}&detailLon=${data.coord.lon}`;
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
  const visbility = data.visibility;
  const weatherDescription = data.weather[0].description;
  // The weather icon is loaded despite having my own images. The icon names have been adjusted to the filenames of my personal icons beforehand, so I can just use my local path when outputting
  const weatherIcon = data.weather[0].icon;
  let windDegree = data.wind.deg;
  let windSpeed = data.wind.speed;
  // The degree number in the data fetch is also stored in a separate variable so that the arrow can be rotated in the correct direction during output.
  let windArrowDirection = data.wind.deg;
  // Calculation of the wind direction. The degree number is checked and married to a cardinal direction accordingly and output later.
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
  } else if (i >= 349 && i <= 360) {
    windDegree = +i + "° from North";
  } else if (i >= 0 && i <= 11) {
    windDegree = +i + "° from North";
  }

  // Calculation of timestamps into dates
  sunRise = new Date(sunRise * 1000);
  sunSet = new Date(sunSet * 1000);

  // Conversion of wind speed from m/s to km/h. In general, I multiplied the value by 3.6
  windSpeed = (data.wind.speed * 3.6).toFixed(2);

  // Conversion of times into a short format
  let localeTime = new Date().getTime();
  let date = new Date(localeTime - 3600 * 2000 + data.timezone * 1000);
  timeZone = date.toLocaleTimeString();

  // Fetching current air pollution data through the openweather API
  let airPollution;
  let airPollutionRating;

  fetch(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${coordLat}&lon=${coordLon}&appid=${apiKeyOpenWeather}&units=metric&lang=en`
  )
    .then((res) => res.json())
    .then((data) => {
      airPollution = data.list[0].main.aqi;
      console.log(airPollution);
      if (airPollution == 1) {
        airPollutionRating = "Good";
      } else if (airPollution == 2) {
        airPollutionRating = "Fair";
      } else if (airPollution == 3) {
        airPollutionRating = "Moderate";
      } else if (airPollution == 4) {
        airPollutionRating = "Poor";
      } else if (airPollution == 5) {
        airPollutionRating = "Very Poor";
      }
    })  
    .catch((error) => console.log("Error loading: ", error));
  // Fetching the 5-day forecasts or the 3-hour forecasts through the OpenWeather API. All possible timestamps are stored in separate HTML objects.
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${coordLat}&lon=${coordLon}&appid=${apiKeyOpenWeather}&units=metric&lang=de`
  )
    .then((res) => res.json())
    .then((data) => {
      let outputForecast = document.querySelector(".forecastcontainer");
      const timeInterval = data.list;
      timeInterval.forEach((timestamp) => {
        const today = new Date();
        const todayDay = today.getDate();
        const todayMonth = today.getMonth();
        const todayYear = today.getFullYear();
        const timestampDate = new Date(timestamp.dt_txt);
        const dayApi = timestampDate.getDate();
        const monthApi = timestampDate.getMonth();
        const yearApi = timestampDate.getFullYear();
        const hoursApi = timestampDate.getHours();
        const dayNameApi = timestampDate.toLocaleString("en-EN", {
          weekday: "long",
        });
        const fullDateApi = timestampDate.toLocaleDateString();
        let foreCastTitleTxt;
        let foreCastTitleTime;
        let foreCastTitleDate;
        if (
          dayApi == todayDay &&
          monthApi == todayMonth &&
          yearApi == todayYear
        ) {
          foreCastTitleTxt = `Today`;
          foreCastTitleTime = `${hoursApi}:00 Hr`;
          foreCastTitleDate = `${fullDateApi}`;
        } else if (
          (dayApi - todayDay == 1 &&
            monthApi == todayMonth &&
            yearApi == todayYear) ||
          (todayDay - dayApi == 27 &&
            monthApi - todayMonth == 1 &&
            yearApi == todayYear)
        ) {
          foreCastTitleTxt = `Tomorrow`;
          foreCastTitleTime = `${hoursApi}:00 Hr`;
          foreCastTitleDate = `${fullDateApi}`;
        } else if (
          (dayApi - todayDay == 2 &&
            monthApi == todayMonth &&
            yearApi == todayYear) ||
          (todayDay - dayApi > 27 &&
            monthApi > todayMonth &&
            yearApi == todayYear) ||
          dayApi - todayDay >= 3 ||
          dayApi - todayDay <= -1
        ) {
          foreCastTitleTxt = ` ${dayNameApi}`;
          foreCastTitleTime = `${hoursApi}:00 Hr`;
          foreCastTitleDate = `${fullDateApi}`;
        }

        const foreCastContainer = `<div class=forecastitem> <h2 class=forecastday>${foreCastTitleTxt} </h2>

        <div class = tempforecastbox> <img class=weathericonforecast src="./assets/img/wetterappicons/${
          timestamp.weather[0].icon
        }.png" > <h2> ${timestamp.main.temp.toFixed()} °</h2></div>
        <h3 class=forecasttime>${foreCastTitleTime}</h3>
        <h3 class=forecastdate>${foreCastTitleDate}</h3>
        </div>`;
        outputForecast.insertAdjacentHTML("beforeend", foreCastContainer);
      });

      let outputMainData = document.querySelector(".outputcontainer");
      const outputContainerMain = `<h1 class="weathertitle">Weather in ${cityName},${country}</h1>
  <div class="temperaturecontainer">
  <img src="./assets/img/wetterappicons/${weatherIcon}.png" alt="" class="weathericon" />
    <p class="temperatureoutput">${temp.toFixed()}<span class=tempunit>°C</span></p>
  </div>
  <p class="cloudinfooutput">${weatherDescription}</p>
  <p class="actualtimeoutput">Data received on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
  <div class=cityimg><h2 class=citynameimg> </h2></div>
  <div class="localtimecontainer">
    <h3>Local time</h3>
    <h3 class="localtimeoutput">${timeZone}</h3>
  </div>
  `;
      outputMainData.insertAdjacentHTML("afterbegin", outputContainerMain);
      // Output of the current weather: Main right container with additional data and the weather map.

      let outputSecData = document.querySelector(".outputcontainersec");
      const outputContainerSecondary = `<h2 class=todayhighlights id=innersecitems>Today's Highlights</h2>
      <section class=secondaryitems id=innersecitems>
      <div class="windcontainer">
      <h3>Wind</h3>
      <article class=windinfodescrcontainer><img class="windarrow" src="./assets/img/uparrow.png" > <h4 class="windoutput">${windSpeed} <span class=innerunits> km/h</span></h4></article>
      <h3 class="winddegreeoutput">${windDegree}</h3>
    </div>
    <div class="cloudinesscontainer">
      <h3>Clouds</h3>
      <article class=cloudinfodescrcontainer><img src="./assets/img/wetterappicons/${weatherIcon}.png" alt="" class="weathericoninnercontainer" />
      <h4 class="cloudinessoutput">${weatherDescription}</h4> </article>
    </div>
    <div class="pressurecontainer">
      <h3>Preassure</h3>
      <h3 class="pressureoutput">${pressure} <span class=innerunits>Hpa</span></h3>
    </div>
    <div class="humiditycontainer">
      <h3>Humidity</h3>
      <article class=humiditydescrcontainer><img class="humidityimg" src="./assets/img/wetterappicons/humidity.png"> <h4 class="humidityoutput">${humidity}<span class=innerunits> %</span></h4></article>
    </div>
    <div class="sunrisecontainer">
      <h3>Sunrise/Sunset</h3>
      <h3 class="sunriseoutput"><img class="sunriseimg" src="./assets/img/wetterappicons/sunrise.png">0${sunRise.getHours()}:${sunRise.getMinutes()}<span class=innerunits> Hr </span></h3>
      <h3 class="sunsetoutput"><img class="sunsetimg" src="./assets/img/wetterappicons/sunset.png">${sunSet.getHours()}:${sunSet.getMinutes()}<span class=innerunits> Hr </span></h3>
    </div>
    <div class="feelslikecontainer">
      <h3>Feel Temperature</h3>
      <h3 class="feelslikeoutput">${feelsLike}<span class=innerunits> °C</span></h3>
    </div>
    <div class="airpollutioncontainer">
      <h3>Air pollution</h3>
      <h3 class="airpollutionoutput">${airPollution} <h3 class="airpollutiondescoutput">${airPollutionRating}</h3></h3>
    </div>
    <div class="tempmaxmincontainer">
      <h3>Temp Max/Min</h3>
      <article class=tempmaxminoutputs> <h4 class="tempminoutput"></span>${tempMin.toFixed()}<span class=innerunits> °C</span></h4><h4 class="tempmaxoutput"></span>${tempMax.toFixed()}<span class=innerunits> °C</span></h4></article>  
      <article class=templine></article>
      <article class=minmaxtitle><h4>MIN</h4> <h4>MAX</h4></article>
        </div>
 </section>
`;
      // Output of the weather map in an iframe, where latitude and longitude coordinates were stored in variables earlier.
      const weatherCardOutput = `<div class="coordcontainer" id=innersecitems>
      <h3 class=weathercardtitle>Weather charts</h3>
      <iframe class=iframeweathercard width="100%" height="600px" src="https://embed.windy.com/embed2.html${coordinatesWeatherCard}&width=1000&height=1000&zoom=10&level=surface&overlay=rain&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1" frameborder="0"></iframe>
      <h3 class="coordoutput">Koordinaten[${coordLat.toFixed(
        5
      )},${coordLon.toFixed(5)}]</h3>
    </div>
    `;

      outputSecData.insertAdjacentHTML("afterbegin", outputContainerSecondary);
      outputSecData.insertAdjacentHTML("beforeend", weatherCardOutput);
      document.querySelector(
        ".windarrow"
      ).style.transform = `rotate(${windArrowDirection}deg)`;

      let cityBackground = document.querySelector(".cityimg");
      let cityBackgroundUrl;
      fetch(
        `https://pixabay.com/api/?key=${apiKeyPixaBay}&q=${inputValue}+city`
      )
        .then((res) => res.json())
        .then((data) => {
          let cityNameImg = document.querySelector(".citynameimg");
          cityNameImg.innerHTML = inputValue;
          cityBackgroundUrl = data.hits[0].largeImageURL;
          cityBackground.style.backgroundImage = `url("${data.hits[0].largeImageURL}")`;
        })
        .catch((error) => console.log("Error loading: ", error));

      cityBackground.style.backgroundImage = `url("${cityBackgroundUrl}")`;
    })
    .catch((error) => console.log("Error loading: ", error));
};

city.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    getWeatherData();
  }
});


const container = document.querySelector(".forecastcontainer");
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
const firstInnerContainer = innerContainers[0];
