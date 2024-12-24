da// Importing required modules
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Importing our custom components
import OAuth from '../components/OAuth/OAuth';

// Creating our SignUp page
const SignUp = () => {

  // Defining the various states
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Funcion to handle the changes in form
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()});
  };

  // Funcion to handle the submission of form
  const handleSubmit = async (e) => {
    e.preventDefault();   // to avoid refresh on submit
    if(!formData.userName || !formData.email || !formData.password){
      return setErrorMessage('Please fill values in all the fields');
    } 
    try {
      setLoading(true);           // start the loading on pressing Submit
      setErrorMessage(null);      // if no error than don't show msg

      const res = await fetch('/api/auth/signUp', {
        method: 'POST',
        headers: { 'Content-type' : 'application/json'},
        body: JSON.stringify(formData)
      });

      // get the data from the server and if there is any error in it then show it
      const data = await res.json();
      if(data.success === false){
        return setErrorMessage(data.message);
      }

      setLoading(false);    // if all set then put the loading state to off

      // if no error in data then redirect to SignIn page
      if(res.ok){
        navigate('/signIn');
      }
      
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    } 
  };


  return (
    <div className='min-h-screen max-w-prose mx-auto mt-8 sm:mt-20 md:max-w-max '>
      <div className='flex flex-col gap-5 max-w-4xl mx-auto p-3 md:flex-row md:items-center'>
        {/* Left Side Container */}
        <div className='flex-1'>
          <Link
            to='/'
            className='self-centered whitespace-nowrap font-bold dark:text-white text-4xl'
          >
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-600'>TechTonic</span>
            <span className='text-transparent bg-clip-text bg-gradient-to-l from-gray-400 to-gray-600 dark:from-orange-300 dark:to-pink-500'> Times</span>
          </Link>
          <p className='mt-3 leading-5 md:pe-14 md:text-justify'>
            <span className='font-semibold'>Welcome to TechToinic Times!</span><br />
            <span className='text-xs md:text-sm'>
              Join Our Community Today and
              always stay updated with the latest in tech trends, insightful articles, and exclusive content by signing up for your TechToinic Times account now.
            </span><br />
          
          </p>
        </div>

        {/* Right Side Conrainer */}
        <div className='flex-1'>
          <form className='flex flex-col gap-y-3' onSubmit={handleSubmit}>
            <div className=''>
              <Label value='Your Username' />
              <TextInput 
                type='text'
                placeholder='Username'
                id='userName'
                onChange={handleChange}
              />
            </div>
            <div className=''>
              <Label value='Your Email' />
              <TextInput 
                type='email'
                placeholder='name@company.com'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div className=''>
              <Label value='Your Password' />
              <TextInput 
                type='password'
                placeholder='Password'
                id='password'
                onChange={handleChange}
              />
            </div>

            <div className='flex flex-col gap-y-2'>
              <Button 
                className='w-full'
                gradientDuoTone='greenToBlue'
                type='submit'
                disabled={loading}
              >
                {
                  loading ? (
                    <>
                      <Spinner size='sm' />
                      <span className='pl-3'>Loading...</span>
                    </>
                    ) : "Sign Up"
                }
              </Button>
              <OAuth />
            </div>
          </form>
          <div className='flex gap-3 text-xs mt-3'>
            <span>Already have an Account ?</span>
            <Link
              to='/signIn'
              className='text-blue-500'
            >
              Sign In
            </Link>
          </div>
          {/* To show alerts */}
          {
            errorMessage && (
              <Alert className='mt-5' color='failure'>
                { errorMessage }
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  )
}

// Exporting the SignUp Page
export default SignUp;