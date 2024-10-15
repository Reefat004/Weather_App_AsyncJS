const weatherObject1 = {    // hardcoded intially while designing; use API to get information later
    'namelocation' : "Tampa",
    'countryCode' : "US",
    'description' : "Sunny",
    'temperature' : "28.5",
    'feelslike' : "100",
    'windspeed' : "0",
    'humidity' : "99"
}

API_KEY = ""; // place API key here

// use GEOCODING API to convert the city name to longitude and latitude
// asynchronous function (waits for response from API by using the keyword "await")
async function getCoordinates(name){
    try{
        // "await" delays the code until a response is received from the API
        // "await" only works in an async function
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${API_KEY}`, {mode: "cors"});
        const data = await response.json();    // convert the data to javascript object
        //console.log(data[0].lat);
        //console.log(data[0].lon);
        const latLon = {
            lat: data[0].lat,
            lon: data[0].lon
        }
        return latLon;
    }
    catch{
        return "error";
    }
}

//getCoordinates("London");

// retrieve weather data using API
async function getCurrentWeather(lat, lon){
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`, {mode: "cors"});
        const weatherData = await response.json();
        // console.log(weatherData);
        return weatherData;
    }
    catch{
        return "error";
    }
}

//getCurrentWeather(51, 0.12);


// combines both the getCoordinates and getCurrentWeather into one function to retrieve weather data by the name of the city without knowing longitude and latitude
async function weather(name){
    try{
        const coordinates = await getCoordinates(name);
        const data = await getCurrentWeather( coordinates.lat, coordinates.lon );
        // console.log(data);

        const namelocation = data.name;
        const countryCode = data.sys.country;
        const description = data.weather[0].description;
        const temperature = data.main.temp;
        const feelsLike = data.main.feels_like;
        const windspeed = data.wind.speed;
        const humidity = data.main.humidity;


        return {
            namelocation,
            countryCode,
            description,
            temperature,
            feelsLike,
            windspeed,
            humidity
        }
    }
    catch{
        return "error";
    }
}


// function renderWeatherComponent(weatherObj){       // DIFFERENT WAYS TO WRITE FUNCTION
// }

// binds the retrieved data to the html page
const renderWeatherComponent = (weatherObj) => {
    
    const main = document.createElement("main");
    document.querySelector("body").appendChild(main);

    const locationName = document.createElement("h1");
    locationName.id = "location";
    locationName.textContent = `${weatherObj.namelocation}, ${weatherObj.countryCode}`;
    main.appendChild(locationName);

    const description = document.createElement("h2");
    description.id = "description";
    description.textContent = `${weatherObj.description}`;
    main.appendChild(description);

    const bottomContainer = document.createElement("div");
    bottomContainer.id = "bottomContainer";
    main.appendChild(bottomContainer);

    const leftSide = document.createElement("div");
    leftSide.id = "leftSide";
    bottomContainer.appendChild(leftSide);

    const temperature = document.createElement("h2");
    temperature.id = "temperature";
    temperature.textContent = `${weatherObj.temperature}`;
    leftSide.appendChild(temperature);

    const units = document.createElement("h4");
    units.id = "units";
    units.textContent = "K";
    leftSide.appendChild(units);

    const rightSide = document.createElement("div");
    rightSide.id = "rightSide";
    bottomContainer.appendChild(rightSide);

    const feelsLike = document.createElement("p");
    feelsLike.id = "feelsLike";
    feelsLike.textContent = `Feels Like: ${weatherObj.feelsLike} K`;
    rightSide.appendChild(feelsLike);

    const windspeed = document.createElement("p");
    windspeed.id = "wind";
    windspeed.textContent = `Wind: ${weatherObj.windspeed} mph`;
    rightSide.appendChild(windspeed);

    const humidity = document.createElement("p");
    humidity.id = "humidity";
    humidity.textContent = `Humidity: ${weatherObj.humidity} %`;
    rightSide.appendChild(humidity);

}

// renderWeatherComponent(weatherObject1)


async function renderer (weatherObject, first = false){
    const weatherData = await weatherObject;

    if (first == true) {
        renderWeatherComponent(weatherData);
    }
    else{
        document.querySelector("main").remove();
        document.querySelector("input").value = "";
        renderWeatherComponent(weatherData);
    }
}

// make page dynamic using Event Listener
// add event listener to text box; event = whenever "enter" pressed; execute the following block of code
document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();       // prevent page load again
    new_city = document.querySelector("input").value;
    renderer(weather(new_city));     // run renderer function again with the new city name
});


// inital display
renderer(weather("london"), true);
