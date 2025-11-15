<<<<<<< HEAD
const AIR_QUALITY_API_KEY = '91c1e041-ee9c-4331-9c30-9f91b2ddafea'; // Get from https://www.iqair.com/air-pollution-data-api


=======
// API Keys - In production, these should be stored securely
// For demo purposes, using free tier APIs that may require registration
const WEATHER_API_KEY = '9e03c5bcecceb88a641172a81d7d6929'; // Get from https://openweathermap.org/api
<<<<<<< HEAD

=======
>>>>>>> 36a3600857700c9e81f59f2e7a8a8e5bcb2defb0
>>>>>>> 2b32b6cff26b31d4e36fd5d2236fa99d8989f1cf
// City coordinates mapping
const cityCoordinates = {
    'London': { lat: 51.5074, lon: -0.1278, name: 'London' },
    'New York': { lat: 40.7128, lon: -74.0060, name: 'New York' },
    'Tokyo': { lat: 35.6762, lon: 139.6503, name: 'Tokyo' },
    'Paris': { lat: 48.8566, lon: 2.3522, name: 'Paris' },
    'Delhi': { lat: 28.6139, lon: 77.2090, name: 'Delhi' },
    'Beijing': { lat: 39.9042, lon: 116.4074, name: 'Beijing' },
    'Mumbai': { lat: 19.0760, lon: 72.8777, name: 'Mumbai' },
    'Sydney': { lat: -33.8688, lon: 151.2093, name: 'Sydney' },
    'Dubai': { lat: 25.2048, lon: 55.2708, name: 'Dubai' },
    'Singapore': { lat: 1.3521, lon: 103.8198, name: 'Singapore' },
    'Bangalore': { lat: 12.9716, lon: 77.5946, name: 'Bangalore' }
};


// Chart instances
let temperatureChart = null;
let airQualityChart = null;
let forecastChart = null;
let pmComparisonChart = null;

// Theme management
function initTheme() {
    // Get saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    updateChartThemes(newTheme);
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

function getChartColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
        textColor: isDark ? '#e0e0e0' : '#333',
        gridColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        primaryColor: isDark ? 'rgb(124, 138, 255)' : 'rgb(102, 126, 234)',
        primaryBg: isDark ? 'rgba(124, 138, 255, 0.1)' : 'rgba(102, 126, 234, 0.1)',
        secondaryColor: isDark ? 'rgb(154, 165, 255)' : 'rgb(118, 75, 162)',
        secondaryBg: isDark ? 'rgba(154, 165, 255, 0.1)' : 'rgba(118, 75, 162, 0.1)'
    };
}

function updateChartThemes(theme) {
    const colors = getChartColors();
    
    // Update all existing charts
    const charts = [temperatureChart, airQualityChart, forecastChart, pmComparisonChart];
    charts.forEach(chart => {
        if (chart) {
            if (chart.options.scales) {
                if (chart.options.scales.x) {
                    chart.options.scales.x.ticks.color = colors.textColor;
                    chart.options.scales.x.grid.color = colors.gridColor;
                }
                if (chart.options.scales.y) {
                    chart.options.scales.y.ticks.color = colors.textColor;
                    chart.options.scales.y.grid.color = colors.gridColor;
                    if (chart.options.scales.y.title) {
                        chart.options.scales.y.title.color = colors.textColor;
                    }
                }
            }
            if (chart.options.plugins && chart.options.plugins.legend) {
                chart.options.plugins.legend.labels.color = colors.textColor;
            }
            chart.update();
        }
    });
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initializeEventListeners();
    loadCityData('London'); // Default city
});

function initializeEventListeners() {
    document.getElementById('citySelect').addEventListener('change', (e) => {
        loadCityData(e.target.value);
    });
    
    document.getElementById('refreshBtn').addEventListener('click', () => {
        const selectedCity = document.getElementById('citySelect').value;
        loadCityData(selectedCity);
    });
    
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
}

function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

