// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const cityElement = document.getElementById('city');
const dateElement = document.getElementById('date');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const weatherIconElement = document.getElementById('weather-icon');
const feelsLikeElement = document.getElementById('feels-like');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('wind-speed');
const pressureElement = document.getElementById('pressure');
const forecastContainer = document.getElementById('forecast-container');
const weatherDataElement = document.getElementById('weather-data');
const loaderElement = document.getElementById('loader');
const errorContainer = document.getElementById('error-container');
const errorMessage = document.getElementById('error-message');

// API Configuration
// You can choose which weather API to use by setting USE_WEATHERAPI to true or false
const USE_WEATHERAPI = true; // Set to true to use WeatherAPI.com (free), false to use OpenWeatherMap

// OpenWeatherMap API (has a free tier with limited calls)
const OWM_API_KEY = 'YOUR_OWM_API_KEY'; // Replace with your OpenWeatherMap API key if using it
const OWM_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// WeatherAPI.com (completely free tier available)
const WEATHERAPI_KEY = '8406e9e58460418bbca64659251203'; // Already has a valid API key
const WEATHERAPI_BASE_URL = 'https://api.weatherapi.com/v1';

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Get user's location on page load if permission is granted
    getUserLocation();
    
    // Search button click event
    searchBtn.addEventListener('click', () => {
        const city = searchInput.value.trim();
        if (city) {
            getWeatherData(city);
        }
    });
    
    // Enter key press in search input
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            const city = searchInput.value.trim();
            if (city) {
                getWeatherData(city);
            }
        }
    });

    // Add location button to get current location
    const locationBtn = document.createElement('button');
    locationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i>';
    locationBtn.className = 'location-btn';
    locationBtn.title = 'Get weather for your current location';
    locationBtn.addEventListener('click', getUserLocation);
    
    // Insert location button after search button
    searchBtn.parentNode.insertBefore(locationBtn, searchBtn.nextSibling);
});

/**
 * Shows the loader and hides weather data
 * @param {string} message - Optional message to display in the loader
 */
function showLoader(message = 'Loading weather data...') {
    const loaderText = document.getElementById('loader-text');
    loaderText.textContent = message;
    loaderElement.style.display = 'block';
    weatherDataElement.style.display = 'none';
    errorContainer.style.display = 'none';
}

/**
 * Gets the user's current location using the Geolocation API
 */
function getUserLocation() {
    // Show loader while getting location
    showLoader('Getting your location...');
    
    // Check if geolocation is supported by the browser
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            // Success callback
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                // Get weather data using coordinates
                getWeatherDataByCoords(lat, lon);
            },
            // Error callback
            (error) => {
                console.error('Geolocation error:', error);
                showError('Unable to get your location. Please allow location access or search for a city manually.');
                
                // Fall back to default city
                getWeatherData('New York');
            },
            // Options
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    } else {
        // Geolocation not supported
        showError('Geolocation is not supported by your browser. Please search for a city manually.');
        
        // Fall back to default city
        getWeatherData('New York');
    }
}

/**
 * Fetches weather data using coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 */
async function getWeatherDataByCoords(lat, lon) {
    try {
        if (USE_WEATHERAPI) {
            // Use WeatherAPI.com with coordinates
            await getWeatherFromWeatherAPIByCoords(lat, lon);
        } else {
            // Use OpenWeatherMap with coordinates
            await getWeatherFromOpenWeatherMapByCoords(lat, lon);
        }
    } catch (error) {
        showError(error.message);
        
        // Fall back to default city
        getWeatherData('New York');
    }
}

/**
 * Fetches weather data from WeatherAPI.com using coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 */
async function getWeatherFromWeatherAPIByCoords(lat, lon) {
    try {
        // Fetch current weather and forecast data using coordinates
        const response = await fetch(
            `${WEATHERAPI_BASE_URL}/forecast.json?key=${WEATHERAPI_KEY}&q=${lat},${lon}&days=5&aqi=no&alerts=no`
        );
        
        if (!response.ok) {
            // Check specific error codes
            const errorData = await response.json();
            if (errorData && errorData.error) {
                throw new Error(errorData.error.message || 'Unable to get weather data for your location');
            } else {
                throw new Error('Unable to get weather data for your location');
            }
        }
        
        const data = await response.json();
        
        // Update search input with the location name
        searchInput.value = data.location.name;
        
        // Update UI with fetched data
        updateWeatherUIFromWeatherAPI(data);
    } catch (error) {
        console.error('WeatherAPI coordinates error:', error);
        showError(error.message);
        
        // Fall back to default city
        getWeatherData('New York');
    }
}

