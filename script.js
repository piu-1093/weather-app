const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');

const weatherInfoSelection = document.querySelector('.weather-info');
const notFoundSelection = document.querySelector('.not-found');
const searchCitySelection = document.querySelector('.search-city');

const countryTxt = document.querySelector('.country-txt');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityValueTxt = document.querySelector('.humidity-value-txt');
const windValueTxt = document.querySelector('.wind-value-txt');
const weatherSummaryImg = document.querySelector('.weather-summary-img');
const currentDateTxt = document.querySelector('.current-date-txt');

const forecastItemsContainer = document.querySelector('.forecast-items-container');

const apiKey = '3a7862ff51afe165ff4fbe49d82b603e';

searchBtn.addEventListener('click', ()=>{
    if(cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value);
        cityInput.value='';
        cityInput.blur();
    }
});

cityInput.addEventListener('keydown', (event)=>{
    if(event.key == 'Enter' && cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value);
        cityInput.value='';
        cityInput.blur();
    }
});

function getCurrentDate(){
    const currentDate = new Date();
    const option = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    return currentDate.toLocaleDateString('en-GB', option);
};

async function getFetchData(endPoint, city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiUrl);

    return response.json();
};

async function updateWeatherInfo(city){
    const weatherData = await getFetchData('weather', city);

    if(weatherData.cod != 200){
        showDisplaySelection(notFoundSelection);
        return;
    }
    console.log(weatherData);

    const {
        name: country,
        main: {temp, humidity},
        weather: [{id, main, icon}],
        wind: {speed}
    } = weatherData

    countryTxt.textContent = country;
    tempTxt.textContent = Math.round(temp) + ' °C';
    conditionTxt.textContent = main;
    humidityValueTxt.textContent = humidity + '%';
    windValueTxt.textContent = speed + ' m/s';

    currentDateTxt.textContent = getCurrentDate();
    weatherSummaryImg.src = `https://openweathermap.org/img/wn/${icon}@4x.png`;

    await updateForecastInfo(city);
    showDisplaySelection(weatherInfoSelection);
};

async function updateForecastInfo(city){
    const forecastsData = await getFetchData('forecast', city);

    const timeTaken = '12:00:00';
    const todayDate = new Date().toISOString().split('T')[0];

    forecastItemsContainer.innerHTML = '';
    forecastsData.list.forEach(forecastWeather => {
        if(forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)){
            updateForecastItems(forecastWeather);
        }
    })
};

function updateForecastItems(weatherData){
    console.log(weatherData);
    const{
        dt_txt: date, 
        weather: [{id, icon}],
        main: {temp}
    } = weatherData

    const dateTaken = new Date(date);
    const dateOption = {
        day: '2-digit',
        month: 'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption);
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`
    const forecastItem = `
                <div class="forecast-item">
                    <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
                    <img src=${iconUrl} class="forecast-item-img">
                    <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
                </div>`;

    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem);
};

function showDisplaySelection(section){
    [weatherInfoSelection, searchCitySelection, notFoundSelection].forEach(section => {
        section.style.display = 'none';
    });

    section.style.display = 'flex';
}