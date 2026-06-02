let apiToken = "";

// ─── ON PAGE LOAD ───────────────────────────────────────────
window.onload = function () {

    // Hide splash screen after 2.5 seconds
    setTimeout(function () {
        const splash = document.getElementById("splash-screen");
        if (splash) {
            splash.style.opacity = "0";
            splash.style.visibility = "hidden";
        }
    }, 2500);

    // Initial immediate clock tick on page load
    updateLiveClock();

    // Check for saved token
    const savedToken = localStorage.getItem("waqi_api_token");
    if (savedToken && savedToken !== "") {
        apiToken = savedToken;
        const tokenBox = document.getElementById("token-box");
        const dashContent = document.getElementById("dashboard-content");
        
        if (tokenBox) tokenBox.style.display = "none";
        if (dashContent) dashContent.style.display = "flex";
        
        // Load the last searched location if it exists, otherwise fall back to New York
        if (document.getElementById("gauge-location-name")) {
            const lastLocation = localStorage.getItem("selectedLocation") || "New York";
            handleCitySelect(lastLocation);
        }
    } else {
        const tokenBox = document.getElementById("token-box");
        const dashContent = document.getElementById("dashboard-content");
        if (tokenBox) tokenBox.style.display = "block";
        if (dashContent) dashContent.style.display = "none";
    }
};

// ─── LIVE CLOCK PIPELINE ENGINE ─────────────────────────────
function updateLiveClock() {
    const timeElement = document.getElementById('live-time');
    const dateElement = document.getElementById('live-date');
    
    // Safety check: ensure elements exist on the current page context
    if (!timeElement || !dateElement) return;

    const now = new Date();

    // 1. Format Time: 03:49:48 PM
    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    const timeString = now.toLocaleTimeString('en-US', timeOptions);

    // 2. Format Date: Saturday, May 30, 2026
    const dateOptions = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    };
    const dateString = now.toLocaleDateString('en-US', dateOptions);

    // Use textContent validation guard loops to completely prevent visual layout blinking
    if (timeElement.textContent !== timeString) {
        timeElement.textContent = timeString;
    }
    if (dateElement.textContent !== dateString) {
        dateElement.textContent = dateString;
    }
}

// Clear any orphaned structural intervals if script hot-reloads
if (window.clockIntervalID) {
    clearInterval(window.clockIntervalID);
}
// Run clock loop uniformly across all global template frames every 1 second
window.clockIntervalID = setInterval(updateLiveClock, 1000);


// ─── SAVE API TOKEN ──────────────────────────────────────────
function handleSaveToken() {
    const enteredToken = document.getElementById("token-input").value.trim();
    if (enteredToken === "") {
        alert("Please enter your WAQI API token.");
        return;
    }
    apiToken = enteredToken;
    localStorage.setItem("waqi_api_token", apiToken);
    document.getElementById("token-box").style.display = "none";
    document.getElementById("dashboard-content").style.display = "flex";
    handleCitySelect("New York");
}

// ─── SEARCH BAR SUBMIT ───────────────────────────────────────
function handleSearchSubmit() {
    const cityName = document.getElementById("city-input").value.trim();
    if (cityName === "") {
        alert("Please enter a city name.");
        return;
    }
    handleSearchAutofill(""); // close dropdown
    
    // UPDATED: Save the explicitly searched location name into localStorage
    localStorage.setItem("selectedLocation", cityName);
    
    handleCitySelect(cityName);
}

// ─── SEARCH AUTOCOMPLETE ─────────────────────────────────────
function handleSearchAutofill(value) {
    const dropdown = document.getElementById("search-suggestions");
    if (!dropdown) return;

    if (!value || value.length < 2) {
        dropdown.style.display = "none";
        return;
    }

    if (!apiToken) {
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
                    const aqi = station.aqi || "--";
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
                        document.getElementById("city-input").value = station.station.name;
                        dropdown.style.display = "none";
                        
                        // UPDATED: Save the selected autocomplete option location name
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

// ─── GPS LOCATION ────────────────────────────────────────────
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
                        
                        // UPDATED: Save a localized generic name if using browser hardware GPS
                        localStorage.setItem("selectedLocation", "Current GPS Location");
                        
                        updateDashboardUI(result.data);
                    } else {
                        alert("Could not find station near your location.");
                    }
                });
        },
        function () {
            alert("Location access denied. Please allow location in your browser.");
        }
    );
}