/**
 * Fetches weather data from OpenWeatherMap using coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 */
async function getWeatherFromOpenWeatherMapByCoords(lat, lon) {
    // Fetch current weather data using coordinates
    const weatherResponse = await fetch(
        `${OWM_BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OWM_API_KEY}`
    );
    
    if (!weatherResponse.ok) {
        throw new Error('Unable to get weather data for your location');
    }
    
    const weatherData = await weatherResponse.json();
    
    // Fetch 5-day forecast data using coordinates
    const forecastResponse = await fetch(
        `${OWM_BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OWM_API_KEY}`
    );
    
    if (!forecastResponse.ok) {
        throw new Error('Forecast data not available for your location');
    }
    
    const forecastData = await forecastResponse.json();
    
    // Update search input with the location name
    searchInput.value = weatherData.name;
    
    // Update UI with fetched data
    updateWeatherUIFromOpenWeatherMap(weatherData, forecastData);
}

/**
 * Fetches weather data for a given city using the selected API
 * @param {string} city - The city name to get weather data for
 */
async function getWeatherData(city) {
    // Show loader and hide other elements
    showLoader(`Loading weather for ${city}...`);
    
    try {
        if (USE_WEATHERAPI) {
            // Use WeatherAPI.com (free alternative)
            await getWeatherFromWeatherAPI(city);
        } else {
            // Use OpenWeatherMap
            await getWeatherFromOpenWeatherMap(city);
        }
    } catch (error) {
        // Show error message
        showError(error.message);
    }
}

/**
 * Fetches weather data from OpenWeatherMap API
 * @param {string} city - The city name to get weather data for
 */
async function getWeatherFromOpenWeatherMap(city) {
    // Fetch current weather data
    const weatherResponse = await fetch(
        `${OWM_BASE_URL}/weather?q=${city}&units=metric&appid=${OWM_API_KEY}`
    );
    
    if (!weatherResponse.ok) {
        throw new Error('City not found');
    }
    
    const weatherData = await weatherResponse.json();
    
    // Fetch 5-day forecast data
    const forecastResponse = await fetch(
        `${OWM_BASE_URL}/forecast?q=${city}&units=metric&appid=${OWM_API_KEY}`
    );
    
    if (!forecastResponse.ok) {
        throw new Error('Forecast data not available');
    }
    
    const forecastData = await forecastResponse.json();
    
    // Update UI with fetched data
    updateWeatherUIFromOpenWeatherMap(weatherData, forecastData);
}

/**
 * Fetches weather data from WeatherAPI.com (free alternative)
 * @param {string} city - The city name to get weather data for
 */
async function getWeatherFromWeatherAPI(city) {
    try {
        // Fetch current weather and forecast data in one call (3-day forecast is free)
        const response = await fetch(
            `${WEATHERAPI_BASE_URL}/forecast.json?key=${WEATHERAPI_KEY}&q=${city}&days=5&aqi=no&alerts=no`
        );
        
        if (!response.ok) {
            // Check specific error codes
            const errorData = await response.json();
            if (errorData && errorData.error) {
                throw new Error(errorData.error.message || 'City not found or API limit reached');
            } else {
                throw new Error('City not found or API limit reached');
            }
        }
        
        const data = await response.json();
        
        // Update UI with fetched data
        updateWeatherUIFromWeatherAPI(data);
    } catch (error) {
        console.error('WeatherAPI error:', error);
        showError(error.message);
    }
}

/**
 * Updates the UI with weather data from OpenWeatherMap
 * @param {Object} weatherData - Current weather data
 * @param {Object} forecastData - Forecast weather data
 */
