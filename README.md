# WeatherApp

A modern, feature-rich weather application built with React Native and Expo. Get real-time weather information, forecasts, and enjoy a beautiful glass-morphism UI with dark/light theme support.

![WeatherApp Preview](https://raw.githubusercontent.com/SachithDilshan404/Photos-rep/main/previewimg.jpeg)

## 🌟 Features

### Core Functionality
- **Real-time Weather Data**: Current weather conditions with live updates
- **Location-based Weather**: Automatic location detection using device GPS
- **City Search**: Search for weather in any city worldwide with intelligent suggestions
- **Comprehensive Forecasts**: Hourly and 7-day weather forecasts
- **Interactive Charts**: Visual hourly weather trends using Victory Native

### User Experience
- **Beautiful UI**: Glass-morphism design with smooth animations
- **Dark/Light Theme**: Automatic theme switching with manual toggle
- **Offline Support**: Cached weather data for offline viewing
- **Auto-refresh**: Automatic data updates when online
- **Responsive Design**: Optimized for both portrait and landscape orientations

### Technical Features
- **Cross-platform**: Works on iOS, Android, and Web
- **Fast Performance**: Optimized with React Native Reanimated
- **Data Persistence**: Local storage for offline weather data
- **Error Handling**: Graceful error handling with user-friendly messages
- **Network Awareness**: Automatic online/offline mode switching

## 🚀 Installation

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- For mobile development: Xcode (iOS) or Android Studio (Android)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/SachithDilshan404/WeatherApp.git
   cd WeatherApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy the `.env` file and update the API key:
   ```bash
   cp .env .env.local
   ```
   - Get your free API key from [OpenWeatherMap](https://openweathermap.org/api)
   - Update `.env.local` with your API key:
   ```
   EXPO_PUBLIC_WEATHER_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on your device**
   - For iOS: `npm run ios`
   - For Android: `npm run android`
   - For Web: `npm run web`

## 🔧 Environment Variables

The app uses the following environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `EXPO_PUBLIC_WEATHER_API_KEY` | OpenWeatherMap API key for weather data | Yes |

### Setting up Environment Variables

1. **Create a `.env` file** in the root directory:
   ```bash
   touch .env
   ```

2. **Add your API key**:
   ```
   EXPO_PUBLIC_WEATHER_API_KEY=your_openweathermap_api_key
   ```

3. **Get your API key**:
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Generate an API key in your dashboard
   - Copy the key to your `.env` file

**Note**: Never commit your `.env` file to version control. It's already included in `.gitignore`.

## 📱 Usage

### Basic Usage
1. **Launch the app** on your device or simulator
2. **Allow location permissions** for automatic weather detection
3. **Search for cities** using the search bar at the top
4. **Switch themes** using the toggle in the top-right corner
5. **View forecasts** by tapping the "Forecast" tab

### Offline Mode
- The app automatically caches weather data
- When offline, you'll see cached data with timestamps
- Clear offline data in Settings if needed

### Settings
- **Theme Toggle**: Switch between dark and light modes
- **Connection Status**: View current online/offline status
- **Clear Offline Data**: Remove all cached weather data

## 🏗️ Project Structure

```
WeatherApp/
├── assets/                 # App icons and images
├── components/             # Reusable UI components
│   ├── CurrentWeatherCard.jsx
│   ├── ForecastPills.jsx
│   ├── GlassCard.jsx
│   ├── HourlyChart.jsx
│   ├── MetricTile.jsx
│   ├── SearchBar.jsx
│   └── Toggle.jsx
├── context/                # React context providers
│   └── ThemeContext.tsx
├── hooks/                  # Custom React hooks
│   └── useWeather.js
├── screens/                # Main app screens
│   ├── HomeScreen.jsx
│   ├── ForecastScreen.jsx
│   └── SettingsScreen.jsx
├── utils/                  # Utility functions
│   ├── api.js
│   └── offlineStorage.js
├── App.tsx                 # Main app component
├── app.json                # Expo configuration
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## 🛠️ Technologies Used

### Core Framework
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and build service
- **TypeScript**: Type-safe JavaScript

### UI & Styling
- **React Native Reanimated**: Smooth animations
- **Expo Linear Gradient**: Gradient backgrounds
- **Expo Vector Icons**: Icon library
- **Victory Native**: Charting library

### Data & Networking
- **Axios**: HTTP client for API requests
- **AsyncStorage**: Local data persistence
- **NetInfo**: Network connectivity detection

### Development Tools
- **Expo Location**: Device location services
- **Expo Blur**: Blur effects
- **Babel**: JavaScript transpiler

## 📊 API Integration

This app integrates with the OpenWeatherMap API to provide:
- Current weather conditions
- 5-day weather forecast
- Hourly weather data
- City geocoding and search

**API Endpoints Used:**
- `weather` - Current weather data
- `forecast` - 5-day/3-hour forecast
- `onecall` - Detailed weather data (if needed)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure compatibility with iOS and Android

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons from [Ionicons](https://ionicons.com/)
- UI inspiration from modern weather apps

## 📞 Support

If you have any questions or issues:
- Open an issue on GitHub
- Check the [Expo documentation](https://docs.expo.dev/)
- Review the [React Native documentation](https://reactnative.dev/docs/getting-started)

---

**Made with ❤️ using React Native & Expo**
