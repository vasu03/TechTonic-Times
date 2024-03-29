// Importing required modules
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from 'redux-persist';
import storage from "redux-persist/lib/storage";

// Importing our Reducers from Custom-Slices
import userReducer from "./user/userSlice";

// Creating a root reducer by combining different reducers
const rootReducer = combineReducers({
    user: userReducer,
});

// Creating a persisting reducer
const persistConfig = {
    key: "root",
    storage,
    version: 1,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Exporting our Redux-Store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

// Exporting our Persisted Store
export const persistor = persistStore(store); 
