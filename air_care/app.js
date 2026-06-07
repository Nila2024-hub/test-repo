let apiToken = "";

// ═══════════════════════════════════════════════════════════
// ON PAGE LOAD
// ═══════════════════════════════════════════════════════════
window.onload = function () {

    // 1. Hide splash screen after 2.5 seconds
    setTimeout(function () {
        const splash = document.getElementById("splash-screen");
        if (splash) {
            splash.style.opacity = "0";
            splash.style.visibility = "hidden";
        }
    }, 2500);

    // 2. Start live clock immediately
    updateLiveClock();

    // 3. Check for a saved API token in browser storage
    const savedToken = localStorage.getItem("waqi_api_token");
    if (savedToken && savedToken !== "") {
        apiToken = savedToken;

        const tokenBox   = document.getElementById("token-box");
        const dashContent = document.getElementById("dashboard-content");

        if (tokenBox)    tokenBox.style.display    = "none";
        if (dashContent) dashContent.style.display = "flex";

        // Load the last searched city, or fall back to New York
        const lastLocation = localStorage.getItem("selectedLocation") || "New York";
        handleCitySelect(lastLocation);

    } else {
        const tokenBox   = document.getElementById("token-box");
        const dashContent = document.getElementById("dashboard-content");
        if (tokenBox)    tokenBox.style.display    = "block";
        if (dashContent) dashContent.style.display = "none";
    }
};