// ─── CITY SELECT (fetch AQI data) ────────────────────────────
function handleCitySelect(cityName) {
    if (!apiToken) {
        alert("Please enter your API token first.");
        return;
    }

    document.querySelectorAll(".city-btn").forEach(btn => btn.classList.remove("active-btn"));
    const activeBtn = document.getElementById("btn-" + cityName.replace(/ /g, "-"));
    if (activeBtn) activeBtn.classList.add("active-btn");

    let cleanName = cityName;
    if (cleanName.includes("(")) {
        cleanName = cleanName.split("(")[0];
    }
    if (cleanName.includes(",")) {
        cleanName = cleanName.split(",")[0];
    }
    cleanName = cleanName.trim();

    // UPDATED: Ensure any clean chosen layout button or search query stays persisted
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
                handleFallbackSearch(cleanName);
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
            alert("Network error. Please check your internet connection.");
        });
}

// ─── SEARCH FALLBACK ROUTINE ─────────────────────────────────
function handleFallbackSearch(queryKeyword) {
    const searchUrl = `https://api.waqi.info/search/?token=${apiToken}&keyword=${encodeURIComponent(queryKeyword)}`;

    fetch(searchUrl)
        .then(res => res.json())
        .then(result => {
            if (result.status === "ok" && result.data.length > 0) {
                const targetUid = result.data[0].uid;
                return fetch(`https://api.waqi.info/feed/@${targetUid}/?token=${apiToken}`);
            } else {
                throw new Error("No station matches found in fallback query chain.");
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
            console.error("Fallback search chain error details:", err);
            alert("Location not found. Please try a different city name.");
        });
}

// ─── UPDATE ALL DASHBOARD UI ─────────────────────────────────
function updateDashboardUI(data) {
    if (!data) return;

    const aqi = data.aqi !== undefined ? data.aqi : "--";
    const cityName = data.city?.name || "Selected Location";
    const parsedAqi = parseInt(aqi);

    const locNameNode = document.getElementById("gauge-location-name");
    const stampNode = document.getElementById("station-update-timestamp");
    if (locNameNode) locNameNode.innerText = cityName;
    if (stampNode) stampNode.innerText = "Last updated: " + (data.time?.s || "--");

    const bannerValNode = document.getElementById("banner-aqi-val");
    const gaugeScoreNode = document.getElementById("gauge-display-score");
    if (bannerValNode) bannerValNode.innerText = String(aqi);
    if (gaugeScoreNode) gaugeScoreNode.innerText = String(aqi);

    // Pollutant calculations
    const pm25 = data.iaqi?.pm25?.v;
    const pm10 = data.iaqi?.pm10?.v;
    const no2  = data.iaqi?.no2?.v;
    const o3   = data.iaqi?.o3?.v;
    const co   = data.iaqi?.co?.v;
    const so2  = data.iaqi?.so2?.v;

    const ids = ["bar-val-pm25", "bar-val-pm10", "bar-val-no2", "bar-val-o3", "bar-val-co", "bar-val-so2"];
    const vals = [pm25, pm10, no2, o3, co, so2];
    ids.forEach((id, idx) => {
        const el = document.getElementById(id);
        if (el) el.innerText = vals[idx] !== undefined ? vals[idx] : "--";
    });

    setBarFill("bar-fill-pm25", pm25, 150);
    setBarFill("bar-fill-pm10", pm10, 250);
    setBarFill("bar-fill-no2",  no2,  200);
    setBarFill("bar-fill-o3",   o3,   200);
    setBarFill("bar-fill-co",   co,   50);
    setBarFill("bar-fill-so2",  so2,  100);

    // Weather metrics
    const tempVal     = data.iaqi?.t?.v !== undefined ? `${data.iaqi.t.v}°C` : "--";
    const humidVal    = data.iaqi?.h?.v !== undefined ? `${data.iaqi.h.v}%`  : "--";
    const pressureVal = data.iaqi?.p?.v !== undefined ? `${data.iaqi.p.v} hPa` : "--";
    const windVal     = data.iaqi?.w?.v !== undefined ? `${data.iaqi.w.v} km/h` : "--";

    const pillTemp = document.getElementById("pill-temp");
    const pillHumid = document.getElementById("pill-humidity");
    const tableTemp = document.getElementById("table-temp");
    const tableHumid = document.getElementById("table-humidity");
    const tablePress = document.getElementById("table-pressure");
    const tableWind = document.getElementById("table-wind");

    if (pillTemp) pillTemp.innerText = tempVal;
    if (pillHumid) pillHumid.innerText = humidVal;
    if (tableTemp) tableTemp.innerText = tempVal;
    if (tableHumid) tableHumid.innerText = humidVal;
    if (tablePress) tablePress.innerText = pressureVal;
    if (tableWind) tableWind.innerText = windVal;

    let colorTheme = "#ef4444";
    let globalBg   = "#fee2e2";
    let statusLabel = "Hazardous";
    let recommendation = "Avoid all outdoor activity. Stay indoors and run air filters.";
    let avatarIcon = "🚨";
    let showUmbrella = false;

    if (isNaN(parsedAqi)) {
        colorTheme = "#64748b"; globalBg = "#e2e8f0";
        statusLabel = "No Data";
        recommendation = "Station data is currently unavailable.";
        avatarIcon = "🤖";
    } else if (parsedAqi <= 50) {
        colorTheme = "#10b981"; globalBg = "#e6f4ea";
        statusLabel = "Good";
        recommendation = "Air is excellent today! Perfect for outdoor walks and exercise. 😊";
        avatarIcon = "😊";
    } else if (parsedAqi <= 100) {
        colorTheme = "#d97706"; globalBg = "#fef3c7";
        statusLabel = "Moderate";
        recommendation = "Air is acceptable. Sensitive groups should take care outdoors. 😀";
        avatarIcon = "😀";
    } else if (parsedAqi <= 150) {
        colorTheme = "#f97316"; globalBg = "#ffedd5";
        statusLabel = "Unhealthy for Sensitive Groups";
        recommendation = "Sensitive individuals should limit prolonged outdoor activity. 😐";
        avatarIcon = "😐";
    } else if (parsedAqi <= 200) {
        colorTheme = "#ef4444"; globalBg = "#fee2e2";
        statusLabel = "Unhealthy";
        recommendation = "Everyone should reduce outdoor activity. Wear a mask outside. 😷";
        avatarIcon = "😷";
        showUmbrella = true;
    } else if (parsedAqi <= 300) {
        colorTheme = "#9333ea"; globalBg = "#f3e8ff";
        statusLabel = "Very Unhealthy";
        recommendation = "Health alert! Avoid all outdoor activity. Use indoor air purifiers.";
        avatarIcon = "😷";
        showUmbrella = true;
    }

    const avatarNode = document.getElementById("character-avatar");
    const descNode = document.getElementById("status-desc");
    const bannerStatusNode = document.getElementById("banner-status-text");
    const labelNode = document.getElementById("gauge-display-label");
    const bannerBox = document.getElementById("aqi-banner-box");
    const gaugeBox = document.getElementById("gauge-card-box");
    const umbrellaEl = document.getElementById("umbrella-element");

    if (avatarNode) avatarNode.innerText = avatarIcon;
    if (descNode) descNode.innerText = recommendation;
    if (bannerStatusNode) bannerStatusNode.innerText = statusLabel;
    if (labelNode) labelNode.innerText = statusLabel;
    if (bannerBox) bannerBox.style.backgroundColor = colorTheme;
    if (gaugeBox) {
        gaugeBox.style.backgroundColor = colorTheme;
        gaugeBox.style.color = "white";
    }
    document.body.style.backgroundColor = globalBg;

    if (umbrellaEl) umbrellaEl.style.display = showUmbrella ? "block" : "none";

    const gaugeArc = document.getElementById("gauge-arc-fill");
    if (gaugeArc && !isNaN(parsedAqi)) {
        const capped = Math.min(Math.max(parsedAqi, 0), 300);
        const offset = 125.6 - (capped / 300) * 125.6;
        gaugeArc.style.strokeDashoffset = offset;
        gaugeArc.style.stroke = colorTheme;
    }
}

function setBarFill(barId, value, maxVal) {
    const bar = document.getElementById(barId);
    if (!bar) return;
    if (value === undefined || value === null) {
        bar.style.width = "0%";
        bar.style.backgroundColor = "#94a3b8";
        return;
    }
    const percent = Math.min((value / maxVal) * 100, 100);
    bar.style.width = percent + "%";
    if (percent < 30) bar.style.backgroundColor = "#10b981";
    else if (percent < 60) bar.style.backgroundColor = "#d97706";
    else bar.style.backgroundColor = "#ef4444";
}

function getAqiColor(aqi) {
    if (isNaN(aqi)) return "#64748b";
    if (aqi <= 50)  return "#10b981";
    if (aqi <= 100) return "#d97706";
    if (aqi <= 150) return "#f97316";
    if (aqi <= 200) return "#ef4444";
    return "#9333ea";
}

// ─── ECO ROTATING BANNER INTERACTION RULES ──────────────────
const rotatingBannerTips = [
    "Today's Tip: Morning hours usually have better air quality. Exercise before 8AM!",
    "Tip: Indoor plants like Peace Lily can help reduce indoor pollution levels.",
    "Reminder: Always check the active AQI trends before planning long cycling or running sessions.",
    "Tip: Fine particulate filters inside home HVAC systems should be replaced every 3 months.",
    "Health Tip: Staying well hydrated keeps your airway protective mucous membranes running perfectly!"
];
let activeTipIndex = 0;

function rotateQuickHealthBannerTips() {
    const tipTextNode = document.getElementById("rotating-tip-text");
    if (!tipTextNode) return;

    activeTipIndex = (activeTipIndex + 1) % rotatingBannerTips.length;
    tipTextNode.style.opacity = 0;
    setTimeout(() => {
        tipTextNode.textContent = rotatingBannerTips[activeTipIndex];
        tipTextNode.style.opacity = 1;
    }, 200);
}

// Register health tips rotation cycle loop
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("rotating-tip-text")) {
        setInterval(rotateQuickHealthBannerTips, 5000);
    }
});