async function loadCityData(cityName) {
    showLoading();
    const city = cityCoordinates[cityName];
    
    if (!city) {
        console.error('City not found');
        hideLoading();
        return;
    }
    
    try {
        // Fetch weather and air quality data in parallel
        const [weatherData, airQualityData] = await Promise.all([
            fetchWeatherData(city),
            fetchAirQualityData(city)
        ]);
        
        updateWeatherDisplay(weatherData);
        updateAirQualityDisplay(airQualityData);
        updateCharts(weatherData, airQualityData);
        generateInsights(weatherData, airQualityData);
        
        updateLastUpdateTime();
    } catch (error) {
        console.error('Error loading city data:', error);
        const errorMessage = error.message.includes('Invalid API key') 
            ? 'API Key Error: Your OpenWeatherMap API key appears to be invalid or not activated. The dashboard will use mock data. Please verify your API key at https://openweathermap.org/api'
            : 'Failed to load city data. Using mock data for demonstration.';
        console.warn(errorMessage);
        // Don't show alert, just use mock data silently
    } finally {
        hideLoading();
    }
}

// Fetch weather data using OpenWeatherMap Free Tier APIs
async function fetchWeatherData(city) {
    // If API key is not set, use mock data for demonstration
    if (WEATHER_API_KEY === 'YOUR_OPENWEATHER_API_KEY') {
        return getMockWeatherData(city);
    }
    
    // Use free tier APIs only (2.5/weather and 2.5/forecast)
    try {
        // Fetch current weather
        const currentResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${WEATHER_API_KEY}&units=metric`
        );
        
        if (!currentResponse.ok) {
            if (currentResponse.status === 401) {
                throw new Error('Invalid API key. Please check your OpenWeatherMap API key and confirm via email if needed.');
            }
            throw new Error(`Weather API error: ${currentResponse.status}`);
        }
        
        const currentData = await currentResponse.json();
        
        // Fetch 5-day forecast (free tier provides 3-hour intervals for 5 days)
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=${WEATHER_API_KEY}&units=metric`
        );
        
        const forecastData = forecastResponse.ok ? await forecastResponse.json() : null;
        
        // Generate hourly data from forecast (3-hour intervals, take first 24 hours = 8 data points)
        const hourlyData = [];
        if (forecastData && forecastData.list) {
            forecastData.list.slice(0, 8).forEach(item => {
                const date = new Date(item.dt * 1000);
                hourlyData.push({
                    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    temp: item.main.temp
                });
            });
        }
        
        return {
            current: currentData,
            hourly: hourlyData,
            forecast: forecastData
        };
    } catch (error) {
        console.warn('Using mock weather data due to API error:', error);
        return getMockWeatherData(city);
    }
}

// Fetch air quality data
async function fetchAirQualityData(city) {
    // Try OpenWeatherMap Air Pollution API first (free tier)
    if (WEATHER_API_KEY !== 'YOUR_OPENWEATHER_API_KEY') {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/air_pollution?lat=${city.lat}&lon=${city.lon}&appid=${WEATHER_API_KEY}`
            );
            
            if (response.ok) {
                const data = await response.json();
                return data;
            }
        } catch (error) {
            console.log('OpenWeatherMap air quality API failed, trying IQAir...');
        }
    }
    
    // Fallback to IQAir API if available
    if (AIR_QUALITY_API_KEY !== 'YOUR_AIRVISUAL_API_KEY') {
        try {
            // IQAir API endpoint - using nearest city data
            const response = await fetch(
                `https://api.airvisual.com/v2/nearest_city?lat=${city.lat}&lon=${city.lon}&key=${AIR_QUALITY_API_KEY}`
            );
            
            if (response.ok) {
                const data = await response.json();
                // Transform IQAir response to match OpenWeatherMap format
                if (data.data && data.data.current && data.data.current.pollution) {
                    const pollution = data.data.current.pollution;
                    const aqi = pollution.aqius; // IQAir uses US AQI (0-500)
                    // Convert US AQI to 1-5 scale
                    let aqiScale = 1;
                    if (aqi <= 50) aqiScale = 1;
                    else if (aqi <= 100) aqiScale = 2;
                    else if (aqi <= 150) aqiScale = 3;
                    else if (aqi <= 200) aqiScale = 4;
                    else aqiScale = 5;
                    
                    return {
                        list: [{
                            main: { aqi: aqiScale },
                            components: {
                                pm2_5: pollution.ts ? pollution.ts : (pollution.aqius / 2).toFixed(1),
                                pm10: pollution.ts ? (pollution.ts * 1.5).toFixed(1) : (pollution.aqius / 1.5).toFixed(1),
                                o3: '0',
                                no2: '0'
                            }
                        }]
                    };
                }
            }
        } catch (error) {
            console.log('IQAir API failed, using mock data...');
        }
    }
    
    // Final fallback to mock data
    return getMockAirQualityData(city);
}

