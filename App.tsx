import React, { useState } from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { ThemeProvider } from "./context/ThemeContext";
import HomeScreen from "./screens/HomeScreen";
import ForecastScreen from "./screens/ForecastScreen";
import SettingsScreen from "./screens/SettingsScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  const [isDark, setIsDark] = useState(true);

  // Explicit type mapping for icons
  const iconMap: Record<"Home" | "Forecast" | "Settings", string> = {
    Home: "home",
    Forecast: "calendar",
    Settings: "settings",
  };

  return (
    <ThemeProvider value={{ isDark, setIsDark }}>
      <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
              borderTopWidth: 0,
              backgroundColor: isDark ? "#0b0b0d" : "#fafafa",
            },
            tabBarActiveTintColor: isDark ? "#fff" : "#111",
            tabBarIcon: ({ color, size }) => {
              const iconMap: Record<"Home" | "Forecast" | "Settings", keyof typeof Ionicons.glyphMap> = {
                Home: "home",
                Forecast: "calendar",
                Settings: "settings",
              };

              return <Ionicons name={iconMap[route.name as "Home" | "Forecast" | "Settings"]} size={size} color={color} />;
            },

          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Forecast" component={ForecastScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
