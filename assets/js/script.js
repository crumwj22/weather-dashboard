// global variables
var searchBtn  = document.querySelector('#searchBtn');
var currentWeather = document.querySelector('.currentWeather');
var fiveDayForecast = document.querySelector('.fiveDayForecast');
var listSearchedCities = document.querySelector('.listSearchedCities');
let pastSearches = JSON.parse(window.localStorage.getItem('pastSearches')) || [];


var triggerSearch = searchBtn.addEventListener('click', function(event) {
    event.preventDefault();
    var cityName = document.querySelector('#cityInput').value;

    initalSearch(cityName);
})

function initalSearch(cityName) {

    // clear current weather and five day forecast
    currentWeather.innerHTML = "";
    fiveDayForecast.innerHTML = "";
    
    //first API call
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
            renderDailyForecast(oneCallData, cityName);
            // For loop to loop through the array of daily forecast
            // Start at the 2nd index (which is 1) because the first index is the current day
            // and we want the next 5 days.
            for(var i=1; i < 6; i++){
                renderFiveDayForecast(oneCallData.daily[i]);
            }
        });
        
    })
}
        // DOM manipulation to HTML;
        // current weather DOM to HTML
    function renderDailyForecast(oneCallData, cityName) {
        renderPastSearches();
        
        const name = cityName
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

        currentWeather.append(
            nameEl,
            iconEl, 
            iconDesEl,
            tempEl, 
            windEl, 
            humidityEl, 
            uvIndexEl 
            );
        $(uvIndexEl).addClass('uvIndexEl')
        nameEl.textContent = "" + name;
        tempEl.textContent = "Temp: " + temp + " °F";
        windEl.textContent = "Wind: " + wind_speed + " MPH";
        humidityEl.textContent = "Humidity: " + humidity  + " %";
        uvIndexEl.textContent = "UV Index: " + uvi;
        // add function
       if (uvi <=3) {
       $(".uvIndexEl").css({"padding": "5px", "background-color": "green", "width": "fit-content"});
       console.log(uvi)
    }
       else if (uvi <= 5) {
        console.log(uvi)
       $(".uvIndexEl").css({"padding": "5px", "background-color": "yellow", "width": "fit-content"});

    }
       else {
        $(".uvIndexEl").css({"padding": "5px", "background-color": "red", "width": "fit-content"});

    }
}
    // create five day forecast cards
    function renderFiveDayForecast(daily) {
        
        
        const temp = daily.temp.day;
        const wind_speed = daily.wind_speed;
        const humidity = daily.humidity;
        const icon = daily.weather[0].icon;
        
        // moment to convert the unix timestamp to date format
        const time = moment.unix(daily.dt).format("MM/DD/YYYY");
        var dateEl = document.createElement("h6");
        
        //create a "card div" to hold our separate forecast
        var cardDiv = document.createElement("div");
        cardDiv.classList = "card-body text-left me-3 bg-secondary text-light col-2";
        var tempEl = document.createElement('div');
        var windEl = document.createElement('div');
        var humidityEl = document.createElement('div');
        var iconEl = document.createElement('img');
        var iconDesEl = document.createElement('div');
        iconEl.src = 'https://openweathermap.org/img/w/' + icon + '.png';

        //append all the forecast data to the card
        cardDiv.append(
            dateEl,
            iconEl,
            iconDesEl,
            tempEl,
            windEl,
            humidityEl            
        );
        
        //append the card to the forecast div
        fiveDayForecast.append(cardDiv);
        dateEl.textContent = time;       
        tempEl.textContent = "Temp: " + temp + " °F";
        windEl.textContent = "Wind: " + wind_speed + " MPH";
        humidityEl.textContent = "Humidity: " + humidity + " %";
                
    }
    
 // Dynamically create List item from array for city search history
 function renderPastSearches() {
    listSearchedCities.innerHTML = "";
        for(let i = 0; i < pastSearches.length; i++) {
        const historyItem = document.createElement("input");
        historyItem.setAttribute("class", "form-control d-block bg-white pastSearch");
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

$(".listSearchedCities").on('click', function(event) {
    if(!event.target.matches('.pastSearch')) {
        return;
    }

    var search = event.target.value;
    initalSearch(search)
})

$('#deleteBtn').on('click', function() {
    localStorage.clear();
    location.reload();
})