function updateWeatherUIFromOpenWeatherMap(weatherData, forecastData) {
    // Update current weather
    cityElement.textContent = `${weatherData.name}, ${weatherData.sys.country}`;
    dateElement.textContent = formatDate(new Date());
    temperatureElement.textContent = `${Math.round(weatherData.main.temp)}°C`;
    descriptionElement.textContent = capitalizeFirstLetter(weatherData.weather[0].description);
    
    // Update weather icon
    updateWeatherIconOWM(weatherData.weather[0].id);
    
    // Update weather details
    feelsLikeElement.textContent = `${Math.round(weatherData.main.feels_like)}°C`;
    humidityElement.textContent = `${weatherData.main.humidity}%`;
    windSpeedElement.textContent = `${Math.round(weatherData.wind.speed * 3.6)} km/h`; // Convert m/s to km/h
    pressureElement.textContent = `${weatherData.main.pressure} hPa`;
    
    // Update forecast
    updateForecastFromOpenWeatherMap(forecastData);
    
    // Show weather data
    hideLoader();
    weatherDataElement.style.display = 'block';
    errorContainer.style.display = 'none';
}

/**
 * Updates the UI with weather data from WeatherAPI.com
 * @param {Object} data - Weather and forecast data
 */
function updateWeatherUIFromWeatherAPI(data) {
    // Update current weather
    cityElement.textContent = `${data.location.name}, ${data.location.country}`;
    dateElement.textContent = formatDate(new Date());
    temperatureElement.textContent = `${Math.round(data.current.temp_c)}°C`;
    descriptionElement.textContent = data.current.condition.text;
    
    // Update weather icon using condition code
    updateWeatherIconWeatherAPI(data.current.condition.code, data.current.is_day);
    
    // Update weather details
    feelsLikeElement.textContent = `${Math.round(data.current.feelslike_c)}°C`;
    humidityElement.textContent = `${data.current.humidity}%`;
    windSpeedElement.textContent = `${Math.round(data.current.wind_kph)} km/h`;
    pressureElement.textContent = `${data.current.pressure_mb} hPa`;
    
    // Update forecast
    updateForecastFromWeatherAPI(data.forecast.forecastday);
    
    // Show weather data
    hideLoader();
    weatherDataElement.style.display = 'block';
    errorContainer.style.display = 'none';
}

/**
 * Updates the forecast section with data from OpenWeatherMap
 * @param {Object} forecastData - Forecast weather data
 */
function updateForecastFromOpenWeatherMap(forecastData) {
    // Clear previous forecast
    forecastContainer.innerHTML = '';
    
    // Get one forecast per day (at 12:00)
    const dailyForecasts = forecastData.list.filter(item => 
        item.dt_txt.includes('12:00:00')
    ).slice(0, 5); // Get only 5 days
    
    // Create forecast items
    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dayName = getDayName(date);
        const temp = Math.round(forecast.main.temp);
        const weatherId = forecast.weather[0].id;
        const iconClass = getWeatherIconClassOWM(weatherId);
        
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <p class="day">${dayName}</p>
            <i class="${iconClass}"></i>
            <p class="temp">${temp}°C</p>
        `;
        
        forecastContainer.appendChild(forecastItem);
    });
}

/**
 * Updates the forecast section with data from WeatherAPI.com
 * @param {Array} forecastDays - Array of forecast days
 */
function updateForecastFromWeatherAPI(forecastDays) {
    // Clear previous forecast
    forecastContainer.innerHTML = '';
    
    // Create forecast items
    forecastDays.forEach(day => {
        const date = new Date(day.date);
        const dayName = getDayName(date);
        const temp = Math.round(day.day.avgtemp_c);
        const conditionCode = day.day.condition.code;
        const iconClass = getWeatherIconClassWeatherAPI(conditionCode, 1); // 1 for day time
        
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <p class="day">${dayName}</p>
            <i class="${iconClass}"></i>
            <p class="temp">${temp}°C</p>
        `;
        
        forecastContainer.appendChild(forecastItem);
    });
}

/**
 * Updates the weather icon based on OpenWeatherMap condition ID
 * @param {number} weatherId - Weather condition ID
 */
function updateWeatherIconOWM(weatherId) {
    const iconClass = getWeatherIconClassOWM(weatherId);
    weatherIconElement.className = iconClass;
}

/**
 * Updates the weather icon based on WeatherAPI condition code
 * @param {number} conditionCode - Weather condition code
 * @param {number} isDay - Whether it's daytime (1) or nighttime (0)
 */
