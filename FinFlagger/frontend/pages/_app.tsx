import React, { useState } from 'react';
import type { AppProps } from 'next/app';
// Remove BrowserRouter import
import { ApiProvider } from '../context/ApiContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Pass darkMode and toggleDarkMode as props to all pages
  const enhancedProps = {
    ...pageProps,
    darkMode,
    toggleDarkMode
  };

  return (
    <ApiProvider>
      {/* Remove Router wrapper */}
      <div className={darkMode ? 'dark-mode' : 'light-mode'}>
        <Component {...enhancedProps} />
      </div>
    </ApiProvider>
  );
}

export default MyApp;