// Importing required modules
import { Button, TextInput } from 'flowbite-react';
import React from 'react';
import { useSelector } from "react-redux";

// Creating our Dashboard profile
const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className='max-w-lg mx-auto w-full p-3'>
      <h1 className='my-3 text-center font-medium text-2xl'>Profile</h1>
      <form className='flex flex-col gap-3'>
        <div className="w-24 h-24 self-center rounded-full">
          <img src={currentUser.profilePicture} alt='img' className='object-cover rounded-full w-full h-full cursor-pointer' style={{boxShadow: "0px 0px 3px 3px #64748b"}}/>
        </div>
        <TextInput type='text' id='userName' placeholder='Username' defaultValue={currentUser.userName} />
        <TextInput type='email' id='email' placeholder='Email' defaultValue={currentUser.email} />
        <TextInput type='password' id='password' placeholder='Password' />
        <Button type='submit' gradientDuoTone='greenToBlue'outline>Update</Button>
      </form>
      <div className="mt-4 text-red-500 text-xs w-full flex items-center justify-between">
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
    </div>
  );
};

// Exporting our Dashboard profile
export default DashProfile;