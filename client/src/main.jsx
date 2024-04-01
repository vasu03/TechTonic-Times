// Importing required modules
import React from 'react'
import ReactDOM from 'react-dom/client'
import { store, persistor } from "./redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import './index.css'
import App from './App.jsx'
import ThemeProvider from "./components/ThemeProvider/ThemeProvider.jsx";

// Creating a Root element in App
ReactDOM.createRoot(document.getElementById('root')).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </PersistGate>
);