// Mock data for demonstration (when API keys are not configured)
function getMockWeatherData(city) {
    const baseTemp = Math.floor(Math.random() * 15) + 15; // 15-30°C
    const hours = Array.from({ length: 24 }, (_, i) => {
        const hour = new Date();
        hour.setHours(i, 0, 0, 0);
        return {
            time: hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            temp: baseTemp + Math.floor(Math.random() * 8) - 4
        };
    });
    
    const forecastDays = Array.from({ length: 5 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return {
            date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            temp: baseTemp + Math.floor(Math.random() * 10) - 5,
            condition: ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy'][Math.floor(Math.random() * 4)]
        };
    });
    
    return {
        current: {
            main: {
                temp: baseTemp,
                humidity: Math.floor(Math.random() * 40) + 40,
                pressure: Math.floor(Math.random() * 50) + 1000
            },
            weather: [{
                description: ['Clear', 'Cloudy', 'Partly Cloudy', 'Rainy'][Math.floor(Math.random() * 4)]
            }],
            wind: {
                speed: (Math.random() * 15 + 5).toFixed(1)
            },
            visibility: (Math.random() * 5 + 5).toFixed(1)
        },
        hourly: hours,
        forecast: {
            list: forecastDays.map(day => ({
                dt_txt: day.date,
                main: { temp: day.temp },
                weather: [{ description: day.condition }]
            }))
        }
    };
}

function getMockAirQualityData(city) {
    const aqi = Math.floor(Math.random() * 100) + 50; // 50-150
    return {
        list: [{
            main: {
                aqi: Math.min(5, Math.floor(aqi / 50) + 1) // Scale to 1-5
            },
            components: {
                pm2_5: (Math.random() * 50 + 20).toFixed(1),
                pm10: (Math.random() * 80 + 30).toFixed(1),
                o3: (Math.random() * 100 + 50).toFixed(1),
                no2: (Math.random() * 60 + 20).toFixed(1)
            }
        }]
    };
}

function updateWeatherDisplay(data) {
    const current = data.current;
    
    document.getElementById('temperature').textContent = `${Math.round(current.main.temp)}°C`;
    document.getElementById('weatherDesc').textContent = current.weather[0].description;
    document.getElementById('humidity').textContent = `${current.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${current.wind.speed} km/h`;
    document.getElementById('pressure').textContent = `${current.main.pressure} hPa`;
    // Visibility is already in km (converted in API response) or needs conversion
    const visibility = typeof current.visibility === 'string' ? current.visibility : (current.visibility / 1000).toFixed(1);
    document.getElementById('visibility').textContent = `${visibility} km`;
}

function updateAirQualityDisplay(data) {
    const aqiData = data.list[0];
    const aqi = aqiData.main.aqi;
    const components = aqiData.components;
    
    // AQI scale: 1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor
    const aqiLabels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
    const aqiClasses = ['aqi-good', 'aqi-moderate', 'aqi-unhealthy-sensitive', 'aqi-unhealthy', 'aqi-hazardous'];
    
    const aqiDisplay = document.querySelector('.aqi-display');
    aqiDisplay.className = `aqi-display ${aqiClasses[aqi - 1] || 'aqi-moderate'}`;
    
    document.getElementById('aqiValue').textContent = aqi;
    document.getElementById('aqiStatus').textContent = aqiLabels[aqi - 1] || 'Moderate';
    
    document.getElementById('pm25').textContent = `${components.pm2_5} µg/m³`;
    document.getElementById('pm10').textContent = `${components.pm10} µg/m³`;
    document.getElementById('o3').textContent = `${components.o3} µg/m³`;
    document.getElementById('no2').textContent = `${components.no2} µg/m³`;
}

function updateCharts(weatherData, airQualityData) {
    updateTemperatureChart(weatherData);
    updateAirQualityChart(airQualityData);
    updateForecastChart(weatherData);
    updatePMComparisonChart(airQualityData);
}

