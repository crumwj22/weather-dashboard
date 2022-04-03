// global variables
var searchBtn  = document.querySelector('#searchBtn');
var currentWeather = document.querySelector('.currentWeather');
var fiveDayForecast = document.querySelector('.fiveDayForecast');
var listSearchedCities = document.querySelector('.listSearchedCities');
let pastSearches = JSON.parse(window.localStorage.getItem('pastSearches')) || [];

//first API call
searchBtn.addEventListener('click', function(event) {
    event.preventDefault();
    var cityName = document.querySelector('#cityInput').value;
    var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=a7715944e1c51c0dc7f0c45921d07581`

    fetch(requestUrl)
    .then(res => {
        return res.json()
         
    })
    .then(data => {
        let lat = data.coord.lat;
        let lon = data.coord.lon;
        let cityName = data.name;
        console.log(pastSearches.indexOf(cityName))
        if(pastSearches.indexOf(cityName) === -1) {
            pastSearches.push(cityName);
            window.localStorage.setItem('pastSearches', JSON.stringify(pastSearches))
       
        }
        // second API call
        let oneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=a7715944e1c51c0dc7f0c45921d07581&units=imperial`
        fetch(oneCall)
        .then(response => {
           return response.json();
        })
        .then(oneCallData => {
            console.log(oneCallData);
            renderDailyForecast(oneCallData) 
                
        })
    
        // DOM manipulation to HTML;
        // current weather DOM to HTML
    function renderDailyForecast(oneCallData) {
        const name = data.name;
        const temp = oneCallData.current.temp;
        const wind_speed = oneCallData.current.wind_speed;
        const humidity = oneCallData.current.humidity;
        const uvi = oneCallData.current.uvi;
        const icon = oneCallData.current.weather[0].icon;
        
            
        
        
        var nameEl = document.createElement('h1');
        var tempEl = document.createElement('div');
        var windEl = document.createElement('div');
        var humidityEl = document.createElement('div');
        var uvIndexEl = document.createElement('div');
        var iconEl = document.createElement('img');
        var iconDesEl = document.createElement('div');
        iconEl.src = 'https://openweathermap.org/img/w/' + icon + '.png';
        
        var today = moment (); 
        $(".currentWeather").text(today.format("MMM Do, YYYY"));

        currentWeather.append(nameEl, tempEl, windEl, humidityEl, uvIndexEl, iconEl, iconDesEl);
        nameEl.textContent = "" + name;
        tempEl.textContent = "Temp: " + temp;
        windEl.textContent = "Wind Speed: " + wind_speed;
        humidityEl.textContent = "Humidity: " + humidity;
        uvIndexEl.textContent = "UV Index: " + uvi;

            
      }
    
    // create five day forecast cards
    

     })
 })
 // Dynamically create List item from array for city search history
 function renderPastSearches() {
    listSearchedCities.innerHTML = "";
        for(let i = 0; i < pastSearches.length; i++) {
        const historyItem = document.createElement("input");
        historyItem.setAttribute("type","text");
        historyItem.setAttribute("readonly",true);
        historyItem.setAttribute("class", "form-control d-block bg-white");
        historyItem.setAttribute("value", pastSearches[i]);
        historyItem.addEventListener("click",function() {
            renderPastSearches(historyItem.value);
    })
    listSearchedCities.append(historyItem);
    }  
  }

renderPastSearches();
if (pastSearches.length > 0) {
renderPastSearches(pastSearches[pastSearches.length - 1]);
}

renderDailyForecast();