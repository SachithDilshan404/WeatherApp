import React, { createContext, useContext } from "react";

type ThemeContextType = {
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  // default accepts the SetStateAction<boolean> shape so assignments are compatible
  setIsDark: (_value: React.SetStateAction<boolean>) => {},
});

export const ThemeProvider = ThemeContext.Provider;
export const useTheme = () => useContext(ThemeContext);
