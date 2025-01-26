// Import required modules
import { createSlice } from '@reduxjs/toolkit';

// Creating the initial states for theme Slice
const initialState = {
    theme: "light"      
};

// Creating our themeSlice to create a global state
const themeSlice = createSlice({
    name: 'theme',
    initialState,
    // logic of our slice for the theme
    reducers: {
        // when we have light theme then convert it to dark or else convert to light
        toggleTheme: (state) => {
            state.theme = state.theme === "light" ? "dark" : "light";
        },
    }
});

// exporting our functions/reducers
export const { toggleTheme } = themeSlice.actions;
// exporting our Reducer to have it in our redux-store
export default themeSlice.reducer;