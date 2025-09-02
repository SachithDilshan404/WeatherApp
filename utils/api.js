import axios from 'axios';

const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY; 
const BASE = "https://api.openweathermap.org/data/2.5"; 

// Custom error class for invalid city names
export class InvalidCityError extends Error {
    constructor(cityName, suggestions = []) {
        super(`City "${cityName}" not found`);
        this.name = 'InvalidCityError';
        this.cityName = cityName;
        this.suggestions = suggestions;
    }
}

// Common city name corrections and suggestions
const getCitySuggestions = (city) => {
    const normalizedCity = city.toLowerCase().trim();
    const suggestions = [];

    // Common misspellings and their corrections
    const commonCorrections = {
        'newyork': 'New York',
        'losangeles': 'Los Angeles',
        'sanfrancisco': 'San Francisco',
        'washingtondc': 'Washington DC',
        'losangelis': 'Los Angeles',
        'london': 'London',
        'paris': 'Paris',
        'tokyo': 'Tokyo',
        'sydney': 'Sydney',
        'mumbai': 'Mumbai',
        'bangalore': 'Bangalore',
        'kolkata': 'Kolkata',
        'chennai': 'Chennai',
        'delhi': 'Delhi',
        'hyderabad': 'Hyderabad',
        'pune': 'Pune',
        'colombo': 'Colombo',
        'kandy': 'Kandy',
        'galle': 'Galle',
        'kuruwita': 'Kuruwita',
        'kuruvita': 'Kuruwita'
    };

    // First, check if we have an exact correction
    if (commonCorrections[normalizedCity]) {
        suggestions.push(commonCorrections[normalizedCity]);
    }

    // Then, check for partial matches
    Object.entries(commonCorrections).forEach(([key, value]) => {
        if (key.includes(normalizedCity) || normalizedCity.includes(key)) {
            if (!suggestions.includes(value)) {
                suggestions.push(value);
            }
        }
    });

    // If no matches found, suggest some popular cities
    if (suggestions.length === 0) {
        suggestions.push('Colombo', 'Kandy', 'Galle', 'London', 'New York', 'Tokyo');
    }

    return suggestions.slice(0, 3); // Return max 3 suggestions
};

export const fetchCurrent = async (city) => {
    try {
        const { data } = await axios.get(`${BASE}/weather`, {
            params: {
                q: city,
                units: "metric",
                appid: API_KEY
            },
        });
        return data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            const suggestions = getCitySuggestions(city);
            throw new InvalidCityError(city, suggestions);
        }
        throw error;
    }
};

// 5-day/3hour forecast
export const fetchForecast = async (city) => {
    try {
        const { data } = await axios.get(`${BASE}/forecast`, {
            params: {
                q: city,
                units: "metric",
                appid: API_KEY
            },
        });
        return data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            const suggestions = getCitySuggestions(city);
            throw new InvalidCityError(city, suggestions);
        }
        throw error;
    }
};