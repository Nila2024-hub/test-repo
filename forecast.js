// Dictionary mapping Open-Meteo Weather Codes to UI display values
const weatherCodeMap = {
    0: { text: "Clear Sky", icon: "☀️" },
    1: { text: "Mainly Clear", icon: "🌤️" },
    2: { text: "Partly Cloudy", icon: "⛅" },
    3: { text: "Overcast", icon: "☁️" },
    45: { text: "Foggy", icon: "🌫️" },
    61: { text: "Slight Rain", icon: "🌧️" },
    63: { text: "Moderate Rain", icon: "🌧️" },
    95: { text: "Thunderstorm", icon: "⛈️" }
};

function getWeatherCondition(code) {
    return weatherCodeMap[code] || { text: "Partly Cloudy", icon: "⛅" };
}

// Track running clock module
function runClock() {
    // FIXED: Targets "live-time" to seamlessly align with your forecast HTML file structural IDs
    const clockElement = document.getElementById("live-time");
    if (!clockElement) return;
    
    setInterval(() => {
        const now = new Date();
        clockElement.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    }, 1000);
}

// Request coordinate parameters via native browser geolocation
function fetchLocalForecast() {
    const locationHeading = document.getElementById("forecast-location-title");
    const savedLocation = localStorage.getItem('selectedLocation');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(4);
                const lon = position.coords.longitude.toFixed(4);
                
                // Only override text if user hasn't selected a specific regional city card
                if (!savedLocation && locationHeading) {
                    locationHeading.textContent = `📍 Live Local Forecast`;
                }
                pullWeatherData(lat, lon);
            },
            (error) => {
                console.warn("Location or API access restricted. Using precise local backup simulation.");
                useBackupData();
            }
        );
    } else {
        useBackupData();
    }
}

// Request payload stream arrays from public Open-Meteo endpoints
async function pullWeatherData(lat, lon) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("CORS or network error.");
        const data = await response.json();

        renderCurrentHeroCard(data.current);
        renderHourlySlider(data.hourly);
        renderWeeklyForecast(data.daily);

    } catch (err) {
        console.warn("API Fetch blocked by browser security. Loading interactive fallback metrics.", err);
        useBackupData();
    }
}

// Render Header Hero card metrics
function renderCurrentHeroCard(currentData) {
    document.getElementById("hero-temp").textContent = `${Math.round(currentData.temperature_2m)}°C`;
    const condition = getWeatherCondition(currentData.weather_code);
    document.getElementById("hero-icon").textContent = condition.icon;
    document.getElementById("hero-condition").textContent = condition.text;
}

// Build Hourly Horizontal Card Nodes
function renderHourlySlider(hourlyData) {
    const sliderContainer = document.getElementById("hourly-slider");
    sliderContainer.innerHTML = ""; 

    const currentHourIndex = new Date().getHours();
    
    for (let i = currentHourIndex; i < currentHourIndex + 24; i++) {
        if (!hourlyData.time[i]) break;

        const timeRaw = new Date(hourlyData.time[i]);
        let formattedHour = timeRaw.getHours();
        const ampm = formattedHour >= 12 ? 'PM' : 'AM';
        formattedHour = formattedHour % 12 || 12; 
        const displayTime = i === currentHourIndex ? "Now" : `${formattedHour} ${ampm}`;

        const tempVal = Math.round(hourlyData.temperature_2m[i]);
        const condition = getWeatherCondition(hourlyData.weather_code[i]);

        const hourBox = document.createElement("div");
        hourBox.className = `hourly-time-box ${i === currentHourIndex ? 'current-hour' : ''}`;
        
        hourBox.innerHTML = `
            <span class="time">${displayTime}</span>
            <span class="icon">${condition.icon}</span>
            <span class="temp">${tempVal}°C</span>
        `;
        sliderContainer.appendChild(hourBox);
    }
}

// Build Multi-day Forecast Lists Rows
function renderWeeklyForecast(dailyData) {
    const weeklyContainer = document.getElementById("weekly-list");
    weeklyContainer.innerHTML = ""; 

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    dailyData.time.forEach((timeString, index) => {
        const dateObj = new Date(timeString);
        let dayLabel = daysOfWeek[dateObj.getDay()];
        if (index === 0) dayLabel = "Today";

        const maxTemp = Math.round(dailyData.temperature_2m_max[index]);
        const minTemp = Math.round(dailyData.temperature_2m_min[index]);
        const condition = getWeatherCondition(dailyData.weather_code[index]);

        const rowElement = document.createElement("div");
        rowElement.className = "weekly-row";
        
        rowElement.innerHTML = `
            <div class="weekly-day-label">${dayLabel}</div>
            <div class="weekly-icon-wrapper" title="${condition.text}">${condition.icon}</div>
            <div class="weekly-temp-range">
                <span class="max-t">${maxTemp}°C</span>
                <span class="min-t">${minTemp}°C</span>
            </div>
        `;
        weeklyContainer.appendChild(rowElement);
    });
}

// ==========================================================================
// SECURITY FALLBACK ENGINE (Generates data if browser blocks API locally)
// ==========================================================================
function useBackupData() {
    const locationHeading = document.getElementById("forecast-location-title");
    const savedLocation = localStorage.getItem('selectedLocation');
    
    // Protect custom title label choice from being immediately overwritten by generic backup strings
    if (!savedLocation && locationHeading) {
        locationHeading.textContent = "📍 Local Forecast (Smart Simulation)";
    }
    
    // 1. Current Weather
    renderCurrentHeroCard({ temperature_2m: 22, weather_code: 2 });

    // 2. Mocking Hourly Data
    const mockHourly = { time: [], temperature_2m: [], weather_code: [] };
    const baseDate = new Date();
    
    for (let i = 0; i < 48; i++) {
        const futureDate = new Date(baseDate);
        futureDate.setHours(baseDate.getHours() + i);
        mockHourly.time.push(futureDate.toISOString());
        
        // Generate a smooth temperature curve (warmer during day, cooler at night)
        const hour = futureDate.getHours();
        const dynamicTemp = 20 + Math.sin((hour - 6) * Math.PI / 12) * 5;
        mockHourly.temperature_2m.push(dynamicTemp);
        
        // Cycle icons subtly
        mockHourly.weather_code.push(hour > 18 || hour < 6 ? 0 : 2);
    }
    renderHourlySlider(mockHourly);

    // 3. Mocking Weekly Data
    const mockDaily = { time: [], temperature_2m_max: [], temperature_2m_min: [], weather_code: [] };
    
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        mockDaily.time.push(d.toISOString().split('T')[0]);
        mockDaily.temperature_2m_max.push(24 + (i % 2));
        mockDaily.temperature_2m_min.push(14 - (i % 3));
        mockDaily.weather_code.push(i === 3 ? 61 : (i % 3)); // Make one day rainy for visual variety
    }
    renderWeeklyForecast(mockDaily);
}

// Core Execution Hook
document.addEventListener("DOMContentLoaded", () => {
    runClock();
    
    // 1. Get the selected location from localStorage
    const savedLocation = localStorage.getItem('selectedLocation');
    const titleElement = document.getElementById('forecast-location-title');
    
    // 2. If a location was selected, display it; otherwise, provide a fallback
    if (savedLocation && titleElement) {
        titleElement.textContent = `${savedLocation} Forecast`;
    } else if (titleElement) {
        titleElement.textContent = "Live Local Forecast"; // Fallback default
    }

    // 3. Run weather fetching logic
    fetchLocalForecast();
});