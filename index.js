const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const input = document.getElementById('autocomplete');

const translateDescription = (description) => {
    const translations = {
        'clear sky': 'céu limpo',
        'overcast clouds': 'céu nublado',
        'few clouds': 'poucas nuvens',
        'scattered clouds': 'nuvens dispersas',
        'broken clouds': 'nuvens quebradas',
        'shower rain': 'chuva de banho',
        'rain': 'chuva',
        'thunderstorm': 'trovoada',
        'snow': 'neve',
        'mist': 'névoa',
        'haze': 'neblina',
    };
    return translations[description.toLowerCase()] || description;
};

const autocomplete = new google.maps.places.Autocomplete(input);

autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    if (!place.geometry) {
        return;
    }
    const city = place.name;
    fetchWeather(city);
});

search.addEventListener('click', () => {
    const city = input.value;
    if (city === '') return;
    fetchWeather(city);
});

input.addEventListener('click', function() {
    this.select();
});

const setBackground = (temp) => {
    if (temp <= 0) {
        document.body.style.backgroundImage = 'url("src/images/cold.gif")';
    } else if (temp > 0 && temp <= 23) {
        document.body.style.backgroundImage = 'url("src/images/warm.gif")';
    } else if (temp > 23 && temp <= 25) {
        document.body.style.backgroundImage = 'url("src/images/warm.gif")';
    } else {
        document.body.style.backgroundImage = 'url("src/images/hot.gif")';
    }
};

const fetchWeather = (city) => {
    const APIKey = '22d2e2199cb498f963b99bcd19a467cd';
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {
            if (json.cod === '404') {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                return;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            switch (json.weather[0].main) {
                case 'Clear':
                    image.src = 'src/images/clear.png';
                    break;
                case 'Rain':
                    image.src = 'src/images/rain.png';
                    break;
                case 'Snow':
                    image.src = 'src/images/snow.png';
                    break;
                case 'Clouds':
                    image.src = 'src/images/cloud.png';
                    break;
                case 'Haze':
                    image.src = 'src/images/mist.png';
                    break;
                default:
                    image.src = '';
            }

            const temp = parseInt(json.main.temp);
            temperature.innerHTML = `${temp}<span>°C</span>`;
            description.innerHTML = translateDescription(json.weather[0].description);
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

            setBackground(temp);

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '590px';
        });
};