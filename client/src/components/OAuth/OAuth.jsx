// Importing required modules
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../../firebase";

// Importing global states from Redux-Store
import { useDispatch } from "react-redux";
import { signInSuccess } from "../../redux/user/userSlice"; 

// Exporting our OAuth Button
const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Funciton to handle the OAuth functionality
    const handleGoogleClick = async () => {
        // Setting up the Google Auth
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });     // asks everytime to select a acc
        
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider);
            
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type' : 'application/json' },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL,
                }),
            });

            // get the data from the server and if therer is no error then move further
            const data = await res.json();

            if(res.ok){
               dispatch(signInSuccess(data));
               navigate('/');
            }
        } catch (error) {
            console.log(error);
        }
    }
  
    return (
    <Button 
        type='button' 
        gradientDuoTone='pinkToOrange'
        outline
        onClick={handleGoogleClick} 
        >
        <AiFillGoogleCircle className='w-5 h-5 mr-1'/>
        Continue with Google
    </Button>
  );
};

// Exporting our OAuth Button
export default OAuth;