// Fetch air quality data
async function fetchAirQualityData(city) {
    // Try OpenWeatherMap Air Pollution API first (free tier)
    if (WEATHER_API_KEY !== 'YOUR_OPENWEATHER_API_KEY') {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/air_pollution?lat=${city.lat}&lon=${city.lon}&appid=${WEATHER_API_KEY}`
            );
            
            if (response.ok) {
                const data = await response.json();
                return data;
            }
        } catch (error) {
            console.log('OpenWeatherMap air quality API failed, trying IQAir...');
        }
    }
    
    // Fallback to IQAir API if available
    if (AIR_QUALITY_API_KEY !== 'YOUR_AIRVISUAL_API_KEY') {
        try {
            // IQAir API endpoint - using nearest city data
            const response = await fetch(
                `https://api.airvisual.com/v2/nearest_city?lat=${city.lat}&lon=${city.lon}&key=${AIR_QUALITY_API_KEY}`
            );
            
            if (response.ok) {
                const data = await response.json();
                // Transform IQAir response to match OpenWeatherMap format
                if (data.data && data.data.current && data.data.current.pollution) {
                    const pollution = data.data.current.pollution;
                    const aqi = pollution.aqius; // IQAir uses US AQI (0-500)
                    // Convert US AQI to 1-5 scale
                    let aqiScale = 1;
                    if (aqi <= 50) aqiScale = 1;
                    else if (aqi <= 100) aqiScale = 2;
                    else if (aqi <= 150) aqiScale = 3;
                    else if (aqi <= 200) aqiScale = 4;
                    else aqiScale = 5;
                    
                    return {
                        list: [{
                            main: { aqi: aqiScale },
                            components: {
                                pm2_5: pollution.ts ? pollution.ts : (pollution.aqius / 2).toFixed(1),
                                pm10: pollution.ts ? (pollution.ts * 1.5).toFixed(1) : (pollution.aqius / 1.5).toFixed(1),
                                o3: '0',
                                no2: '0'
                            }
                        }]
                    };
                }
            }
        } catch (error) {
            console.log('IQAir API failed, using mock data...');
        }
    }
    
    // Final fallback to mock data
    return getMockAirQualityData(city);
}



function updateTemperatureChart(weatherData) {
    const ctx = document.getElementById('temperatureChart').getContext('2d');
    
    // Use hourly data if available, otherwise generate sample data
    const hourlyData = weatherData.hourly || Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        temp: weatherData.current.main.temp + Math.sin(i / 24 * Math.PI * 2) * 5
    }));
    
    if (temperatureChart) {
        temperatureChart.destroy();
    }
    
    const colors = getChartColors();
    
    temperatureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: hourlyData.map(h => h.time),
            datasets: [{
                label: 'Temperature (°C)',
                data: hourlyData.map(h => Math.round(h.temp)),
                borderColor: colors.primaryColor,
                backgroundColor: colors.primaryBg,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: colors.textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: colors.textColor },
                    grid: { color: colors.gridColor }
                },
                y: {
                    beginAtZero: false,
                    ticks: { color: colors.textColor },
                    grid: { color: colors.gridColor },
                    title: {
                        display: true,
                        text: 'Temperature (°C)',
                        color: colors.textColor
                    }
                }
            }
        }
    });
}

function updateAirQualityChart(airQualityData) {
    const ctx = document.getElementById('airQualityChart').getContext('2d');
    const components = airQualityData.list[0].components;
    
    if (airQualityChart) {
        airQualityChart.destroy();
    }
    
    const colors = getChartColors();
    
    airQualityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['PM2.5', 'PM10', 'O₃', 'NO₂'],
            datasets: [{
                label: 'Pollutant Levels (µg/m³)',
                data: [
                    parseFloat(components.pm2_5),
                    parseFloat(components.pm10),
                    parseFloat(components.o3),
                    parseFloat(components.no2)
                ],
                backgroundColor: [
                    colors.primaryColor.replace('rgb(', 'rgba(').replace(')', ', 0.8)'),
                    colors.secondaryColor.replace('rgb(', 'rgba(').replace(')', ', 0.8)'),
                    'rgba(255, 159, 64, 0.8)',
                    'rgba(255, 99, 132, 0.8)'
                ],
                borderColor: [
                    colors.primaryColor,
                    colors.secondaryColor,
                    'rgb(255, 159, 64)',
                    'rgb(255, 99, 132)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    ticks: { color: colors.textColor },
                    grid: { color: colors.gridColor }
                },
                y: {
                    beginAtZero: true,
                    ticks: { color: colors.textColor },
                    grid: { color: colors.gridColor },
                    title: {
                        display: true,
                        text: 'Concentration (µg/m³)',
                        color: colors.textColor
                    }
                }
            }
        }
    });
}

