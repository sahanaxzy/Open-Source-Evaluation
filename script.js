<<<<<<< HEAD
const AIR_QUALITY_API_KEY = '91c1e041-ee9c-4331-9c30-9f91b2ddafea'; // Get from https://www.iqair.com/air-pollution-data-api


=======
// API Keys - In production, these should be stored securely
// For demo purposes, using free tier APIs that may require registration
const WEATHER_API_KEY = '9e03c5bcecceb88a641172a81d7d6929'; // Get from https://openweathermap.org/api
>>>>>>> 36a3600857700c9e81f59f2e7a8a8e5bcb2defb0
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

