const glassDate = document.getElementById('glass-date');
const glassTime = document.getElementById('glass-time');

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


function updateClock() {
    const now = new Date();
    glassDate.textContent = `${now.getDate()} ${MONTHS[now.getMonth()]}, ${now.getFullYear()}`;

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    glassTime.textContent = `${DAYS[now.getDay()]}, ${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
}

updateClock();
setInterval(updateClock, 1000);


const glassLocation = document.getElementById('glass-location');
const glassTemp = document.getElementById('glass-temp');
const glassDesc = document.getElementById('glass-desc');
const glassFeels = document.getElementById('glass-feels');
const glassHumidity = document.getElementById('glass-humidity');
const glassWind = document.getElementById('glass-wind');

const WEATHER_CODES = {
    0: 'Clear', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Cloudy',
    45: 'Fog', 48: 'Icy fog',
    51: 'Light drizzle', 53: 'Drizzle', 55: 'Dense drizzle',
    61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
    71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
    80: 'Light showers', 81: 'Showers', 82: 'Violent showers',
    95: 'Thunderstorm'
};

async function fetchWeather(lat, lon, label) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;
        const res = await fetch(url);
        const data = await res.json();
        const c = data.current;

        glassTemp.textContent = `${c.temperature_2m.toFixed(1)}°C`;
        glassDesc.textContent = WEATHER_CODES[c.weather_code] ?? 'Clear';
        glassFeels.textContent = `${c.apparent_temperature.toFixed(1)}°C`;
        glassHumidity.textContent = `${c.relative_humidity_2m}%`;
        glassWind.textContent = `${c.wind_speed_10m.toFixed(1)}km/h`;
        glassLocation.textContent = label;
    } catch {
        glassDesc.textContent = 'Weather unavailable';
        glassLocation.textContent = label || 'Unknown location';
    }
}

async function reverseGeocode(lat, lon) {
    try {
        const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
        const data = await res.json();
        const city = data.city || data.locality || 'Your location';
        const region = data.principalSubdivisionCode ? data.principalSubdivisionCode.split('-').pop() : '';
        return region ? `${city} (${region})` : city;
    } catch {
        return 'Your location';
    }
}

function initWeather() {
    const info = { lat: 23.1815, lon: 79.9864, label: 'Jabalpur (MP)' };

    if (!navigator.geolocation) {
        fetchWeather(info.lat, info.lon, info.label);
        return;
    }
    navigator.geolocation.getCurrentPosition(
        async (pos) => {
            const { latitude, longitude } = pos.coords;
            const label = await reverseGeocode(latitude, longitude);
            fetchWeather(latitude, longitude, label);
        },
        () => fetchWeather(info.lat, info.lon, info.label),
        { timeout: 6000 }
    );
}
initWeather();


const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

function applyTimeBasedTheme() {
    const hour = new Date().getHours();
    const isDayTime = hour >= 6 && hour < 19;
    document.body.classList.toggle('theme-light', isDayTime);
    themeIcon.textContent = isDayTime ? 'light_mode' : 'bedtime';
}
applyTimeBasedTheme();
setInterval(applyTimeBasedTheme, 60 * 1000);

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('theme-light');
    const isLight = document.body.classList.contains('theme-light');
    themeIcon.textContent = isLight ? 'light_mode' : 'bedtime';
});


const iconCircles = document.querySelectorAll(".icon-circle");

iconCircles.forEach((icon) => {
    const iconVideo = icon.querySelector(".icon-video"); // only THIS circle's video

    icon.addEventListener("mouseenter", () => {
        iconVideo.play();
    });

    icon.addEventListener("mouseleave", () => {
        iconVideo.pause();
        iconVideo.currentTime = 0;
    });
});

const hero = document.querySelector(".hero");
const moon = document.querySelector(".moon");
const nightVideo = document.querySelector(".night-video");
const dayVideo = document.querySelector(".day-video");

let activeVideo = null;

function getActiveSkyVideo() {
    return document.body.classList.contains("theme-light")
        ? dayVideo
        : nightVideo;
}

hero.addEventListener("mouseenter", () => {

    activeVideo = getActiveSkyVideo();

    nightVideo.pause();
    dayVideo.pause();

    nightVideo.classList.remove("is-visible");
    dayVideo.classList.remove("is-visible");

    nightVideo.currentTime = 0;
    dayVideo.currentTime = 0;

    activeVideo.classList.add("is-visible");
    activeVideo.play();

    moon.style.display = "none";
});

hero.addEventListener("mouseleave", () => {

    if (activeVideo) {
        activeVideo.pause();
        activeVideo.currentTime = 0;
        activeVideo.classList.remove("is-visible");
    }

    moon.style.display = "block";

    activeVideo = null;
});