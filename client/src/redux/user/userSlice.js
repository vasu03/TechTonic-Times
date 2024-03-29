// Import required modules
import { createSlice } from '@reduxjs/toolkit';

// Creating the initial states for user Slice
const initialState = {
    currentUser: null,
    error: null,
    loading: false      
};

// Creating our userSlice to create a global state
const userSlice = createSlice({
    name: 'user',
    initialState,
    // logic of our slice for the user
    reducers: {
        // when we start sign-in process
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        // if sign-in is successful
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },

        // if sign-in fails
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    },
});

// exporting our functions/reducers
export const { signInStart, signInSuccess, signInFailure } = userSlice.actions;
// exporting our Reducer to have it in our redux-store
export default userSlice.reducer;