function updateWeatherIconWeatherAPI(conditionCode, isDay) {
    const iconClass = getWeatherIconClassWeatherAPI(conditionCode, isDay);
    weatherIconElement.className = iconClass;
}

/**
 * Returns the appropriate Font Awesome icon class based on OpenWeatherMap condition ID
 * @param {number} weatherId - Weather condition ID
 * @returns {string} - Font Awesome icon class
 */
function getWeatherIconClassOWM(weatherId) {
    // Weather condition codes: https://openweathermap.org/weather-conditions
    if (weatherId >= 200 && weatherId < 300) {
        return 'fas fa-bolt'; // Thunderstorm
    } else if (weatherId >= 300 && weatherId < 400) {
        return 'fas fa-cloud-rain'; // Drizzle
    } else if (weatherId >= 500 && weatherId < 600) {
        return 'fas fa-cloud-showers-heavy'; // Rain
    } else if (weatherId >= 600 && weatherId < 700) {
        return 'fas fa-snowflake'; // Snow
    } else if (weatherId >= 700 && weatherId < 800) {
        return 'fas fa-smog'; // Atmosphere (fog, mist, etc.)
    } else if (weatherId === 800) {
        return 'fas fa-sun'; // Clear sky
    } else if (weatherId > 800) {
        return 'fas fa-cloud-sun'; // Clouds
    } else {
        return 'fas fa-cloud'; // Default
    }
}

/**
 * Returns the appropriate Font Awesome icon class based on WeatherAPI condition code
 * @param {number} code - Weather condition code
 * @param {number} isDay - Whether it's daytime (1) or nighttime (0)
 * @returns {string} - Font Awesome icon class
 */
function getWeatherIconClassWeatherAPI(code, isDay) {
    // WeatherAPI condition codes: https://www.weatherapi.com/docs/weather_conditions.json
    // Simplified mapping to Font Awesome icons
    
    // Thunderstorm conditions
    if ([1087, 1273, 1276, 1279, 1282].includes(code)) {
        return 'fas fa-bolt';
    }
    // Rain conditions
    else if ([1063, 1069, 1072, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246].includes(code)) {
        return 'fas fa-cloud-rain';
    }
    // Heavy rain conditions
    else if ([1171, 1195, 1201, 1246].includes(code)) {
        return 'fas fa-cloud-showers-heavy';
    }
    // Snow conditions
    else if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258, 1279, 1282].includes(code)) {
        return 'fas fa-snowflake';
    }
    // Fog, mist conditions
    else if ([1030, 1135, 1147].includes(code)) {
        return 'fas fa-smog';
    }
    // Clear conditions
    else if (code === 1000) {
        return isDay ? 'fas fa-sun' : 'fas fa-moon';
    }
    // Cloudy conditions
    else if ([1003, 1006, 1009, 1030].includes(code)) {
        return isDay ? 'fas fa-cloud-sun' : 'fas fa-cloud-moon';
    }
    // Default
    else {
        return 'fas fa-cloud';
    }
}

/**
 * Hides the loader
 */
function hideLoader() {
    loaderElement.style.display = 'none';
}

/**
 * Shows an error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    hideLoader();
    weatherDataElement.style.display = 'none';
    errorContainer.style.display = 'block';
    errorMessage.textContent = message || 'An error occurred. Please try again.';
}

/**
 * Formats the date as "Day, DD Month"
 * @param {Date} date - Date object
 * @returns {string} - Formatted date string
 */
function formatDate(date) {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Returns the day name (3 letters) for a given date
 * @param {Date} date - Date object
 * @returns {string} - Day name (3 letters)
 */
function getDayName(date) {
    const options = { weekday: 'short' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Capitalizes the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Theme toggle based on time of day
function setThemeBasedOnTime() {
    const hour = new Date().getHours();
    const body = document.body;
    
    // Night time (7 PM - 6 AM)
    if (hour >= 19 || hour < 6) {
        body.classList.add('night-theme');
        document.querySelectorAll('.star').forEach(star => {
            star.style.opacity = '1';
        });
    } else {
        body.classList.remove('night-theme');
        document.querySelectorAll('.star').forEach(star => {
            star.style.opacity = '0';
        });
    }
}

// Set theme on load and update every hour
setThemeBasedOnTime();
setInterval(setThemeBasedOnTime, 3600000); // Update every hour 