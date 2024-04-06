// Importing required modules
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, TextInput } from 'flowbite-react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../../firebase";

// Importing global states from Redux-Store
import { useDispatch, useSelector } from "react-redux";
import { updateStart, updateSuccess, updateFailure } from "../../redux/user/userSlice"; 

// Dashboard Profile component
const DashProfile = () => {
  const dispatch = useDispatch();

  // Retrieve current user information from Redux store global state
  const { currentUser } = useSelector((state) => state.user);

  // States to manage image file and its upload
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(null);
  const [imageFileUploadingError, setImageFileUploadingError] = useState(null);
  const [formData, setFormData] = useState({});
  const [userUpdateSuccess, setUserUpdateSuccess] = useState(null);
  const [userUpdateError, setUserUpdateError] = useState(null);

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
        // Get download URL after successful upload and update the user Record
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setImageFileUploading(null);
          setFormData({ ...formData, profilePicture: downloadURL });
        });
      },
    );
  };

  // Function to handle the change in User info form
  const handleUserFormChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  // Function to handle the submission of the User data form
  const handleUserFormSubmit = async (e) => {
    setUserUpdateSuccess(null);
    setUserUpdateError(null);
    e.preventDefault();
    // If no form data then avoid submission of form
    if(Object.keys(formData).length === 0){
      setUserUpdateError("Nothing new to Update...");
      return;
    }
    // Wait untill the image is uploaded fully
    if(imageFileUploading){
      setUserUpdateError("Please wait for image to be uploaded...");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`api/user/update/${currentUser._id}` , {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
      });

      // Get the data from the response
      const data = await res.json();
      // If there is some error 
      if(!res.ok){
        dispatch(updateFailure(data.message));
        setUserUpdateError(data.message);
      }
      // If no error then procees furthur
      else{
        dispatch(updateSuccess(data));
        setUserUpdateSuccess("Profile updated successfully...");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  };

  // JSX to render the component
  return (
    <div className='max-w-lg mx-auto w-full p-3'>
      <h1 className='my-3 text-center font-medium text-2xl'>Profile</h1>
      {/* Form having all the User details */}
      <form className='flex flex-col gap-3' onSubmit={handleUserFormSubmit}>
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
        <TextInput type='text' id='userName' placeholder='Username' defaultValue={currentUser.userName} onChange={handleUserFormChange}/>
        <TextInput type='email' id='email' placeholder='Email' defaultValue={currentUser.email} onChange={handleUserFormChange}/>
        <TextInput type='password' id='password' placeholder='Password' onChange={handleUserFormChange}/>
        {/* Button to submit form */}
        <Button type='submit' gradientDuoTone='greenToBlue' outline>Update</Button>
      </form>
      {/* Links for account deletion and sign out */}
      <div className="mt-4 text-red-500 text-xs w-full flex items-center justify-between">
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
      {/* Alert to display updation success */}
        {userUpdateSuccess !== null && (
          <Alert color='success' className='mt-5'>
            {userUpdateSuccess}
          </Alert>
        )}
      {/* Alert to display updation Failure */}
        {userUpdateError !== null && (
          <Alert color='failure' className='mt-5'>
            {userUpdateError}
          </Alert>
        )}
    </div>
  );
};

// Exporting our Dashboard Profile component
export default DashProfile;