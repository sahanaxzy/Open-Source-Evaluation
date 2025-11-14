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