// ═══════════════════════════════════════════════════════════
// LIVE CLOCK — updates every second on ALL pages
// ═══════════════════════════════════════════════════════════
function updateLiveClock() {
    const timeElement = document.getElementById("live-time");
    const dateElement = document.getElementById("live-date");

    // Guard: only run if clock elements exist on this page
    if (!timeElement || !dateElement) return;

    const now = new Date();

    // Format: 03:49:48 PM
    const timeString = now.toLocaleTimeString("en-US", {
        hour:   "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });

    // Format: Saturday, June 7, 2026
    const dateString = now.toLocaleDateString("en-US", {
        weekday: "long",
        month:   "long",
        day:     "numeric",
        year:    "numeric"
    });

    // Only update DOM if value actually changed (prevents visual blink)
    if (timeElement.textContent !== timeString) timeElement.textContent = timeString;
    if (dateElement.textContent !== dateString) dateElement.textContent = dateString;
}

// Clear any leftover interval if script reloads, then start fresh
if (window.clockIntervalID) clearInterval(window.clockIntervalID);
window.clockIntervalID = setInterval(updateLiveClock, 1000);


// ═══════════════════════════════════════════════════════════
// SAVE API TOKEN
// ═══════════════════════════════════════════════════════════
function handleSaveToken() {
    const tokenInputEl = document.getElementById("token-input");
    if (!tokenInputEl) return;

    const enteredToken = tokenInputEl.value.trim();
    if (enteredToken === "") {
        alert("Please enter your WAQI API token.");
        return;
    }

    apiToken = enteredToken;
    localStorage.setItem("waqi_api_token", apiToken);

    const tokenBox   = document.getElementById("token-box");
    const dashContent = document.getElementById("dashboard-content");

    if (tokenBox)    tokenBox.style.display    = "none";
    if (dashContent) dashContent.style.display = "flex";

    handleCitySelect("New York");
}


// ═══════════════════════════════════════════════════════════
// SEARCH BAR — submit on button click or Enter key
// ═══════════════════════════════════════════════════════════
function handleSearchSubmit() {
    const cityInputEl = document.getElementById("city-input");
    if (!cityInputEl) return;

    const cityName = cityInputEl.value.trim();
    if (cityName === "") {
        alert("Please enter a city name.");
        return;
    }

    handleSearchAutofill(""); // close dropdown
    localStorage.setItem("selectedLocation", cityName);
    handleCitySelect(cityName);
}


// ═══════════════════════════════════════════════════════════
// SEARCH AUTOCOMPLETE DROPDOWN
// ═══════════════════════════════════════════════════════════
function handleSearchAutofill(value) {
    const dropdown = document.getElementById("search-suggestions");
    if (!dropdown) return;

    // Hide dropdown if input is too short or no token
    if (!value || value.length < 2 || !apiToken) {
        dropdown.style.display = "none";
        return;
    }

    const url = `https://api.waqi.info/search/?token=${apiToken}&keyword=${encodeURIComponent(value)}`;

    fetch(url)
        .then(res => res.json())
        .then(result => {
            if (result.status === "ok" && result.data.length > 0) {
                dropdown.innerHTML = "";

                result.data.slice(0, 5).forEach(station => {
                    const aqi   = station.aqi || "--";
                    const color = getAqiColor(parseInt(aqi));

                    const item = document.createElement("div");
                    item.className = "suggestion-item";
                    item.innerHTML = `
                        <div>
                            <div class="suggestion-station">${station.station.name}</div>
                            <div class="suggestion-meta">Updated: ${station.time.stime}</div>
                        </div>
                        <span class="suggestion-badge" style="background-color:${color}">${aqi}</span>
                    `;

                    item.onclick = function () {
                        const inputEl = document.getElementById("city-input");
                        if (inputEl) inputEl.value = station.station.name;
                        dropdown.style.display = "none";
                        localStorage.setItem("selectedLocation", station.station.name);
                        handleCitySelect(station.station.name);
                    };

                    dropdown.appendChild(item);
                });

                dropdown.style.display = "block";
            } else {
                dropdown.style.display = "none";
            }
        })
        .catch(() => { dropdown.style.display = "none"; });
}


// ═══════════════════════════════════════════════════════════
// GPS / GEOLOCATION
// ═══════════════════════════════════════════════════════════
function handleGPSLocation() {
    if (!apiToken) {
        alert("Please enter your API token first.");
        return;
    }
    if (!navigator.geolocation) {
        alert("Your browser does not support location access.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        function (position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const url = `https://api.waqi.info/feed/geo:${lat};${lng}/?token=${apiToken}`;

            fetch(url)
                .then(res => res.json())
                .then(result => {
                    if (result.status === "ok") {
                        const dashContent = document.getElementById("dashboard-content");
                        if (dashContent) dashContent.style.display = "flex";
                        localStorage.setItem("selectedLocation", "Current GPS Location");
                        updateDashboardUI(result.data);
                    } else {
                        alert("Could not find a station near your location.");
                    }
                });
        },
        function () {
            alert("Location access denied. Please allow location access in your browser.");
        }
    );
}


// ═══════════════════════════════════════════════════════════
// CITY SELECT — fetches AQI data for a named city
// ═══════════════════════════════════════════════════════════
function handleCitySelect(cityName) {
    if (!apiToken) {
        alert("Please enter your API token first.");
        return;
    }

    // Highlight the matching quick-city button
    document.querySelectorAll(".city-btn").forEach(btn => btn.classList.remove("active-btn"));
    const activeBtn = document.getElementById("btn-" + cityName.replace(/ /g, "-"));
    if (activeBtn) activeBtn.classList.add("active-btn");

    // Clean the city name (remove parentheses / comma suffixes)
    let cleanName = cityName;
    if (cleanName.includes("(")) cleanName = cleanName.split("(")[0];
    if (cleanName.includes(",")) cleanName = cleanName.split(",")[0];
    cleanName = cleanName.trim();

    localStorage.setItem("selectedLocation", cleanName);

    const url = `https://api.waqi.info/feed/${encodeURIComponent(cleanName)}/?token=${apiToken}`;

    fetch(url)
        .then(res => res.json())
        .then(result => {
            if (result.status === "ok") {
                const dashContent = document.getElementById("dashboard-content");
                if (dashContent) dashContent.style.display = "flex";
                updateDashboardUI(result.data);
            } else {
                // Try search fallback if direct city name fails
                handleFallbackSearch(cleanName);
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
            alert("Network error. Please check your internet connection.");
        });
}


// ═══════════════════════════════════════════════════════════
// FALLBACK SEARCH — used when direct city name API fails
// ═══════════════════════════════════════════════════════════
function handleFallbackSearch(queryKeyword) {
    const searchUrl = `https://api.waqi.info/search/?token=${apiToken}&keyword=${encodeURIComponent(queryKeyword)}`;

    fetch(searchUrl)
        .then(res => res.json())
        .then(result => {
            if (result.status === "ok" && result.data.length > 0) {
                const targetUid = result.data[0].uid;
                return fetch(`https://api.waqi.info/feed/@${targetUid}/?token=${apiToken}`);
            } else {
                throw new Error("No station matches found.");
            }
        })
        .then(res => res.json())
        .then(finalResult => {
            if (finalResult.status === "ok") {
                const dashContent = document.getElementById("dashboard-content");
                if (dashContent) dashContent.style.display = "flex";
                updateDashboardUI(finalResult.data);
            } else {
                alert("Location not found. Please try a different city name.");
            }
        })
        .catch(err => {
            console.error("Fallback search error:", err);
            alert("Location not found. Please try a different city name.");
        });
}


// ═══════════════════════════════════════════════════════════
// UPDATE DASHBOARD UI — main function that updates ALL elements
// ═══════════════════════════════════════════════════════════
function updateDashboardUI(data) {
    if (!data) return;

    const aqi       = data.aqi !== undefined ? data.aqi : "--";
    const cityName  = data.city?.name || "Selected Location";
    const parsedAqi = parseInt(aqi);

    // ── Location name & timestamp ──
    const locNameNode = document.getElementById("gauge-location-name");
    const stampNode   = document.getElementById("station-update-timestamp");
    if (locNameNode) locNameNode.innerText = cityName;
    if (stampNode)   stampNode.innerText   = "Last updated: " + (data.time?.s || "--");

    // ── AQI score display ──
    const bannerValNode  = document.getElementById("banner-aqi-val");
    const gaugeScoreNode = document.getElementById("gauge-display-score");
    if (bannerValNode)  bannerValNode.innerText  = String(aqi);
    if (gaugeScoreNode) gaugeScoreNode.innerText = String(aqi);

    // ── Pollutant values ──
    const pm25 = data.iaqi?.pm25?.v;
    const pm10 = data.iaqi?.pm10?.v;
    const no2  = data.iaqi?.no2?.v;
    const o3   = data.iaqi?.o3?.v;
    const co   = data.iaqi?.co?.v;
    const so2  = data.iaqi?.so2?.v;

    const pollutantIds  = ["bar-val-pm25", "bar-val-pm10", "bar-val-no2", "bar-val-o3", "bar-val-co", "bar-val-so2"];
    const pollutantVals = [pm25, pm10, no2, o3, co, so2];

    pollutantIds.forEach((id, idx) => {
        const el = document.getElementById(id);
        if (el) el.innerText = pollutantVals[idx] !== undefined ? pollutantVals[idx] : "--";
    });

    // ── Pollutant bar fills ──
    setBarFill("bar-fill-pm25", pm25, 150);
    setBarFill("bar-fill-pm10", pm10, 250);
    setBarFill("bar-fill-no2",  no2,  200);
    setBarFill("bar-fill-o3",   o3,   200);
    setBarFill("bar-fill-co",   co,   50);
    setBarFill("bar-fill-so2",  so2,  100);

    // ── Weather metrics ──
    const tempVal     = data.iaqi?.t?.v !== undefined ? `${data.iaqi.t.v}°C`    : "--";
    const humidVal    = data.iaqi?.h?.v !== undefined ? `${data.iaqi.h.v}%`     : "--";
    const pressureVal = data.iaqi?.p?.v !== undefined ? `${data.iaqi.p.v} hPa`  : "--";
    const windVal     = data.iaqi?.w?.v !== undefined ? `${data.iaqi.w.v} km/h` : "--";

    const pillTemp  = document.getElementById("pill-temp");
    const pillHumid = document.getElementById("pill-humidity");
    const tableTemp  = document.getElementById("table-temp");
    const tableHumid = document.getElementById("table-humidity");
    const tablePress = document.getElementById("table-pressure");
    const tableWind  = document.getElementById("table-wind");

    if (pillTemp)  pillTemp.innerText  = tempVal;
    if (pillHumid) pillHumid.innerText = humidVal;
    if (tableTemp)  tableTemp.innerText  = tempVal;
    if (tableHumid) tableHumid.innerText = humidVal;
    if (tablePress) tablePress.innerText = pressureVal;
    if (tableWind)  tableWind.innerText  = windVal;

    // ── AQI category: color, label, avatar, recommendation ──
    let colorTheme     = "#ef4444";
    let globalBg       = "#fee2e2";
    let statusLabel    = "Hazardous";
    let recommendation = "Avoid all outdoor activity. Stay indoors and run air filters.";
    let avatarIcon     = "🚨";
    let showUmbrella   = false;

    if (isNaN(parsedAqi)) {
        colorTheme     = "#64748b"; globalBg = "#e2e8f0";
        statusLabel    = "No Data";
        recommendation = "Station data is currently unavailable.";
        avatarIcon     = "🤖";

    } else if (parsedAqi <= 50) {
        colorTheme     = "#10b981"; globalBg = "#e6f4ea";
        statusLabel    = "Good";
        recommendation = "Air is excellent today! Perfect for outdoor walks and exercise. 😊";
        avatarIcon     = "😊";

    } else if (parsedAqi <= 100) {
        colorTheme     = "#d97706"; globalBg = "#fef3c7";
        statusLabel    = "Moderate";
        recommendation = "Air is acceptable. Sensitive groups should take care outdoors. 😀";
        avatarIcon     = "😀";

    } else if (parsedAqi <= 150) {
        colorTheme     = "#f97316"; globalBg = "#ffedd5";
        statusLabel    = "Unhealthy for Sensitive Groups";
        recommendation = "Sensitive individuals should limit prolonged outdoor activity. 😐";
        avatarIcon     = "😐";

    } else if (parsedAqi <= 200) {
        colorTheme     = "#ef4444"; globalBg = "#fee2e2";
        statusLabel    = "Unhealthy";
        recommendation = "Everyone should reduce outdoor activity. Wear a mask outside. 😷";
        avatarIcon     = "😷";
        showUmbrella   = true;   // ← umbrella + rain appear at AQI > 150

    } else if (parsedAqi <= 300) {
        colorTheme     = "#9333ea"; globalBg = "#f3e8ff";
        statusLabel    = "Very Unhealthy";
        recommendation = "Health alert! Avoid all outdoor activity. Use indoor air purifiers.";
        avatarIcon     = "😷";
        showUmbrella   = true;

    } else {
        // Hazardous (AQI > 300) — already set as defaults above
        showUmbrella = true;
    }

    // ── Apply to DOM ──
    const avatarNode      = document.getElementById("character-avatar");
    const descNode        = document.getElementById("status-desc");
    const bannerStatusNode = document.getElementById("banner-status-text");
    const labelNode       = document.getElementById("gauge-display-label");
    const bannerBox       = document.getElementById("aqi-banner-box");
    const gaugeBox        = document.getElementById("gauge-card-box");
    const umbrellaEl      = document.getElementById("umbrella-element");
    const weatherBgEl     = document.getElementById("weather-bg-effects");

    if (avatarNode)       avatarNode.innerText        = avatarIcon;
    if (descNode)         descNode.innerText           = recommendation;
    if (bannerStatusNode) bannerStatusNode.innerText   = statusLabel;
    if (labelNode)        labelNode.innerText          = statusLabel;
    if (bannerBox)        bannerBox.style.backgroundColor = colorTheme;
    if (gaugeBox) {
        gaugeBox.style.backgroundColor = colorTheme;
        gaugeBox.style.color           = "white";
    }

    document.body.style.backgroundColor = globalBg;

    // ── Umbrella show/hide ──
    if (umbrellaEl) umbrellaEl.style.display = showUmbrella ? "block" : "none";

    // ── Rain drops inside buddy card ──
    // IMPORTANT: class must be "rain-drop" to match .rain-drop CSS rule in style.css
    if (weatherBgEl) {
        if (showUmbrella) {
            // Only create drops once; they persist while umbrella is shown
            if (weatherBgEl.children.length === 0) {
                for (let i = 0; i < 20; i++) {
                    const drop = document.createElement("div");
                    drop.className          = "rain-drop";                          // ← correct class name
                    drop.style.left         = Math.random() * 100 + "%";
                    drop.style.animationDelay    = (Math.random() * 2).toFixed(2) + "s";
                    drop.style.animationDuration = (1.2 + Math.random() * 0.8).toFixed(2) + "s"; // varied speed
                    weatherBgEl.appendChild(drop);
                }
            }
        } else {
            // Clear rain drops when air quality is good
            weatherBgEl.innerHTML = "";
        }
    }

    // ── SVG Gauge Arc ──
    const gaugeArc = document.getElementById("gauge-arc-fill");
    if (gaugeArc && !isNaN(parsedAqi)) {
        const capped = Math.min(Math.max(parsedAqi, 0), 300);
        const offset = 125.6 - (capped / 300) * 125.6;
        gaugeArc.style.strokeDashoffset = offset;
        gaugeArc.style.stroke           = colorTheme;
    }
}


// ═══════════════════════════════════════════════════════════
// HELPER — Set pollutant bar fill width and color
// ═══════════════════════════════════════════════════════════
function setBarFill(barId, value, maxVal) {
    const bar = document.getElementById(barId);
    if (!bar) return;

    if (value === undefined || value === null) {
        bar.style.width           = "0%";
        bar.style.backgroundColor = "#94a3b8";
        return;
    }

    const percent = Math.min((value / maxVal) * 100, 100);
    bar.style.width = percent + "%";

    if (percent < 30)      bar.style.backgroundColor = "#10b981"; // green
    else if (percent < 60) bar.style.backgroundColor = "#d97706"; // yellow
    else                   bar.style.backgroundColor = "#ef4444"; // red
}


// ═══════════════════════════════════════════════════════════
// HELPER — Return hex color for a given AQI number
// ═══════════════════════════════════════════════════════════
function getAqiColor(aqi) {
    if (isNaN(aqi))  return "#64748b";
    if (aqi <= 50)   return "#10b981";
    if (aqi <= 100)  return "#d97706";
    if (aqi <= 150)  return "#f97316";
    if (aqi <= 200)  return "#ef4444";
    return "#9333ea";
}


// ═══════════════════════════════════════════════════════════
// HEALTH PAGE — Rotating Quick Tip Banner
// ═══════════════════════════════════════════════════════════
const rotatingBannerTips = [
    "Today's Tip: Morning hours usually have better air quality. Exercise before 8AM!",
    "Tip: Indoor plants like Peace Lily can help reduce indoor pollution levels.",
    "Reminder: Always check AQI trends before planning long cycling or running sessions.",
    "Tip: Home HVAC particulate filters should be replaced every 3 months.",
    "Health Tip: Staying well hydrated keeps your airway mucous membranes healthy!"
];
let activeTipIndex = 0;

function rotateQuickHealthBannerTips() {
    const tipTextNode = document.getElementById("rotating-tip-text");
    if (!tipTextNode) return;

    activeTipIndex = (activeTipIndex + 1) % rotatingBannerTips.length;
    tipTextNode.style.opacity = "0";

    setTimeout(() => {
        tipTextNode.textContent   = rotatingBannerTips[activeTipIndex];
        tipTextNode.style.opacity = "1";
    }, 250);
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("rotating-tip-text")) {
        setInterval(rotateQuickHealthBannerTips, 5000);
    }
});


// ═══════════════════════════════════════════════════════════
// HEALTH PAGE — Generate Personalized Recommendations
// ═══════════════════════════════════════════════════════════
function generateRecommendations(submissionEvent) {
    submissionEvent.preventDefault();

    const outputSectionNode = document.getElementById("personalized-output-section");
    const gridTargetNode    = document.getElementById("cards-dynamic-rendering-target");
    if (!outputSectionNode || !gridTargetNode) return;

    gridTargetNode.innerHTML = "";

    const activeForm           = submissionEvent.target;
    const selectedAgeGroup     = activeForm.elements["age-group"]?.value;
    const activityLevelEl      = document.getElementById("activity-level");
    const selectedActivityLevel = activityLevelEl ? activityLevelEl.value : "";

    // Collect checked health conditions
    const checkedConditions  = [];
    const conditionCheckboxes = activeForm.elements["conditions"];

    if (conditionCheckboxes) {
        if (conditionCheckboxes.forEach) {
            conditionCheckboxes.forEach(cb => { if (cb.checked) checkedConditions.push(cb.value); });
        } else if (conditionCheckboxes.checked) {
            checkedConditions.push(conditionCheckboxes.value);
        }
    }

    let dynamicCardsHTML = "";

    // Age group cards
    if (selectedAgeGroup === "child") {
        dynamicCardsHTML += createAdviceCardMarkup("👶", "Child Health Protection",
            "Children breathe faster and absorb more pollutants. Avoid outdoor play on orange or red AQI days.", "#ef4444");
    } else if (selectedAgeGroup === "senior") {
        dynamicCardsHTML += createAdviceCardMarkup("👵", "Senior Health Alert",
            "Seniors should avoid prolonged outdoor activity on unhealthy air days. Use indoor spaces for exercise.", "#ef4444");
    } else if (selectedAgeGroup === "teen") {
        dynamicCardsHTML += createAdviceCardMarkup("🧒", "Youth Active Living Guide",
            "Verify air safety before prolonged outdoor field games or cross-country activities.", "#3b82f6");
    }

    // Health condition cards
    checkedConditions.forEach(condition => {
        switch (condition) {
            case "asthma":
                dynamicCardsHTML += createAdviceCardMarkup("🫁", "Asthma Warning",
                    "Keep your rescue inhaler nearby. Avoid outdoor exercise when AQI exceeds 100.", "#ef4444");
                break;
            case "heart":
                dynamicCardsHTML += createAdviceCardMarkup("💔", "Heart Disease Warning",
                    "High pollution increases heart attack and stroke risk. Avoid strenuous outdoor activity.", "#f97316");
                break;
            case "pregnancy":
                dynamicCardsHTML += createAdviceCardMarkup("🤰", "Pregnancy Protection Alert",
                    "Developing fetuses are vulnerable to pollution. Stay indoors with an air purifier when AQI > 150.", "#f97316");
                break;
            case "lung":
                dynamicCardsHTML += createAdviceCardMarkup("💊", "Chronic Lung Disease / COPD",
                    "Take medications regularly and rely on indoor climate systems during hazy days.", "#ef4444");
                break;
            case "allergies":
                dynamicCardsHTML += createAdviceCardMarkup("🌿", "Allergies / Hay Fever",
                    "High ozone compounds pollen allergies. Wash clothes and hair after coming indoors.", "#eab308");
                break;
            case "diabetes":
                dynamicCardsHTML += createAdviceCardMarkup("🩸", "Diabetes Care",
                    "Air pollution can increase insulin resistance. Prioritize clean indoor environments.", "#3b82f6");
                break;
        }
    });

    // Activity level cards
    if (selectedActivityLevel === "outdoor") {
        dynamicCardsHTML += createAdviceCardMarkup("👷", "Outdoor Worker Protocol",
            "Wear a certified N95 mask when AQI is poor. Take regular breaks in clean-air zones.", "#ef4444");
    } else if (selectedActivityLevel === "athlete") {
        dynamicCardsHTML += createAdviceCardMarkup("🏃", "Athlete Training Advisory",
            "Move intense training indoors when AQI exceeds 100.", "#f97316");
    } else if (selectedActivityLevel === "office") {
        dynamicCardsHTML += createAdviceCardMarkup("🏢", "Office Worker",
            "Check that building ventilation systems have functioning carbon pre-filters.", "#22c55e");
    } else if (selectedActivityLevel === "student") {
        dynamicCardsHTML += createAdviceCardMarkup("🎒", "Student Daily Routine",
            "Avoid busy roads when walking to school during peak morning rush hours.", "#3b82f6");
    }

    gridTargetNode.innerHTML = dynamicCardsHTML;
    outputSectionNode.classList.remove("style-hidden");
    outputSectionNode.scrollIntoView({ behavior: "smooth", block: "start" });
}

function createAdviceCardMarkup(emoji, title, text, borderHexColor) {
    return `
        <div class="advice-card" style="border-left-color: ${borderHexColor};">
            <div class="card-icon-frame">${emoji}</div>
            <div class="card-text-frame">
                <h3>${title}</h3>
                <p>${text}</p>
            </div>
        </div>
    `;
}


// ═══════════════════════════════════════════════════════════
// LEARN PAGE — State & Initialization
// ═══════════════════════════════════════════════════════════
const AirCareLearnState = {
    currentTab:       "quizzes",
    videoWatched:     false,
    completedQuizzes: []
};

document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector(".gamification-tabs-container")) {
        initializeLearnDashboard();
        setupVideoWatchTracker();
    }
});

