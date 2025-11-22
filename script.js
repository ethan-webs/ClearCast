// ClearCast - Interactive Weather Widget and Dynamic Features

// Weather data simulation (in a real app, this would come from an API)
const weatherData = {
    current: {
        temperature: 72,
        condition: "Light Rain",
        feelsLike: 75,
        humidity: 68,
        precipitationChance: 85,
        icon: "fa-cloud-rain"
    },
    hourly: [
        { time: "Now", temp: 72, icon: "fa-cloud-rain", condition: "Rain" },
        { time: "1PM", temp: 74, icon: "fa-cloud-rain", condition: "Rain" },
        { time: "2PM", temp: 76, icon: "fa-cloud-showers-heavy", condition: "Heavy Rain" },
        { time: "3PM", temp: 78, icon: "fa-cloud-showers-heavy", condition: "Heavy Rain" },
        { time: "4PM", temp: 80, icon: "fa-cloud-sun", condition: "Partly Cloudy" },
        { time: "5PM", temp: 82, icon: "fa-sun", condition: "Sunny" },
        { time: "6PM", temp: 80, icon: "fa-sun", condition: "Sunny" },
        { time: "7PM", temp: 78, icon: "fa-cloud-sun", condition: "Partly Cloudy" },
        { time: "8PM", temp: 76, icon: "fa-cloud", condition: "Cloudy" },
        { time: "9PM", temp: 74, icon: "fa-cloud", condition: "Cloudy" },
        { time: "10PM", temp: 72, icon: "fa-cloud-moon", condition: "Cloudy" },
        { time: "11PM", temp: 70, icon: "fa-moon", condition: "Clear" }
    ]
};

// Alert messages for different weather conditions
const alertMessages = [
    "Thunderstorm warning until 4 PM",
    "Heavy rain expected in 30 minutes",
    "Flash flood watch in effect",
    "Severe weather alert - seek shelter",
    "High wind warning until 6 PM",
    "Heat advisory until 8 PM"
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeWeatherWidget();
    initializeAlertBar();
    initializeAccuracySlider();
    initializeSmoothScrolling();
    startWeatherUpdates();
});

// Weather Widget Functions
function initializeWeatherWidget() {
    updateCurrentWeather();
    updateHourlyForecast();
    updatePrecipitationChance();
}

function updateCurrentWeather() {
    const current = weatherData.current;
    
    // Update current weather display
    document.getElementById('current-temp').textContent = `${current.temperature}°F`;
    document.getElementById('current-condition').textContent = current.condition;
    document.getElementById('feels-like').textContent = `${current.feelsLike}°F`;
    document.getElementById('humidity').textContent = `${current.humidity}%`;
    
    // Update weather icon
    const iconElement = document.getElementById('current-icon');
    iconElement.className = `fas ${current.icon}`;
    
    // Add animation to temperature
    animateTemperature();
}

function updateHourlyForecast() {
    const hourlyContainer = document.getElementById('hourly-forecast');
    hourlyContainer.innerHTML = '';
    
    weatherData.hourly.forEach(hour => {
        const hourElement = document.createElement('div');
        hourElement.className = 'hourly-item';
        hourElement.innerHTML = `
            <div class="hourly-time">${hour.time}</div>
            <div class="hourly-icon">
                <i class="fas ${hour.icon}"></i>
            </div>
            <div class="hourly-temp">${hour.temp}°</div>
        `;
        hourlyContainer.appendChild(hourElement);
    });
}

function updatePrecipitationChance() {
    const chanceElement = document.getElementById('precip-chance');
    const chance = weatherData.current.precipitationChance;
    
    chanceElement.style.width = `${chance}%`;
    
    // Update chance text
    const chanceText = document.querySelector('.chance-text');
    chanceText.textContent = `${chance}% in next hour`;
}

function animateTemperature() {
    const tempElement = document.getElementById('current-temp');
    tempElement.style.transform = 'scale(1.1)';
    setTimeout(() => {
        tempElement.style.transform = 'scale(1)';
    }, 200);
}

// Alert Bar Functions
function initializeAlertBar() {
    updateAlertMessage();
    updateAlertTime();
    
    // Update alert every 2 minutes
    setInterval(updateAlertMessage, 120000);
    setInterval(updateAlertTime, 60000);
}