// ─── HEALTH GENERATE RECS ───────────────────────────────────
function generateRecommendations(submissionEvent) {
    submissionEvent.preventDefault();

    const outputSectionNode = document.getElementById("personalized-output-section");
    const gridTargetNode = document.getElementById("cards-dynamic-rendering-target");
    if (!outputSectionNode || !gridTargetNode) return;

    gridTargetNode.innerHTML = "";
    const activeForm = submissionEvent.target;
    const selectedAgeGroup = activeForm.elements["age-group"].value;
    const selectedActivityLevel = document.getElementById("activity-level").value;
    
    const checkedConditions = [];
    const conditionCheckboxes = activeForm.elements["conditions"];
    
    if (conditionCheckboxes) {
        if (conditionCheckboxes.forEach) {
            conditionCheckboxes.forEach(cb => { if (cb.checked) checkedConditions.push(cb.value); });
        } else if (conditionCheckboxes.checked) {
            checkedConditions.push(conditionCheckboxes.value);
        }
    }

    let dynamicCardsHTMLContent = "";

    if (selectedAgeGroup === "child") {
        dynamicCardsHTMLContent += createAdviceCardMarkup("👶", "Child Health Protection", "Children breathe faster and absorb more pollutants. Keep outdoor play limited to low-traffic parks and avoid playing outdoors completely on days with orange or red AQI ratings.", "#ef4444");
    } else if (selectedAgeGroup === "senior") {
        dynamicCardsHTMLContent += createAdviceCardMarkup("👵", "Senior Health Alert", "Seniors should avoid prolonged outdoor activity on unhealthy air days. Consider indoor alternatives like malls or community centers for walking exercises.", "#ef4444");
    } else if (selectedAgeGroup === "teen") {
        dynamicCardsHTMLContent += createAdviceCardMarkup("🧒", "Youth Active Living Guide", "While athletic active play is encouraged, verify air safety thresholds before prolonged field games or cross-country meets.", "#3b82f6");
    }

    checkedConditions.forEach(condition => {
        switch(condition) {
            case "asthma":
                dynamicCardsHTMLContent += createAdviceCardMarkup("🫁", "Asthma Warning", "Keep your rescue inhaler nearby at all times. Completely avoid outdoor aerobic exercises when the localized AQI exceeds 100.", "#ef4444");
                break;
            case "heart":
                dynamicCardsHTMLContent += createAdviceCardMarkup("💔", "Heart Disease Warning", "High pollution levels trigger cardiovascular stress and increase immediate stroke/heart attack risks. Avoid strenuous outdoor activity during peak pollution alerts.", "#f97316");
                break;
            case "pregnancy":
                dynamicCardsHTMLContent += createAdviceCardMarkup("🤰", "Pregnancy Protection Alert", "Developing fetuses are highly vulnerable to particulate matter cross-contamination. Stay indoors with an air purifier operational when local AQI readings exceed 150.", "#f97316");
                break;
            case "lung":
                dynamicCardsHTMLContent += createAdviceCardMarkup("💊", "Chronic Lung Disease/COPD Management", "Ensure regular baseline medications are taken. Monitor oxygenation indexes closely and rely exclusively on indoor recirculated climate systems during hazy periods.", "#ef4444");
                break;
            case "allergies":
                dynamicCardsHTMLContent += createAdviceCardMarkup("🌿", "Allergies / Hay Fever Response", "High dust or ozone index thresholds drastically compound standard environmental tree pollen allergies. Wash clothes and hair immediately after coming from outside.", "#eab308");
                break;
            case "diabetes":
                dynamicCardsHTMLContent += createAdviceCardMarkup("🩸", "Diabetes Systemic Care", "Systemic internal inflammation caused by long-term air pollution can increase insulin resistance. Prioritize clean indoor spaces to keep metabolic stress indicators low.", "#3b82f6");
                break;
        }
    });

    if (selectedActivityLevel === "outdoor") {
        dynamicCardsHTMLContent += createAdviceCardMarkup("👷", "Outdoor Worker Protocol", "Wear a certified, tight-fitting N95 mask during work shifts when AQI ratings are poor. Take frequent mandatory breaks inside verified clean-air structural zones.", "#ef4444");
    } else if (selectedActivityLevel === "athlete") {
        dynamicCardsHTMLContent += createAdviceCardMarkup("🏃", "Athlete Training Advisory", "Reschedule intense outdoor endurance training blocks to internal track environments when regional AQI scores scale past 100.", "#f97316");
    } else if (selectedActivityLevel === "office") {
        dynamicCardsHTMLContent += createAdviceCardMarkup("🏢", "Office Worker Maintenance", "While safer inside commercial structures, verify that building intake ventilation systems contain functional carbon pre-filters to catch high particulate seepage.", "#22c55e");
    } else if (selectedActivityLevel === "student") {
        dynamicCardsHTMLContent += createAdviceCardMarkup("🎒", "Student Daily Routine", "Avoid heavy gridlock highway walkways when walking to school during peak morning rush hours.", "#3b82f6");
    }

    gridTargetNode.innerHTML = dynamicCardsHTMLContent;
    outputSectionNode.classList.remove("style-hidden");
    outputSectionNode.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

// ─── LEARN MODULE ENGINE ─────────────────────────────────────
const AirCareLearnState = {
    currentTab: 'quizzes',
    videoWatched: false,
    completedQuizzes: ['pollutants']
};

document.addEventListener('DOMContentLoaded', () => {
    // Only run initialization if we are on the learn view layout
    if (document.querySelector('.gamification-tabs-container')) {
        initializeLearnDashboard();
        setupVideoWatchTracker();
    }
});

function initializeLearnDashboard() {
    const savedVideoState = localStorage.getItem('aircare_video_claimed');
    if (savedVideoState === 'true') {
        AirCareLearnState.videoWatched = true;
        updateVideoUIState();
    }

    const savedQuizzes = localStorage.getItem('aircare_completed_quizzes');
    if (savedQuizzes) {
        AirCareLearnState.completedQuizzes = JSON.parse(savedQuizzes);
    }
    
    switchGamificationTab(AirCareLearnState.currentTab);
}

function switchGamificationTab(targetTabId) {
    AirCareLearnState.currentTab = targetTabId;
    
    const tabButtons = document.querySelectorAll('.tab-toggle-btn');
    const contentPanels = document.querySelectorAll('.tab-content-panel');

    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = "#e2e8f0";
        btn.style.color = "#475569";
        
        if(btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(targetTabId)) {
            btn.classList.add('active');
            btn.style.background = "#3b82f6";
            btn.style.color = "white";
        }
    });

    contentPanels.forEach(panel => {
        panel.style.display = 'none';
        panel.classList.remove('active');
    });

    const activePanel = document.getElementById(`${targetTabId}-tab-panel`);
    if (activePanel) {
        activePanel.style.display = 'block';
        setTimeout(() => activePanel.classList.add('active'), 10);
    }
}