function initializeLearnDashboard() {
    // Restore video watched state
    if (localStorage.getItem("aircare_video_claimed") === "true") {
        AirCareLearnState.videoWatched = true;
        updateVideoUIState();
    }

    // Restore completed quizzes
    const savedQuizzes = localStorage.getItem("aircare_completed_quizzes");
    if (savedQuizzes) AirCareLearnState.completedQuizzes = JSON.parse(savedQuizzes);

    switchGamificationTab(AirCareLearnState.currentTab);
}


// ═══════════════════════════════════════════════════════════
// LEARN PAGE — Tab Switching
// ═══════════════════════════════════════════════════════════
function switchGamificationTab(targetTabId) {
    AirCareLearnState.currentTab = targetTabId;

    // Update tab button styles
    document.querySelectorAll(".tab-toggle-btn").forEach(btn => {
        const isActive = btn.getAttribute("onclick")?.includes(targetTabId);
        btn.classList.toggle("active", isActive);
        btn.style.background = isActive ? "#3b82f6" : "#e2e8f0";
        btn.style.color      = isActive ? "white"   : "#475569";
    });

    // Show/hide panels
    document.querySelectorAll(".tab-content-panel").forEach(panel => {
        panel.style.display = "none";
        panel.classList.remove("active");
    });

    const activePanel = document.getElementById(`${targetTabId}-tab-panel`);
    if (activePanel) {
        activePanel.style.display = "block";
        setTimeout(() => activePanel.classList.add("active"), 10);
    }
}


