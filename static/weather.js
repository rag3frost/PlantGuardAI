const API_KEY = ''; //Your Open Weather API key

function updateWeatherIcon(weatherCondition) {
    const iconMap = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Drizzle': '🌦️',
        'Thunderstorm': '⛈️',
        'Snow': '🌨️',
        'Mist': '🌫️',
        'Haze': '🌫️',
        'Fog': '🌫️'
    };

    // Get the default icon (sun) if weather condition is not in our map
    return iconMap[weatherCondition] || '☀️';
}

function getWeather() {
    // First, get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
                .then(response => response.json())
                .then(data => {
                    // Update weather widget
                    updateWeatherWidget(data);
                })
                .catch(error => {
                    console.error('Error fetching weather:', error);
                });
        }, error => {
            console.error('Error getting location:', error);
        });
    }
}

function updateWeatherWidget(weatherData) {
    document.getElementById('city-name').textContent = weatherData.name;
    document.getElementById('temperature').textContent = `${Math.round(weatherData.main.temp)}°C`;
    document.getElementById('weather-description').textContent = weatherData.weather[0].main;
    
    // Instead of using an img tag, we'll use the text content
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.textContent = updateWeatherIcon(weatherData.weather[0].main);
}

// Update weather every 5 minutes
getWeather();
setInterval(getWeather, 300000); 
