// Importing required modules
import { Button, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../../firebase";

// Creating our Dashboard profile
const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [ imageFile, setImageFile ] = useState(null);
  const [ imageFileUrl, setImageFileUrl ] = useState(null);
  const [ imageFileUploading, setImageFileUploading ] = useState(null);
  const [ imageFileUploadingError, setImageFileUploadingError ] = useState(null);
  console.log(imageFileUploading, imageFileUploadingError);

  console.log();

  const filePickerRef = useRef();

  // Funciton to handle uploading the image of user
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file){
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  }

  useEffect(() => {
    if(imageFile){
      uploadImage();
    }
  }, [imageFile] );
  const uploadImage = async () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef =  ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes ) * 100;
        setImageFileUploading(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadingError(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
          setImageFileUrl(downloadURL);
        });
      },
    );
  }


  return (
    <div className='max-w-lg mx-auto w-full p-3'>
      <h1 className='my-3 text-center font-medium text-2xl'>Profile</h1>
      <form className='flex flex-col gap-3'>
        <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden/>
        <div className="w-24 h-24 self-center rounded-full" onClick={() => filePickerRef.current.click()}>
          <img src={imageFileUrl || currentUser.profilePicture} alt='img' className='object-cover rounded-full w-full h-full cursor-pointer' style={{boxShadow: "0px 0px 3px 3px #64748b"}}/>
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