function updateForecastChart(weatherData) {
    const ctx = document.getElementById('forecastChart').getContext('2d');
    
    // Use forecast data if available, otherwise generate sample
    let forecastData = [];
    if (weatherData.forecast && weatherData.forecast.list) {
        // Group by day and get average temperature
        const dailyData = {};
        weatherData.forecast.list.forEach(item => {
            const date = new Date(item.dt_txt || item.dt * 1000);
            const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' });
            if (!dailyData[dayKey]) {
                dailyData[dayKey] = [];
            }
            dailyData[dayKey].push(item.main.temp);
        });
        
        forecastData = Object.keys(dailyData).slice(0, 5).map(day => ({
            day: day,
            temp: Math.round(dailyData[day].reduce((a, b) => a + b, 0) / dailyData[day].length)
        }));
    } else {
        // Generate sample forecast
        const baseTemp = weatherData.current.main.temp;
        forecastData = Array.from({ length: 5 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            return {
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                temp: Math.round(baseTemp + (Math.random() * 8 - 4))
            };
        });
    }
    
    if (forecastChart) {
        forecastChart.destroy();
    }
    
    const colors = getChartColors();
    
    forecastChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: forecastData.map(f => f.day),
            datasets: [{
                label: 'Temperature (°C)',
                data: forecastData.map(f => f.temp),
                borderColor: colors.secondaryColor,
                backgroundColor: colors.secondaryBg,
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: colors.textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: colors.textColor },
                    grid: { color: colors.gridColor }
                },
                y: {
                    beginAtZero: false,
                    ticks: { color: colors.textColor },
                    grid: { color: colors.gridColor },
                    title: {
                        display: true,
                        text: 'Temperature (°C)',
                        color: colors.textColor
                    }
                }
            }
        }
    });
}

function updatePMComparisonChart(airQualityData) {
    const ctx = document.getElementById('pmComparisonChart').getContext('2d');
    const components = airQualityData.list[0].components;
    const pm25 = parseFloat(components.pm2_5);
    const pm10 = parseFloat(components.pm10);
    
    if (pmComparisonChart) {
        pmComparisonChart.destroy();
    }
    
    const colors = getChartColors();
    
    pmComparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['PM2.5', 'PM10'],
            datasets: [{
                label: 'Particulate Matter (µg/m³)',
                data: [pm25, pm10],
                backgroundColor: [
                    colors.primaryColor.replace('rgb(', 'rgba(').replace(')', ', 0.8)'),
                    colors.secondaryColor.replace('rgb(', 'rgba(').replace(')', ', 0.8)')
                ],
                borderColor: [
                    colors.primaryColor,
                    colors.secondaryColor
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: colors.textColor
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            const label = context.dataset.label || '';
                            const threshold = context.label === 'PM2.5' ? 35 : 50;
                            const status = value > threshold ? ' (Unhealthy)' : ' (Safe)';
                            return label + ': ' + value.toFixed(1) + ' µg/m³' + status;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: colors.textColor },
                    grid: { color: colors.gridColor }
                },
                y: {
                    beginAtZero: true,
                    ticks: { color: colors.textColor },
                    grid: { color: colors.gridColor },
                    title: {
                        display: true,
                        text: 'Concentration (µg/m³)',
                        color: colors.textColor
                    }
                }
            }
        }
    });
}

