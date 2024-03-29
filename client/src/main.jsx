// Importing required modules
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { store, persistor } from "./redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';

// Creating a Root element in App
ReactDOM.createRoot(document.getElementById('root')).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <App />
    </Provider>
  </PersistGate>
);