import React, { createContext, useContext } from "react";

/**
 * @typedef {{
 *   isDark: boolean,
 *   setIsDark: import('react').Dispatch<import('react').SetStateAction<boolean>>
 * }} ThemeContextType
 */

/** @type {import('react').Context<ThemeContextType>} */
const ThemeContext = createContext({
	isDark: true,
	/** @type {import('react').Dispatch<import('react').SetStateAction<boolean>>} */
	setIsDark: (value) => {}, // Accept a boolean or updater function
});

export const ThemeProvider = ThemeContext.Provider;
export const useTheme = () => useContext(ThemeContext);

