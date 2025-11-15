# Smart City Data Dashboard

A modern, interactive web dashboard that displays real-time smart city data including weather conditions, air quality metrics, and environmental insights for major cities worldwide.

## Features

- 🌤️ **Real-time Weather Data**: Current temperature, humidity, wind speed, pressure, and visibility
- 💨 **Air Quality Monitoring**: AQI (Air Quality Index) with detailed pollutant breakdown (PM2.5, PM10, O₃, NO₂)
- 📊 **Interactive Charts**: 
  - 24-hour temperature forecast
  - Air quality trends visualization
  - 5-day weather forecast
- 💡 **Smart Insights**: AI-generated insights based on current conditions
- 🔄 **Auto-refresh**: Automatic data updates every 5 minutes
- 🌍 **Multi-city Support**: Switch between 6 major cities (London, New York, Tokyo, Paris, Delhi, Beijing)
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla JS - No React)
- **Visualization**: Chart.js 4.4.0
- **APIs**: 
  - OpenWeatherMap API (Weather & Air Quality)
  - Mock data fallback for demonstration

## Setup Instructions

### Option 1: Quick Start (Using Mock Data)

1. Clone or download this repository
2. Open `index.html` directly in your web browser
3. The dashboard will work with mock data for demonstration purposes

### Option 2: Using Real API Data

1. **Get API Keys**:
   - Sign up for a free account at [OpenWeatherMap](https://openweathermap.org/api)
   - Get your API key from the dashboard

2. **Configure API Key**:
   - Open `script.js`
   - Replace `YOUR_OPENWEATHER_API_KEY` on line 2 with your actual API key:
   ```javascript
   const WEATHER_API_KEY = 'your-actual-api-key-here';
   ```

3. **Run the Dashboard**:
   - Open `index.html` in your web browser
   - Or use a local server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js (http-server)
     npx http-server
     
     # Using PHP
     php -S localhost:8000
     ```
   - Navigate to `http://localhost:8000` in your browser

## Project Structure

```
smart-city-dashboard/
│
├── index.html          # Main HTML structure
├── styles.css          # Styling and responsive design
├── script.js           # JavaScript logic and API integration
└── README.md          # This file
```

## API Integration

### OpenWeatherMap API

The dashboard uses two endpoints from OpenWeatherMap:

1. **Current Weather**: `https://api.openweathermap.org/data/2.5/weather`
   - Provides current weather conditions
   
2. **Air Pollution**: `https://api.openweathermap.org/data/2.5/air_pollution`
   - Provides real-time air quality data

3. **5-Day Forecast**: `https://api.openweathermap.org/data/2.5/forecast`
   - Provides weather forecast data

**Note**: The free tier of OpenWeatherMap API allows:
- 60 calls/minute
- 1,000,000 calls/month

## Features Explained

### Weather Card
- Displays current temperature, weather description, and key meteorological data
- Updates in real-time when city is changed or data is refreshed

### Air Quality Card
- Shows AQI on a color-coded scale (Good to Hazardous)
- Displays individual pollutant concentrations
- Visual indicators change color based on air quality level

### Charts
- **Temperature Chart**: Line chart showing 24-hour temperature forecast
- **Air Quality Chart**: Bar chart comparing different pollutant levels
- **Forecast Chart**: Line chart showing 5-day temperature trends

### Insights Panel
- Automatically generates contextual insights based on:
  - Temperature extremes
  - Wind conditions
  - Visibility issues
  - Air quality warnings
  - Health recommendations

## Customization

### Adding New Cities

1. Add city coordinates to the `cityCoordinates` object in `script.js`:
   ```javascript
   'CityName': { lat: latitude, lon: longitude, name: 'CityName' }
   ```

2. Add the city option to the `<select>` element in `index.html`

### Changing Update Interval

Modify the auto-refresh interval at the bottom of `script.js`:
```javascript
setInterval(() => {
    // Change 5 * 60 * 1000 to your desired interval in milliseconds
}, 5 * 60 * 1000);
```

### Styling

All styles are in `styles.css`. The color scheme uses a purple gradient theme that can be easily customized.

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Future Enhancements

- [ ] Add more cities
- [ ] Include traffic density data
- [ ] Add energy consumption metrics
- [ ] Implement data export functionality
- [ ] Add historical data comparison
- [ ] Include more visualization types

## Troubleshooting

### API Errors
- Ensure your API key is correctly set in `script.js`
- Check your API quota hasn't been exceeded
- Verify internet connection
- The dashboard will fall back to mock data if API calls fail

### Charts Not Displaying
- Ensure Chart.js CDN is loading (check browser console)
- Verify JavaScript is enabled in your browser

### Styling Issues
- Clear browser cache
- Ensure `styles.css` is in the same directory as `index.html`

## License

This project is open source and available for educational purposes.

## Credits

- **Chart.js**: https://www.chartjs.org/
- **OpenWeatherMap**: https://openweathermap.org/
- **Icons**: Unicode emoji characters

## Contact & Support

For issues or questions, please check the code comments or refer to the API documentation.

---

**Note**: This dashboard is designed for educational purposes and demonstrates API integration, data visualization, and modern web development practices.

