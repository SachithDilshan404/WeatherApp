import axios from 'axios';

const API_KEY = "4094c9efc3d24c74cbc0c5bd38265049"; 
const BASE = "https://api.openweathermap.org/data/2.5"; 

export const fetchCurrent = async (city) => {
    const { data } = await axios.get(`${BASE}/weather`, {
        params: {
            q: city,
            units: "metric",
            appid: API_KEY
        },
    });
    return data;
};

// 5-day/3hour forecast
export const fetchForecast = async (city) => {
    const { data } = await axios.get(`${BASE}/forecast`, {
        params: {
            q: city,
            units: "metric",
            appid: API_KEY
        },
    });
    return data;
};