# Weather Pulse - Interactive Weather Website

A beautiful, animated weather website that provides current weather information and 5-day forecasts for cities around the world.

![Weather Pulse Screenshot](screenshot.png)

## Features

- 🌤️ Real-time weather data display
- 📅 5-day weather forecast
- 🔍 Search for any city worldwide
- 🌙 Automatic day/night theme switching
- 📱 Fully responsive design for all devices
- ✨ Beautiful animations and transitions
- 🎨 Modern glass morphism UI design
- 🆓 Support for free weather API services

## How to Use

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Enter a city name in the search box and press Enter or click the search button
4. View the current weather and forecast information

## API Integration

This project supports two weather API services:

### Option 1: WeatherAPI.com (Recommended Free Option)

WeatherAPI.com offers a completely free tier with generous limits (1 million calls per month):

1. Sign up for a free API key at [WeatherAPI.com](https://www.weatherapi.com/signup.aspx)
2. Open `script.js` and replace `'YOUR_WEATHERAPI_KEY'` with your actual API key:

```javascript
const WEATHERAPI_KEY = 'your_actual_weatherapi_key_here';
```

3. Make sure `USE_WEATHERAPI` is set to `true` in script.js:

```javascript
const USE_WEATHERAPI = true;
```

### Option 2: OpenWeatherMap

OpenWeatherMap also offers a free tier with limited API calls (1,000 calls per day):

1. Sign up for a free API key at [OpenWeatherMap](https://openweathermap.org/api)
2. Open `script.js` and replace `'YOUR_OWM_API_KEY'` with your actual API key:

```javascript
const OWM_API_KEY = 'your_actual_openweathermap_key_here';
```

3. Set `USE_WEATHERAPI` to `false` in script.js to use OpenWeatherMap:

```javascript
const USE_WEATHERAPI = false;
```

## Technologies Used

- HTML5
- CSS3 (with animations and responsive design)
- JavaScript (ES6+)
- WeatherAPI.com / OpenWeatherMap API
- Font Awesome icons
- Google Fonts

## Project Structure

- `index.html` - Main HTML structure
- `styles.css` - All styling and animations
- `script.js` - JavaScript functionality and API integration

## Customization

Feel free to customize this project:

- Change the color scheme by modifying the CSS variables in `:root`
- Add more weather details or customize the layout
- Implement additional features like weather maps or historical data
- Switch between different weather API providers

## Browser Compatibility

This website works in all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## License

This project is open source and available under the [MIT License](LICENSE).

## Credits

- Weather data provided by [WeatherAPI.com](https://www.weatherapi.com/) or [OpenWeatherMap](https://openweathermap.org/)
- Icons by [Font Awesome](https://fontawesome.com/)
- Fonts by [Google Fonts](https://fonts.google.com/)

---

Created with ❤️ by Weather Pulse 