// ═══════════════════════════════════════════════════════════
// LEARN PAGE — Video Watch Tracker
// ═══════════════════════════════════════════════════════════
function setupVideoWatchTracker() {
    const claimBtn = document.getElementById("claim-xp-btn");
    if (!claimBtn) return;

    // Listen for YouTube iframe API state-change events
    window.addEventListener("message", (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.event === "onStateChange" && data.info === 0) {
                handleVideoComplete();
            }
        } catch (e) {}
    });

    if (!AirCareLearnState.videoWatched) {
        claimBtn.removeAttribute("disabled");
        claimBtn.innerText   = "Claim Video XP";
        claimBtn.style.cursor = "pointer";
        claimBtn.onclick     = () => handleVideoComplete();
    }
}

function handleVideoComplete() {
    AirCareLearnState.videoWatched = true;
    localStorage.setItem("aircare_video_claimed", "true");
    updateVideoUIState();
    alert("Congratulations! You watched the video and earned +50 XP!");
}

function updateVideoUIState() {
    const claimBtn = document.getElementById("claim-xp-btn");
    if (!claimBtn) return;
    claimBtn.setAttribute("disabled", "true");
    claimBtn.innerText            = "✓ Watched & Claimed";
    claimBtn.style.cursor         = "default";
    claimBtn.style.backgroundColor = "#10b981";
}


// ═══════════════════════════════════════════════════════════
// LEARN PAGE — Start Quiz
// ═══════════════════════════════════════════════════════════
function startQuiz(quizIdentifier) {
    alert(`Starting the "${quizIdentifier.replace(/-/g, " ").toUpperCase()}" quiz. Good luck!`);
}




