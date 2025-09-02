const axios = require('axios');

async function testWeatherAPI() {
  try {
    const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
    console.log('API Key exists:', !!API_KEY);
    
    const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: 'London',
        units: 'metric',
        appid: API_KEY
      }
    });
    
    console.log('\n=== RAIN DATA ===');
    console.log('data.rain:', data.rain);
    
    console.log('\n=== SNOW DATA ===');
    console.log('data.snow:', data.snow);
    
    console.log('\n=== WEATHER CONDITIONS ===');
    console.log('Weather main:', data.weather[0]?.main);
    console.log('Weather description:', data.weather[0]?.description);
    
    console.log('\n=== FULL RESPONSE STRUCTURE ===');
    console.log('Available keys:', Object.keys(data));
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testWeatherAPI();
