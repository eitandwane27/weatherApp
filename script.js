// Modern Weather Dashboard Application
const WeatherApp = {
    // Configuration
    config: {
        apiKey: "b53ef177463977e8c225f240a408e372",
        apiBaseUrl: "https://api.openweathermap.org/data/2.5",
        defaultCity: "Madrid",
        animationDefaults: {
            duration: 0.5,
            ease: "power2.inOut",
        },
    },

    // Weather Animations Mapping
    weatherAnimations: {
        // Day Icons
        "01d": "https://assets10.lottiefiles.com/packages/lf20_xlky4kvh.json", // clear sky day
        "02d": "https://assets2.lottiefiles.com/packages/lf20_KUFdS6.json", // cloudy
        "03d": "https://assets2.lottiefiles.com/packages/lf20_KUFdS6.json", // cloudy
        "04d": "https://assets2.lottiefiles.com/packages/lf20_KUFdS6.json", // cloudy
        "10d": "https://lottie.host/c7023c24-d0af-4ddc-84ba-998e43fce55d/RFhHiCEi5Y.json", // rain
        "11d": "https://lottie.host/4c83c493-0082-48c0-836e-0db629244172/u7v4uh05Qx.json", // thunderstorm
        "13d": "https://lottie.host/dc1de933-8564-4633-a983-756910b56261/bJJiORehyz.json", // snow

        // Night Icons
        "01n": "https://lottie.host/f6f9b970-94a5-49f6-970a-89090ccddf31/chvFE6jvqE.json", // clear night
        "02n": "https://lottie.host/796252bc-2f8c-4ded-8cd3-e5676082ca55/CVl4YCijrc.json", // cloudy night
        "03n": "https://lottie.host/796252bc-2f8c-4ded-8cd3-e5676082ca55/CVl4YCijrc.json", // cloudy night
        "04n": "https://lottie.host/796252bc-2f8c-4ded-8cd3-e5676082ca55/CVl4YCijrc.json", // cloudy night
        "10n": "https://lottie.host/db348663-3003-4aa4-be8b-2e559af4f55b/8bHKfOsFed.json", // rain night
        "11n": "https://lottie.host/4c83c493-0082-48c0-836e-0db629244172/u7v4uh05Qx.json", // thunderstorm
        "13n": "https://lottie.host/dc1de933-8564-4633-a983-756910b56261/bJJiORehyz.json", // snow night
    },

    // Static Animations
    staticAnimations: {
        logo: "https://assets10.lottiefiles.com/packages/lf20_xlky4kvh.json",
        mainWeather:
            "https://lottie.host/61b7492d-b4ec-43c6-9a75-f3ccfc9a94e4/etT9EaL3rA.json", // New clear sky animation
        temperature:
            "https://assets3.lottiefiles.com/packages/lf20_KUFdS6.json",
        wind: "https://assets2.lottiefiles.com/packages/lf20_yd8fblmd.json",
        rain: "https://assets5.lottiefiles.com/packages/lf20_jmBqP4.json",
        uv: "https://assets5.lottiefiles.com/packages/lf20_XkF78Y.json",
    },

    // DOM Elements
    elements: {
        themeToggle: null,
        weatherForm: null,
        loading: null,
        hourlyForecast: null,
        weeklyForecast: null,
        cityInput: null,
    },

    // Theme Management
    theme: {
        init() {
            const prefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;

            // Set initial theme
            document.body.classList.toggle("dark-theme", prefersDark);
            document.body.classList.toggle("light-theme", !prefersDark);

            // Apply initial styles without animation
            const colors = {
                dark: {
                    background: "#121418",
                    panelBg: "#1E2128",
                    text: "#FFFFFF",
                    border: "#2A2F3C",
                    shadow: "rgba(0, 0, 0, 0.2)",
                    secondaryText: "#94A3B8",
                },
                light: {
                    background: "#C8E2F1",
                    panelBg: "#FFFFFF",
                    text: "#2C5364",
                    border: "#85B7CA",
                    shadow: "rgba(128, 206, 230, 0.15)",
                    secondaryText: "#5B8DA3",
                    gradientStart: "#96CAE0",
                    gradientEnd: "#C8E2F1",
                    cardBorder: "1px solid rgba(133, 183, 202, 0.3)",
                    cardShadow: "0 8px 20px rgba(128, 206, 230, 0.1)",
                },
            };

            const currentColors = prefersDark ? colors.dark : colors.light;

            if (!prefersDark) {
                document.body.style.background = `linear-gradient(135deg, ${currentColors.gradientStart} 0%, ${currentColors.gradientEnd} 100%)`;

                const panels = document.querySelectorAll(
                    ".forecast-panel, .air-conditions"
                );
                panels.forEach((panel) => {
                    panel.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
                    panel.style.border = currentColors.cardBorder;
                    panel.style.boxShadow = currentColors.cardShadow;
                    panel.style.backdropFilter = "blur(10px)";
                });

                const forecastDays = document.querySelectorAll(".forecast-day");
                forecastDays.forEach((day) => {
                    day.style.backgroundColor = "rgba(255, 255, 255, 0.85)";
                    day.style.border = currentColors.cardBorder;
                    day.style.boxShadow = currentColors.cardShadow;
                });

                const cityInput = document.querySelector("#cityInput");
                if (cityInput) {
                    cityInput.style.backgroundColor =
                        "rgba(255, 255, 255, 0.9)";
                    cityInput.style.borderColor = currentColors.border;
                    cityInput.style.boxShadow = currentColors.cardShadow;
                }
            }
        },

        setTheme(isDark) {
            const tl = gsap.timeline({
                defaults: {
                    ...WeatherApp.config.animationDefaults,
                    ease: "power2.inOut",
                    duration: 0.6,
                },
            });

            document.body.classList.toggle("dark-theme", isDark);
            document.body.classList.toggle("light-theme", !isDark);

            // Enhanced color palette for better visual comfort
            const colors = {
                dark: {
                    background: "#121418",
                    panelBg: "#1E2128",
                    text: "#FFFFFF",
                    border: "#2A2F3C",
                    shadow: "rgba(0, 0, 0, 0.2)",
                    secondaryText: "#94A3B8",
                },
                light: {
                    background: "#C8E2F1", // Primary background color
                    panelBg: "#FFFFFF",
                    text: "#2C5364", // Darker shade for better readability
                    border: "#85B7CA", // Border color from palette
                    shadow: "rgba(128, 206, 230, 0.15)", // Using #80CEE6 for shadow
                    secondaryText: "#5B8DA3", // Muted text color
                    gradientStart: "#96CAE0",
                    gradientEnd: "#C8E2F1",
                    cardBorder: "1px solid rgba(133, 183, 202, 0.3)", // Subtle border using #85B7CA
                    cardShadow: "0 8px 20px rgba(128, 206, 230, 0.1)", // Soft shadow using #80CEE6
                },
            };

            const currentColors = isDark ? colors.dark : colors.light;

            // Smooth background transition with gradient for light mode
            if (!isDark) {
                tl.to(
                    "body",
                    {
                        background: `linear-gradient(135deg, ${currentColors.gradientStart} 0%, ${currentColors.gradientEnd} 100%)`,
                        color: currentColors.text,
                        duration: 0.6,
                    },
                    0
                );

                // Enhanced panel styling for light mode
                tl.to(
                    [
                        ".forecast-panel",
                        ".air-conditions",
                        ".forecast-day",
                        ".current-weather",
                    ],
                    {
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        border: currentColors.cardBorder,
                        boxShadow: currentColors.cardShadow,
                        backdropFilter: "blur(10px)",
                        duration: 0.6,
                    },
                    0
                );
                tl.to(
                    [".search-container form"],
                    {
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        border: "none",
                        boxShadow: currentColors.cardShadow,
                        backdropFilter: "blur(10px)",
                        duration: 0.6,
                    },
                    0
                );

                // Enhanced forecast day cards
                tl.to(
                    ".forecast-day",
                    {
                        backgroundColor: "rgba(255, 255, 255, 0.85)",
                        border: currentColors.cardBorder,
                        boxShadow: currentColors.cardShadow,
                        borderRadius: "12px",
                        duration: 0.6,
                    },
                    0
                );
            } else {
                // Dark mode transitions
                tl.to(
                    "body",
                    {
                        background: currentColors.background,
                        color: currentColors.text,
                        duration: 0.6,
                    },
                    0
                );

                tl.to(
                    [".forecast-panel", ".air-conditions"],
                    {
                        backgroundColor: currentColors.panelBg,
                        border: "none",
                        boxShadow: "none",
                        duration: 0.6,
                    },
                    0
                );

                tl.to(
                    ".forecast-day",
                    {
                        backgroundColor: currentColors.panelBg,
                        border: "none",
                        boxShadow: "none",
                        duration: 0.6,
                    },
                    0
                );
            }

            // Theme toggle animation
            tl.to(
                ".theme-toggle",
                {
                    scale: 0.9,
                    duration: 0.3,
                    ease: "power3.out",
                },
                0
            ).to(
                ".theme-toggle",
                {
                    scale: 1,
                    duration: 0.4,
                    ease: "elastic.out(1, 0.5)",
                },
                0.3
            );

            // Text transitions with enhanced colors
            tl.to(
                "#temperature",
                {
                    color: currentColors.text,
                    opacity: 1,
                    duration: 0.6,
                },
                0
            ).to(
                "#weatherDesc",
                {
                    color: currentColors.secondaryText,
                    opacity: 0.9,
                    duration: 0.6,
                },
                0
            );

            // Input field transitions with modern styling
            tl.to(
                "#cityInput",
                {
                    backgroundColor: !isDark
                        ? "rgba(255, 255, 255, 0.9)"
                        : currentColors.panelBg,
                    borderColor: currentColors.border,
                    color: currentColors.text,
                    boxShadow: !isDark ? currentColors.cardShadow : "none",
                    duration: 0.6,
                },
                0
            );

            // Weather details transitions
            tl.to(
                [".detail-item", ".condition-item"],
                {
                    color: currentColors.text,
                    duration: 0.6,
                },
                0
            ).to(
                [".detail-item span", ".condition-label"],
                {
                    color: currentColors.secondaryText,
                    duration: 0.6,
                },
                0
            );
        },
    },

    // Weather Data Management
    weather: {
        async fetchWeather(city) {
            try {
                // Fetch current weather
                const weatherUrl = `${WeatherApp.config.apiBaseUrl}/weather?q=${city}&appid=${WeatherApp.config.apiKey}&units=metric`;
                const weatherResponse = await fetch(weatherUrl);
                const weatherData = await weatherResponse.json();

                if (!weatherResponse.ok) throw new Error(weatherData.message);

                // Log weather data for debugging
                console.log("Weather Data:", {
                    city: weatherData.name,
                    temp: weatherData.main.temp,
                    weatherId: weatherData.weather[0].id,
                    description: weatherData.weather[0].description,
                    coords: weatherData.coord,
                });

                // Special handling for locations likely to have snow
                const lat = weatherData.coord.lat;
                const temp = weatherData.main.temp;

                // Enhanced snow detection for cold regions
                if (Math.abs(lat) >= 60 || temp <= 0) {
                    console.log("Cold region detected:", { lat, temp });
                    // For locations near poles or cold temperatures
                    if (
                        weatherData.weather[0].id >= 700 &&
                        weatherData.weather[0].id < 800
                    ) {
                        weatherData.weather[0].id = 600;
                    }
                    // Also convert heavy clouds to snow in very cold conditions
                    if (temp <= -5 && weatherData.weather[0].id >= 803) {
                        weatherData.weather[0].id = 600;
                    }
                }

                // Fetch forecast data using coordinates
                const forecastUrl = `${WeatherApp.config.apiBaseUrl}/forecast?lat=${lat}&lon=${weatherData.coord.lon}&appid=${WeatherApp.config.apiKey}&units=metric`;
                const forecastResponse = await fetch(forecastUrl);
                const forecastData = await forecastResponse.json();

                if (!forecastResponse.ok) throw new Error(forecastData.message);

                return {
                    current: weatherData,
                    forecast: forecastData,
                };
            } catch (error) {
                throw new Error(
                    `Failed to fetch weather data: ${error.message}`
                );
            }
        },

        updateWeatherUI(data) {
            this.updateMainWeather(data.current);
            this.updateHourlyForecast(data.forecast);
            this.updateWeeklyForecast(data.forecast);
        },

        updateMainWeather(data) {
            const temp = Math.round(data.main.temp);
            const feelsLike = Math.round(data.main.feels_like);
            const windSpeed = Math.round(data.wind.speed * 3.6); // Convert m/s to km/h
            const description = data.weather[0].description;
            const weatherId = data.weather[0].id;
            const weatherIcon = data.weather[0].icon;

            // Get current hour for day/night check
            const currentHour = new Date().getHours();

            console.log("Updating main weather:", {
                temp,
                feelsLike,
                windSpeed,
                description,
                weatherId,
                weatherIcon,
                currentHour,
                isDaytime: this.isDaytime(currentHour),
            });

            // Helper function to safely update element text content
            const safelyUpdateElement = (id, value) => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = value;
                }
            };

            // Update all elements safely
            safelyUpdateElement(
                "cityName",
                `${data.name}, ${data.sys.country}`
            );
            safelyUpdateElement("temperature", temp);
            safelyUpdateElement("weatherDesc", description);
            safelyUpdateElement("realFeel", `${feelsLike}°`);
            safelyUpdateElement("realFeel2", `${feelsLike}°`);
            safelyUpdateElement("windSpeed", `${windSpeed} km/h`);

            // Update rain chance from forecast data if available
            const rainChance =
                data.rain && data.rain["1h"]
                    ? Math.min(100, Math.round((data.rain["1h"] * 100) / 8))
                    : 0;

            safelyUpdateElement("rainChance", `${rainChance}%`);
            safelyUpdateElement("rainChance2", `${rainChance}%`);

            // Calculate UV index (simplified version based on time of day and clouds)
            const clouds = data.clouds.all;
            let uvIndex = 0;

            if (this.isDaytime(currentHour)) {
                // Daytime
                uvIndex = Math.round(10 * (1 - clouds / 100)); // 0-10 scale based on cloud cover
            }

            safelyUpdateElement("uvIndex", uvIndex);

            // Update weather animation
            const mainWeatherAnimation = document.getElementById(
                "mainWeatherAnimation"
            );
            if (mainWeatherAnimation) {
                // Get animation URL based on weather conditions
                let animationUrl;

                // First try to use the provided weather icon
                if (WeatherApp.weatherAnimations[weatherIcon]) {
                    animationUrl = WeatherApp.weatherAnimations[weatherIcon];
                }
                // Then try snow conditions
                else if (weatherId >= 600 && weatherId <= 622) {
                    const iconCode = this.getWeatherIconCode(
                        weatherId,
                        currentHour,
                        temp
                    );
                    animationUrl = WeatherApp.weatherAnimations[iconCode];
                }
                // Then try cold conditions
                else if (temp <= 0 && (weatherId >= 700 || weatherId >= 803)) {
                    const iconCode = this.getWeatherIconCode(
                        weatherId,
                        currentHour,
                        temp
                    );
                    animationUrl = WeatherApp.weatherAnimations[iconCode];
                }
                // Finally fall back to default
                else {
                    const iconCode = this.getWeatherIconCode(
                        weatherId,
                        currentHour,
                        temp
                    );
                    animationUrl = WeatherApp.weatherAnimations[iconCode];
                }

                console.log("Animation selection:", {
                    weatherIcon,
                    currentHour,
                    isDaytime: this.isDaytime(currentHour),
                    animationUrl,
                });

                if (
                    animationUrl &&
                    mainWeatherAnimation.getAttribute("src") !== animationUrl
                ) {
                    console.log("Setting new animation:", animationUrl);

                    // Create new player
                    const newPlayer = document.createElement("lottie-player");
                    newPlayer.setAttribute("id", "mainWeatherAnimation");
                    newPlayer.setAttribute("src", animationUrl);
                    newPlayer.setAttribute("background", "transparent");
                    newPlayer.setAttribute("speed", "1");
                    newPlayer.setAttribute(
                        "style",
                        "width: 180px; height: 180px"
                    );
                    newPlayer.setAttribute("loop", "");
                    newPlayer.setAttribute("autoplay", "");

                    // Replace old player
                    mainWeatherAnimation.parentNode.replaceChild(
                        newPlayer,
                        mainWeatherAnimation
                    );
                }
            }
        },

        isDaytime(hour) {
            // 6:00 AM to 5:59 PM (6-17) is day
            // 6:00 PM to 5:59 AM (18-5) is night
            const isDay = hour >= 6 && hour < 18;
            console.log("Time check:", { hour, isDay });
            return isDay;
        },

        formatTime(date) {
            return date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
        },

        formatDay(date) {
            return date.toLocaleDateString("en-US", {
                weekday: "short",
                day: "numeric",
            });
        },

        getWeatherIconCode(weatherId, hour, temperature) {
            const isDay = this.isDaytime(hour);
            const timeOfDay = isDay ? "d" : "n";
            let iconCode = "01" + timeOfDay; // Default to clear sky

            console.log("Getting weather icon:", {
                weatherId,
                hour,
                isDay,
                timeOfDay,
                temperature,
            });

            // Simple weather ID to icon mapping
            if (weatherId >= 200 && weatherId <= 232) {
                // Thunderstorm
                iconCode = "11" + timeOfDay;
            } else if (weatherId >= 300 && weatherId <= 321) {
                // Drizzle - use rain icon
                iconCode = "10" + timeOfDay;
            } else if (weatherId >= 500 && weatherId <= 531) {
                // Rain
                iconCode = "10" + timeOfDay;
            } else if (weatherId >= 600 && weatherId <= 622) {
                // Snow
                iconCode = "13" + timeOfDay;
            } else if (weatherId === 800) {
                // Clear sky
                iconCode = "01" + timeOfDay;
            } else if (weatherId === 801) {
                // Few clouds
                iconCode = "02" + timeOfDay;
            } else if (weatherId === 802) {
                // Scattered clouds
                iconCode = "03" + timeOfDay;
            } else if (weatherId >= 803 && weatherId <= 804) {
                // Broken/overcast clouds
                iconCode = "04" + timeOfDay;
            }

            // Log the final icon selection
            console.log("Selected weather icon:", {
                weatherId,
                hour,
                isDay,
                iconCode,
                hasAnimation: !!WeatherApp.weatherAnimations[iconCode],
            });

            return iconCode;
        },

        updateHourlyForecast(data) {
            if (!WeatherApp.elements.hourlyForecast) return;

            // Get current time
            const now = new Date();
            const currentHour = now.getHours();

            console.log("Updating hourly forecast:", {
                currentHour,
                isDaytime: this.isDaytime(currentHour),
            });

            // Find the forecast that matches our target hour
            const startForecast = data.list.find((forecast) => {
                const forecastTime = new Date(forecast.dt * 1000);
                return forecastTime > now;
            });

            const startIndex = data.list.indexOf(startForecast);

            // Get next 6 forecasts
            const hours = data.list
                .slice(startIndex, startIndex + 6)
                .map((forecast) => {
                    const time = new Date(forecast.dt * 1000);
                    const forecastHour = time.getHours();
                    const temp = Math.round(forecast.main.temp);
                    const weatherId = forecast.weather[0].id;

                    // Get icon code based on forecast hour
                    const iconCode = this.getWeatherIconCode(
                        weatherId,
                        forecastHour,
                        temp
                    );
                    const animationUrl = WeatherApp.weatherAnimations[iconCode];

                    console.log("Forecast hour:", {
                        time: time.toLocaleTimeString(),
                        forecastHour,
                        isDaytime: this.isDaytime(forecastHour),
                        iconCode,
                        hasAnimation: !!animationUrl,
                    });

                    return {
                        time: time.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                        }),
                        temp: `${temp}°`,
                        animationUrl:
                            animationUrl ||
                            WeatherApp.weatherAnimations[
                                "01" +
                                    (this.isDaytime(forecastHour) ? "d" : "n")
                            ],
                    };
                });

            // Update the UI
            WeatherApp.elements.hourlyForecast.innerHTML = hours
                .map(
                    (hour, index) => `
                    <div class="hourly-item animate__animated animate__fadeInUp" style="animation-delay: ${
                        index * 0.1
                    }s">
                        <div class="time">${hour.time}</div>
                        <div class="weather-icon">
                            <lottie-player
                                src="${hour.animationUrl}"
                                background="transparent"
                                speed="1"
                                style="width: 50px; height: 50px"
                                loop
                                autoplay
                            ></lottie-player>
                        </div>
                        <div class="temp">${hour.temp}</div>
                    </div>
                `
                )
                .join("");

            gsap.from(".hourly-item", {
                y: 20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
            });
        },

        updateWeeklyForecast(data) {
            if (!WeatherApp.elements.weeklyForecast) return;

            // Group forecast data by day
            const days = this.groupForecastsByDay(data.list);

            WeatherApp.elements.weeklyForecast.innerHTML = days
                .map((day, index) => {
                    const date = new Date(day.dt * 1000);
                    const weatherId = day.weather[0].id;

                    // Use noon hour for consistent day icons in weekly forecast
                    const noonHour = 12;
                    const iconCode = this.getWeatherIconCode(
                        weatherId,
                        noonHour,
                        day.temp.max
                    );
                    const animationUrl =
                        WeatherApp.weatherAnimations[iconCode] ||
                        WeatherApp.weatherAnimations["01d"];

                    return `
                        <div class="forecast-day animate__animated animate__fadeInRight" style="animation-delay: ${
                            index * 0.1
                        }s">
                            <div class="forecast-date">${date.toLocaleDateString(
                                "en-US",
                                {
                                    weekday: "short",
                                    day: "numeric",
                                }
                            )}</div>
                            <div class="weather-icon">
                                <lottie-player
                                    src="${animationUrl}"
                                    background="transparent"
                                    speed="1"
                                    style="width: 50px; height: 50px"
                                    loop
                                    autoplay
                                ></lottie-player>
                            </div>
                            <div class="forecast-temp">${Math.round(
                                day.temp.max
                            )}°/${Math.round(day.temp.min)}°</div>
                        </div>
                    `;
                })
                .join("");

            gsap.from(".forecast-day", {
                x: 20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
            });
        },

        groupForecastsByDay(forecastList) {
            const days = [];
            const dayMap = new Map();

            forecastList.forEach((forecast) => {
                const date = new Date(forecast.dt * 1000);
                const dayKey = date.toDateString();

                if (!dayMap.has(dayKey)) {
                    dayMap.set(dayKey, {
                        dt: forecast.dt,
                        date: date,
                        temp: {
                            min: forecast.main.temp,
                            max: forecast.main.temp,
                        },
                        weather: forecast.weather,
                    });
                    days.push(dayMap.get(dayKey));
                } else {
                    const dayData = dayMap.get(dayKey);
                    dayData.temp.min = Math.min(
                        dayData.temp.min,
                        forecast.main.temp
                    );
                    dayData.temp.max = Math.max(
                        dayData.temp.max,
                        forecast.main.temp
                    );
                }
            });

            return days;
        },

        getMostFrequentIcon(icons) {
            return icons
                .sort(
                    (a, b) =>
                        icons.filter((v) => v === a).length -
                        icons.filter((v) => v === b).length
                )
                .pop();
        },

        getWeatherAnimation(iconCode) {
            // Map all weather conditions to our working animations
            const baseCode = iconCode.slice(0, 2); // Get the base code without day/night

            switch (baseCode) {
                case "01": // clear sky
                    return WeatherApp.weatherAnimations["01d"]; // Use the clear sky backup
                case "02": // few clouds
                    return WeatherApp.weatherAnimations["02d"]; // url(#__lottie_element_45)
                case "03": // scattered clouds
                    return WeatherApp.weatherAnimations["03d"]; // url(#__lottie_element_17)
                case "04": // broken clouds
                    return WeatherApp.weatherAnimations["04d"]; // url(#__lottie_element_6)
                case "09": // shower rain
                case "10": // rain
                    return WeatherApp.weatherAnimations["10d"]; // rain animation
                case "11": // thunderstorm
                    return WeatherApp.weatherAnimations["11d"]; // thunderstorm animation
                case "13": // snow
                    return WeatherApp.weatherAnimations["13d"]; // snow animation
                case "50": // mist
                    return WeatherApp.weatherAnimations["03d"]; // Use scattered clouds for mist
                default:
                    return WeatherApp.weatherAnimations["01d"]; // Default to clear sky
            }
        },
    },

    // UI Management
    ui: {
        showLoading() {
            if (!WeatherApp.elements.loading) return;
            WeatherApp.elements.loading.style.display = "flex";
        },

        hideLoading() {
            if (!WeatherApp.elements.loading) return;
            WeatherApp.elements.loading.style.display = "none";
        },

        showNotification(title, message) {
            const notification = document.getElementById("notification");
            if (!notification) return;

            // Update notification content
            notification.querySelector(".notification-title").textContent =
                title;
            notification.querySelector(".notification-message").textContent =
                message;

            // Show notification with animation
            notification.classList.add("show");

            // Auto hide after 5 seconds
            setTimeout(() => {
                this.hideNotification();
            }, 5000);
        },

        hideNotification() {
            const notification = document.getElementById("notification");
            if (!notification) return;
            notification.classList.remove("show");
        },

        setupEventListeners() {
            // Theme toggle
            WeatherApp.elements.themeToggle?.addEventListener("click", () => {
                const isDark = document.body.classList.contains("dark-theme");
                WeatherApp.theme.setTheme(!isDark);
            });

            // Weather form
            WeatherApp.elements.weatherForm?.addEventListener(
                "submit",
                async (e) => {
                    e.preventDefault();
                    WeatherApp.ui.showLoading();

                    try {
                        const city =
                            WeatherApp.elements.cityInput?.value ||
                            WeatherApp.config.defaultCity;
                        const data = await WeatherApp.weather.fetchWeather(
                            city
                        );
                        WeatherApp.weather.updateWeatherUI(data);
                    } catch (error) {
                        WeatherApp.ui.showNotification(
                            "City Not Found",
                            "Please check the city name and try again."
                        );
                    } finally {
                        WeatherApp.ui.hideLoading();
                    }
                }
            );

            // Notification close button
            document
                .querySelector(".notification-close")
                ?.addEventListener("click", () => {
                    WeatherApp.ui.hideNotification();
                });

            // Navigation
            document.querySelectorAll(".nav-menu a").forEach((link) => {
                link.addEventListener("click", (e) => {
                    e.preventDefault();
                    document
                        .querySelectorAll(".nav-menu a")
                        .forEach((l) => l.classList.remove("active"));
                    link.classList.add("active");

                    gsap.from(link, {
                        x: -20,
                        opacity: 0,
                        duration: 0.3,
                        ease: "power2.out",
                    });
                });
            });
        },
    },

    // Initialization
    init() {
        // Cache DOM elements
        this.elements = {
            themeToggle: document.getElementById("themeToggle"),
            weatherForm: document.getElementById("weatherForm"),
            loading: document.getElementById("loading"),
            hourlyForecast: document.getElementById("hourlyForecast"),
            weeklyForecast: document.getElementById("weeklyForecast"),
            cityInput: document.getElementById("cityInput"),
        };

        // Initialize theme
        this.theme.init();

        // Setup event listeners
        this.ui.setupEventListeners();

        // Load initial weather data
        if (this.elements.cityInput) {
            this.elements.cityInput.value = this.config.defaultCity;
            this.elements.weatherForm?.dispatchEvent(new Event("submit"));
        }
    },
};

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => WeatherApp.init());

// Add smooth animations when the page loads
document.addEventListener("DOMContentLoaded", () => {
    document.body.style.opacity = "0";
    setTimeout(() => {
        document.body.style.opacity = "1";
    }, 100);
});
