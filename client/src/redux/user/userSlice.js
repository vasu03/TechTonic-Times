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
        },

        // when we start the User update process
        updateStart: (state, action) => {
            state.loading = true;
            state.error = null;
        },

        // If updation is successful
        updateSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },

        // If updation fails
        updateFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // When we start the Deletion process
        deleteStart: (state, action) => {
            state.loading = true;
            state.error = null;
        },

        // If deletion is successful
        deleteSuccess: (state, action) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },

        // If deletion fails
        deleteFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // If the Signout is successful
        signOutSuccess: (state, action) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
    },
});

// exporting our functions/reducers
export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateStart,
  updateSuccess,
  updateFailure,
  deleteStart,
  deleteSuccess,
  deleteFailure,
  signOutSuccess
} = userSlice.actions;

// exporting our Reducer to have it in our redux-store
export default userSlice.reducer;