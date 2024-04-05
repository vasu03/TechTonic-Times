// Importing required modules
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from "react-redux";
import { Alert, Button, TextInput } from 'flowbite-react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../../firebase";

// Dashboard Profile component
const DashProfile = () => {
  // Retrieve current user information from Redux store global state
  const { currentUser } = useSelector((state) => state.user);

  // States to manage image file and its upload
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(null);
  const [imageFileUploadingError, setImageFileUploadingError] = useState(null);

  // Reference to file input element
  const filePickerRef = useRef();

  // Function to handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];                   // capture the img from input field
    if (file) {
      setImageFile(file);                             // set the image file to the img captured from input
      setImageFileUrl(URL.createObjectURL(file));     // convert this image file into a url
    }
  }

  // Effect to trigger image upload when imageFile state changes
  useEffect(() => {
    if (imageFile) {
      uploadImage();        // trigger the uploading task
    }
  }, [imageFile]);

  // Function to upload image to Firebase storage
  const uploadImage = async () => {
    setImageFileUploadingError(null);           // set the alert to null every time uploading is triggered
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    // start the upload to firebase storage
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Take snapshots as the image is uploading
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploading(progress.toFixed(0));
      },
      (error) => {
        // throw the error(if any)
        setImageFileUploadingError("Can't upload Image (Image must be less than 2 MB) or (it must be of type Image)...");
        setImageFileUploading(null);
        setImageFile(null);
        setImageFileUrl(null)
      },
      () => {
        // Get download URL after successful upload
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setImageFileUploading(null);
        });
      },
    );
  };

  // JSX to render the component
  return (
    <div className='max-w-lg mx-auto w-full p-3'>
      <h1 className='my-3 text-center font-medium text-2xl'>Profile</h1>
      <form className='flex flex-col gap-3'>
        {/* Input element to select image file */}
        <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />
        {/* Display selected image or current user's profile picture */}
        <div className="w-24 h-24 self-center rounded-full" onClick={() => filePickerRef.current.click()}>
          <img src={imageFileUrl || currentUser.profilePicture} alt='img' className='object-cover rounded-full w-full h-full cursor-pointer' style={{ boxShadow: "0px 0px 3px 3px #64748b" }} />
        </div>
        {/* Progress bar to show image upload progress */}
        {imageFileUploading !== null && (
          <progress value={imageFileUploading} max="100" />
        )}
        {/* Alert to display upload error */}
        {imageFileUploadingError !== null && (
          <Alert color='failure'>
            {imageFileUploadingError}
          </Alert>
        )}
        {/* Text input fields for username, email, and password */}
        <TextInput type='text' id='userName' placeholder='Username' defaultValue={currentUser.userName} />
        <TextInput type='email' id='email' placeholder='Email' defaultValue={currentUser.email} />
        <TextInput type='password' id='password' placeholder='Password' />
        {/* Button to submit form */}
        <Button type='submit' gradientDuoTone='greenToBlue' outline>Update</Button>
      </form>
      {/* Links for account deletion and sign out */}
      <div className="mt-4 text-red-500 text-xs w-full flex items-center justify-between">
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
    </div>
  );
};

// Exporting our Dashboard Profile component
export default DashProfile;