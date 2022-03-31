var searchBtn  = document.querySelector('#searchBtn');
let pastSearches = JSON.parse(window.localStorage.getItem('pastSearches')) || [];


searchBtn.addEventListener('click', function(event) {
    event.preventDefault();
    var cityName = document.querySelector('#cityInput').value;
    var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=130e45b8035df0b2f3d2389f4fb66852`

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
            // Dynamically create List item from array
        }

        let oneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=130e45b8035df0b2f3d2389f4fb66852&units=imperial`
        fetch(oneCall)
        .then(response => {
           return response.json();
        })
        .then(oneCallData => {
            console.log(oneCallData);
            // DOM manipulation to HTML;
        })

        console.log(data)
    })

})

for(let i = 0; i < pastSearches.length; i++) {
    let h1 = document.createElement('h1');
    h1.textContent = pastSearches[i];
    document.querySelector('.listSearchedCities').appendChild(h1)
}
  
  