function generateInsights(weatherData, airQualityData) {
    const insights = [];
    const current = weatherData.current;
    const aqi = airQualityData.list[0].main.aqi;
    const components = airQualityData.list[0].components;
    
    // AQI-based insights with specific messages
    const aqiLabels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
    const aqiStatus = aqiLabels[aqi - 1] || 'Moderate';
    
    if (aqi === 1) {
        insights.push(`✅ AQI is ${aqiStatus} — Air quality is excellent. Safe for all outdoor activities.`);
    } else if (aqi === 2) {
        insights.push(`✅ AQI is ${aqiStatus} — Air quality is acceptable. Most people can enjoy outdoor activities.`);
    } else if (aqi === 3) {
        insights.push(`⚠️ AQI is ${aqiStatus} — Sensitive groups should avoid outdoor activities. Children, elderly, and those with respiratory conditions should limit exposure.`);
    } else if (aqi === 4) {
        insights.push(`🚨 AQI is ${aqiStatus} — Everyone should avoid outdoor activities. Sensitive groups should stay indoors.`);
    } else if (aqi === 5) {
        insights.push(`🚨 AQI is ${aqiStatus} — Health alert: Everyone should avoid all outdoor activities. Stay indoors with windows closed.`);
    }
    
    // Temperature trend prediction
    const hourlyData = weatherData.hourly || [];
    if (hourlyData.length >= 6) {
        const currentTemp = current.main.temp;
        const futureTemps = hourlyData.slice(0, 6).map(h => h.temp);
        const avgFutureTemp = futureTemps.reduce((a, b) => a + b, 0) / futureTemps.length;
        const tempChange = avgFutureTemp - currentTemp;
        
        if (tempChange > 2) {
            insights.push(`📈 Temperature rising trend predicted for next 6 hours. Expected increase of ${tempChange.toFixed(1)}°C.`);
        } else if (tempChange < -2) {
            insights.push(`📉 Temperature dropping trend predicted for next 6 hours. Expected decrease of ${Math.abs(tempChange).toFixed(1)}°C.`);
        } else {
            insights.push(`🌡️ Temperature expected to remain stable over the next 6 hours.`);
        }
    }
    
    // Weather insights
    if (current.main.temp > 25) {
        insights.push(`🌡️ High temperature detected (${Math.round(current.main.temp)}°C). Consider staying hydrated and avoiding prolonged sun exposure.`);
    } else if (current.main.temp < 10) {
        insights.push(`🧥 Low temperature (${Math.round(current.main.temp)}°C). Dress warmly and be cautious of cold-related health issues.`);
    }
    
    const windSpeed = parseFloat(current.wind.speed) || 0;
    if (windSpeed > 15) {
        insights.push(`💨 Strong winds detected (${windSpeed} km/h). Secure outdoor items and be cautious when driving.`);
    }
    
    const visibility = typeof current.visibility === 'string' ? parseFloat(current.visibility) : (current.visibility / 1000);
    if (visibility < 5) {
        insights.push(`🌫️ Reduced visibility (${visibility.toFixed(1)} km). Exercise caution when traveling.`);
    }
    
    // Detailed air quality insights
    const pm25 = parseFloat(components.pm2_5);
    const pm10 = parseFloat(components.pm10);
    
    if (pm25 > 35) {
        insights.push(`🚨 PM2.5 levels are elevated (${pm25.toFixed(1)} µg/m³). Consider wearing a mask if spending extended time outdoors.`);
    } else if (pm25 < 12) {
        insights.push(`✅ PM2.5 levels are low (${pm25.toFixed(1)} µg/m³). Air quality is healthy.`);
    }
    
    if (pm10 > 50) {
        insights.push(`⚠️ PM10 levels are high (${pm10.toFixed(1)} µg/m³). May cause respiratory irritation.`);
    }
    
    // PM2.5 vs PM10 comparison insight
    if (pm10 > pm25 * 1.5) {
        insights.push(`📊 PM10 significantly higher than PM2.5 — indicates larger particle pollution, possibly from dust or construction.`);
    }
    
    if (parseFloat(components.no2) > 50) {
        insights.push(`🚗 High NO₂ levels detected (${parseFloat(components.no2).toFixed(1)} µg/m³), likely from traffic. Consider using public transportation.`);
    }
    
    if (parseFloat(components.o3) > 100) {
        insights.push(`☀️ High O₃ (ozone) levels detected. Avoid outdoor exercise during peak hours.`);
    }
    
    // General insights
    if (aqi <= 2 && current.main.temp > 15 && current.main.temp < 25 && windSpeed < 10) {
        insights.push(`✨ Excellent conditions for outdoor activities! Perfect weather and air quality.`);
    }
    
    // Update insights display
    const insightsList = document.getElementById('insightsList');
    if (insights.length === 0) {
        insights.push('No significant alerts at this time. Conditions are normal.');
    }
    
    insightsList.innerHTML = insights.map(insight => 
        `<div class="insight-item">${insight}</div>`
    ).join('');
}

function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('lastUpdate').textContent = `Last updated: ${timeString}`;
}

// Auto-refresh every 5 minutes
setInterval(() => {
    const selectedCity = document.getElementById('citySelect').value;
    loadCityData(selectedCity);
}, 5 * 60 * 1000);