function setupVideoWatchTracker() {
    const claimBtn = document.getElementById('claim-xp-btn');
    if (!claimBtn) return;

    window.addEventListener('message', (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.event === 'onStateChange' && data.info === 0) {
                handleVideoComplete();
            }
        } catch (e) {}
    });

    if (!AirCareLearnState.videoWatched) {
        claimBtn.removeAttribute('disabled');
        claimBtn.innerText = "Claim Video XP";
        claimBtn.style.cursor = "pointer";
        claimBtn.onclick = () => { handleVideoComplete(); };
    }
}

function handleVideoComplete() {
    AirCareLearnState.videoWatched = true;
    localStorage.setItem('aircare_video_claimed', 'true');
    updateVideoUIState();
    alert("Congratulations! You've successfully watched the air quality video and earned +50 XP!");
}

function updateVideoUIState() {
    const claimBtn = document.getElementById('claim-xp-btn');
    if (claimBtn) {
        claimBtn.setAttribute('disabled', 'true');
        claimBtn.innerText = "✓ Watched & Claimed";
        claimBtn.style.cursor = "default";
        claimBtn.style.backgroundColor = "#10b981";
    }
}

function startQuiz(quizIdentifier) {
    alert(`Starting the "${quizIdentifier.replace('-', ' ').toUpperCase()}" quiz module. Good luck!`);
}