function updateAlertMessage() {
    const alertElement = document.getElementById('alert-message');
    const randomAlert = alertMessages[Math.floor(Math.random() * alertMessages.length)];
    
    // Add fade effect
    alertElement.style.opacity = '0';
    setTimeout(() => {
        alertElement.textContent = randomAlert;
        alertElement.style.opacity = '1';
    }, 300);
}

function updateAlertTime() {
    const timeElement = document.getElementById('alert-time');
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
    timeElement.textContent = `Updated ${timeString}`;
}

// Accuracy Comparison Slider
function initializeAccuracySlider() {
    const slider = document.getElementById('accuracy-slider');
    const blurryMap = document.querySelector('.comparison-map.blurry');
    const sharpMap = document.querySelector('.comparison-map.sharp');
    
    slider.addEventListener('input', function() {
        const value = this.value;
        
        // Adjust blur based on slider position
        const blurAmount = (100 - value) / 10;
        blurryMap.style.filter = `blur(${blurAmount}px)`;
        
        // Adjust opacity for visual effect
        const opacity = value / 100;
        sharpMap.style.opacity = opacity;
        blurryMap.style.opacity = 1 - (opacity * 0.3);
    });
    
    // Auto-animate slider on page load
    setTimeout(() => {
        animateSlider();
    }, 1000);
}

function animateSlider() {
    const slider = document.getElementById('accuracy-slider');
    let value = 0;
    
    const interval = setInterval(() => {
        value += 2;
        slider.value = value;
        
        // Trigger input event
        slider.dispatchEvent(new Event('input'));
        
        if (value >= 100) {
            clearInterval(interval);
            // Reset to middle position after animation
            setTimeout(() => {
                slider.value = 50;
                slider.dispatchEvent(new Event('input'));
            }, 2000);
        }
    }, 50);
}

// Smooth Scrolling for Navigation
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Weather Updates Simulation
function startWeatherUpdates() {
    // Simulate weather data updates every 5 minutes
    setInterval(() => {
        updateWeatherData();
        updateCurrentWeather();
        updateHourlyForecast();
        updatePrecipitationChance();
    }, 300000); // 5 minutes
}

function updateWeatherData() {
    // Simulate small changes in weather data
    const current = weatherData.current;
    
    // Random temperature variation
    const tempChange = (Math.random() - 0.5) * 4;
    current.temperature = Math.round(current.temperature + tempChange);
    current.feelsLike = Math.round(current.feelsLike + tempChange);
    
    // Random humidity variation
    const humidityChange = (Math.random() - 0.5) * 10;
    current.humidity = Math.max(0, Math.min(100, Math.round(current.humidity + humidityChange)));
    
    // Random precipitation chance variation
    const precipChange = (Math.random() - 0.5) * 20;
    current.precipitationChance = Math.max(0, Math.min(100, Math.round(current.precipitationChance + precipChange)));
    
    // Update hourly data with small variations
    weatherData.hourly.forEach(hour => {
        if (hour.time !== "Now") {
            const tempChange = (Math.random() - 0.5) * 3;
            hour.temp = Math.round(hour.temp + tempChange);
        }
    });
}

// Interactive Features
function addInteractiveEffects() {
    // Add hover effects to benefit cards
    const benefitCards = document.querySelectorAll('.benefit-card');
    benefitCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click effects to testimonial cards
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Initialize interactive effects
document.addEventListener('DOMContentLoaded', addInteractiveEffects);

// Weather Widget Animation on Scroll
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.benefit-card, .testimonial-card, .premium-feature');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', initializeScrollAnimations);

// Mobile Menu Enhancement
function initializeMobileMenu() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });
}

// Initialize mobile menu
document.addEventListener('DOMContentLoaded', initializeMobileMenu);

// Performance Optimization
function optimizePerformance() {
    // Lazy load images (if any are added later)
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', optimizePerformance);

// Error Handling
window.addEventListener('error', function(e) {
    console.error('ClearCast Error:', e.error);
    // In a production app, you might want to send this to an error tracking service
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when service worker is implemented
        // navigator.serviceWorker.register('/sw.js');
    });
}
