```javascript
// ==========================================
// WEATHER FORECAST APP
// ==========================================

// PUT YOUR OPENWEATHER API KEY HERE
const API_KEY = "a75f7445804ed42d3636c5315b77a138";


// Default city
let currentCity = "Bengaluru";


// ==========================================
// GET CURRENT WEATHER
// ==========================================

async function getWeather(city = currentCity) {

    const loading = document.getElementById("loading");
    const error = document.getElementById("error");

    loading.style.display = "block";
    error.textContent = "";

    try {

        const URL =
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

        console.log("Requesting:", URL);

        const response = await fetch(URL);

        // Check API response
        if (!response.ok) {

            if (response.status === 401) {
                throw new Error(
                    "Invalid API key. Check your OpenWeather API key."
                );
            }

            if (response.status === 404) {
                throw new Error(
                    "City not found. Please check the city name."
                );
            }

            throw new Error(
                `Weather API error: ${response.status}`
            );
        }

        const data = await response.json();

        console.log("Weather data:", data);


        // ==========================================
        // UPDATE CITY
        // ==========================================

        document.getElementById("city").textContent =
            `${data.name}, ${data.sys.country}`;


        // ==========================================
        // TEMPERATURE
        // ==========================================

        document.getElementById("temperature").textContent =
            `${Math.round(data.main.temp)}°C`;


        // ==========================================
        // WEATHER CONDITION
        // ==========================================

        document.getElementById("condition").textContent =
            data.weather[0].description;


        // ==========================================
        // WEATHER ICON
        // ==========================================

        document.getElementById("weatherIcon").src =
            `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;


        // ==========================================
        // HUMIDITY
        // ==========================================

        document.getElementById("humidity").textContent =
            `${data.main.humidity}%`;


        // ==========================================
        // WIND SPEED
        // ==========================================

        const windSpeed =
            data.wind.speed * 3.6;

        document.getElementById("wind").textContent =
            `${windSpeed.toFixed(1)} km/h`;


        // ==========================================
        // FEELS LIKE
        // ==========================================

        document.getElementById("feelsLike").textContent =
            `${Math.round(data.main.feels_like)}°C`;


        // ==========================================
        // PRESSURE
        // ==========================================

        document.getElementById("pressure").textContent =
            `${data.main.pressure} hPa`;


        // ==========================================
        // DATE AND TIME
        // ==========================================

        const now = new Date();

        document.getElementById("date").textContent =
            now.toLocaleString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });


        // Save city
        currentCity = city;


        // Get forecast
        await getForecast(city);


    } catch (err) {

        console.error(err);

        error.textContent =
            "❌ " + err.message;

    } finally {

        loading.style.display = "none";

    }
}


// ==========================================
// GET 5-DAY FORECAST
// ==========================================

async function getForecast(city) {

    try {

        const URL =
            `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

        const response = await fetch(URL);

        if (!response.ok) {
            throw new Error("Unable to load forecast.");
        }

        const data = await response.json();

        const forecastContainer =
            document.getElementById("forecast");

        forecastContainer.innerHTML = "";


        // Store one forecast per day
        const dailyForecast = {};

        data.list.forEach(item => {

            const date =
                item.dt_txt.split(" ")[0];

            if (!dailyForecast[date]) {

                dailyForecast[date] = item;

            }

        });


        // Create forecast cards
        Object.values(dailyForecast)
            .slice(0, 5)
            .forEach(item => {

                const date =
                    new Date(item.dt * 1000);

                const day =
                    date.toLocaleDateString(
                        "en-IN",
                        {
                            weekday: "short"
                        }
                    );


                const card =
                    document.createElement("div");

                card.className =
                    "forecast-card";


                card.innerHTML = `

                    <h3>${day}</h3>

                    <img
                        src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png"
                        alt="${item.weather[0].description}"
                    >

                    <p>
                        ${Math.round(item.main.temp)}°C
                    </p>

                    <p>
                        ${item.weather[0].description}
                    </p>

                `;


                forecastContainer.appendChild(card);

            });


    } catch (error) {

        console.error(
            "Forecast error:",
            error
        );

    }
}


// ==========================================
// SEARCH WEATHER
// ==========================================

function searchWeather() {

    const input =
        document.getElementById("cityInput");

    const city =
        input.value.trim();


    if (city === "") {

        alert("Please enter a city name.");

        return;

    }


    getWeather(city);

    input.value = "";

}


// ==========================================
// ENTER KEY
// ==========================================

document
    .getElementById("cityInput")
    .addEventListener(
        "keypress",
        function(event) {

            if (event.key === "Enter") {

                searchWeather();

            }

        }
    );


// ==========================================
// AUTO REFRESH EVERY 20 SECONDS
// ==========================================

setInterval(
    function() {

        console.log(
            "Refreshing live weather..."
        );

        getWeather(currentCity);

    },
    20000
);


// ==========================================
// LOAD WEATHER WHEN WEBSITE OPENS
// ==========================================

getWeather("Bengaluru");
```
