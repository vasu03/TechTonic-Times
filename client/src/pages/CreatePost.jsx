// // Importing required modules
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// // Importing Firebase API
// import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";

// // Importing the components
// import { Button, FileInput, Select, TextInput, Alert } from "flowbite-react";

// // Importing the custom components
// import Editor from "../components/TextEditor/Editor";

// // Creating a page for Creating Posts
// const CreatePost = () => {
//     // Initialize the hooks
//     const navigate = useNavigate();

//     // States handling the Image file uploading
//     const [imageFile, setImageFile] = useState(null);
//     const [imageFileUrl, setImageFileUrl] = useState(null);
//     const [imageFileUploading, setImageFileUploading] = useState(null);
//     const [imageFileUploadingError, setImageFileUploadingError] = useState(null);
//     const [imageFileUploadingSuccess, setImageFileUploadingSuccess] = useState(null);

//     // States to manage Post form contents
//     const [formData, setFormData] = useState({});
//     const [postPublishError, setPostPublishError] = useState(null);

//     // Fucntion handling the uploading of image
//     const uploadImage = async () => {
//         if (!imageFile) {
//             setImageFileUploadingError("Please select an Image.");
//             return;
//         }

//         try {
//             setImageFileUploadingError(null);
//             const storage = getStorage();
//             const imgFileName = `${formData.title}-${Date.now()}-${imageFile.name}`;
//             const storageRef = ref(storage, imgFileName);
//             const uploadTask = uploadBytesResumable(storageRef, imageFile);

//             uploadTask.on(
//                 "state_changed",
//                 (snapshot) => {
//                     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//                     setImageFileUploading(progress.toFixed(0));
//                 },
//                 (error) => {
//                     setImageFileUploadingError("Upload failed. Ensure the file is a valid image.");
//                     setImageFileUploading(null);
//                     setImageFile(null);
//                     setImageFileUrl(null);
//                 },
//                 async () => {
//                     const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//                     setImageFileUrl(downloadURL);
//                     setImageFileUploading(null);
//                     setImageFileUploadingError(null);
//                     setImageFileUploadingSuccess("Upload Successful.");
//                     setFormData((prevFormData) => ({ ...prevFormData, image: downloadURL }));
//                     setTimeout(() => setImageFileUploadingSuccess(null), 2000);
//                 }
//             );
//         } catch (error) {
//             console.error(error);
//         }
//     };


//     const handlePostPublish = async (e) => {
//         e.preventDefault();

//         if (!formData.image) {
//             setPostPublishError("Please upload an image before publishing.");
//             return;
//         }

//         try {
//             const res = await fetch("/api/post/createPost", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(formData),
//             });

//             const data = await res.json();

//             if (!res.ok) {
//                 setPostPublishError(data.message);
//             } else {
//                 setPostPublishError(null);
//                 navigate(`/post/${data.slug}`);
//             }
//         } catch (error) {
//             setPostPublishError("Something went wrong.");
//             console.error(error);
//         }
//     };



//     // JSX for rendering the element
//     return (
//         <div className="p-3 max-w-3xl mx-auto min-h-screen">
//             {/* Title of the page */}
//             <h1 className="text-center text-2xl my-5 font-semibold">Create a Post</h1>
//             {/* Form to fill the content of the post */}
//             <form action="" className="flex flex-col gap-4" onSubmit={handlePostPublish}>
//                 {/* Post title and Category container */}
//                 <div className="flex flex-col gap-4 sm:flex-row justify-between">
//                     <TextInput
//                         type="text"
//                         placeholder="Title of Post"
//                         id="title"
//                         className="flex-1"
//                         onChange={
//                             (e) => {
//                                 setPostPublishError(null);
//                                 setFormData({ ...formData, title: e.target.value })
//                             }
//                         }
//                     />
//                     <Select
//                         onChange={
//                             (e) => {
//                                 setPostPublishError(null);
//                                 setFormData({ ...formData, category: e.target.value })
//                             }
//                         }
//                     >
//                         <option value="uncategorized">Select a Category</option>
//                         <option value="html">HTML</option>
//                         <option value="css">CSS</option>
//                         <option value="javascript">Javascript</option>
//                         <option value="nodejs">NodeJS</option>
//                         <option value="reactjs">ReactJS</option>
//                         <option value="mongodb">MongoDB</option>
//                     </Select>
//                 </div>

//                 {/* Image file uploading container */}
//                 <div className="flex flex-col sm:flex-row gap-3 justify-between border-2 rounded-md border-gray-300 dark:border-gray-700 p-3">
//                     <FileInput
//                         type="file"
//                         accept="image/*"
//                         className="flex-auto"
//                         onChange={
//                             (e) => {
//                                 setPostPublishError(null);
//                                 setImageFile(e.target.files[0])
//                             }
//                         }
//                     />
//                     <Button
//                         type="button"
//                         gradientMonochrome="teal"
//                         size="sm"
//                         className="flex-auto flex items-center justify-center"
//                         onClick={uploadImage}
//                     >Upload Image</Button>
//                 </div>

//                 {/* Progress bar to show image upload progress */}
//                 {imageFileUploading !== null && (
//                     <progress value={imageFileUploading} max="100" />
//                 )}
//                 {/* Alert to display image upload error */}
//                 {imageFileUploadingError !== null && (
//                     <Alert color="failure">
//                         {imageFileUploadingError}
//                     </Alert>
//                 )}
//                 {/* Alert to display image upload success */}
//                 {imageFileUploadingSuccess !== null && (
//                     <Alert color="success">
//                         {imageFileUploadingSuccess}
//                     </Alert>
//                 )}
//                 {/* Display the uploaded image */}
//                 {formData.image && (
//                     <img src={formData.image} alt="img" className="w-full h-72 object-cover" />
//                 )}

//                 {/* Text editor to write the content of the Post */}
//                 <Editor onSave={(content) => setFormData({ ...formData, content })} />

//                 {/* Button to trigger the saving of post data to DB */}
//                 {/* <Button type="submit" gradientMonochrome="teal" size="sm" className="mb-5">Publish Post</Button> */}
//                 <Button
//                     type="submit"
//                     gradientMonochrome="teal"
//                     size="sm"
//                     className="mb-5"
//                     disabled={imageFileUploading !== null}
//                 >
//                     {imageFileUploading !== null ? "Uploading..." : "Publish Post"}
//                 </Button>

//             </form>
//             {/* Alert to display post publish error */}
//             {postPublishError && (
//                 <Alert color="failure">
//                     {postPublishError}
//                 </Alert>
//             )}
//         </div>
//     );
// };

// // Exporting the Create Posts page
// export default CreatePost;


// Importing required modules
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Importing Firebase api
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";

// Importing the components
import { Button, FileInput, Select, TextInput, Alert } from "flowbite-react";

// Importing the custom components
import Editor from "../components/TextEditor/Editor";

// Creating a page for Creating Posts
const CreatePost = () => {

    // Initialize the hooks
    const navigate = useNavigate();

    // States handling the Image file uploading
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(null);
    const [imageFileUploadingError, setImageFileUploadingError] = useState(null);
    const [imageFileUploadingSuccess, setImageFileUploadingSuccess] = useState(null);

    // States to manage Post form contents
    const [formData, setFormData] = useState({});
    const [postPublishError, setPostPublishError] = useState(null);


    // Fucntion handling the uploading of image
    const uploadImage = async () => {
        try {
            // Stop if there is no image to upload
            if (!imageFile) {
                setImageFileUploadingError("Please select an Image.");
                return;
            }

            // .If the image exists
            setImageFileUploadingError(null);
            const storage = getStorage();
            const imgFileName = formData.title + "-" + new Date().getTime() + "-" + imageFile.name;
            const storageRef = ref(storage, imgFileName);
            const uploadTask = uploadBytesResumable(storageRef, imageFile);

            // start the upload to firebase storage
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    // Take snapshots as the image is uploading
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageFileUploading(progress.toFixed(0));
                },
                (error) => {
                    // throw the error(if any)
                    setImageFileUploadingError("Upload Failed (Image must be less than 2 MB) or (it must be of type Image)...");
                    setImageFileUploading(null);
                    setImageFile(null);
                    setImageFileUrl(null);
                },
                () => {
                    // Get download URL after successful upload and update the user Record
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageFileUrl(downloadURL);
                        setImageFileUploading(null);
                        setImageFileUploadingError(null);
                        setImageFileUploadingSuccess("Upload Successful.")
                        setFormData({ ...formData, image: downloadURL });

                        // Clear success message after 2 seconds
                        setTimeout(() => {
                            setImageFileUploadingSuccess(null);
                        }, 2000);
                    });
                },
            );
        } catch (error) {
            console.log(error);
        }
    }

    // Funciton to handle the Publishing of Post formData
    const handlePostPublish = async (e) => {
        e.preventDefault();

        if (!formData.image) {
            setPostPublishError("Please upload an image before publishing.");
            return;
        }

        try {
            const res = await fetch("/api/post/createPost", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setPostPublishError(data.message);
            } else {
                setPostPublishError(null);
                navigate(`/post/${data.slug}`);
            }
        } catch (error) {
            setPostPublishError("Something went wrong.");
            console.error(error);
        }
    };


    // JSX for rendering our element
    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            {/* Title of the page */}
            <h1 className="text-center text-2xl my-5 font-semibold">Create a Post</h1>
            {/* Form to fill content of the post */}
            <form action="" className="flex flex-col gap-4" onSubmit={handlePostPublish} >
                {/* Post title and Category container */}
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <TextInput
                        type="text"
                        placeholder="Title of Post"
                        required
                        id="title"
                        className="flex-1"
                        onChange={
                            (e) => {
                                setPostPublishError(null);
                                setFormData({ ...formData, title: e.target.value })
                            }
                        }
                    />
                    <Select
                        onChange={
                            (e) => {
                                setPostPublishError(null);
                                setFormData({ ...formData, category: e.target.value })
                            }
                        }
                    >
                        <option value="uncategorized">Select a Category</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                        <option value="javascript">Javascript</option>
                        <option value="nodejs">NodeJS</option>
                        <option value="reactjs">ReactJS</option>
                        <option value="mongodb">MongoDB</option>
                    </Select>
                </div>

                {/* Image file uploading container */}
                <div className="flex flex-col sm:flex-row gap-3 justify-between border-2 rounded-md border-gray-300 dark:border-gray-700 p-3">
                    <FileInput
                        type="file"
                        accept="image/*"
                        className="flex-auto"
                        onChange={
                            (e) => {
                                setPostPublishError(null);
                                setImageFile(e.target.files[0])
                            }
                        }
                    />
                    <Button
                        type="button"
                        gradientMonochrome="teal"
                        size="sm"
                        className="flex-auto flex items-center justify-center"
                        onClick={uploadImage}
                    >Upload Image</Button>
                </div>

                {/* Progress bar to show image upload progress */}
                {imageFileUploading !== null && (
                    <progress value={imageFileUploading} max="100" />
                )}
                {/* Alert to display image upload error */}
                {imageFileUploadingError !== null && (
                    <Alert color="failure">
                        {imageFileUploadingError}
                    </Alert>
                )}
                {/* Alert to display image upload succes */}
                {imageFileUploadingSuccess !== null && (
                    <Alert color="success">
                        {imageFileUploadingSuccess}
                    </Alert>
                )}
                {/* Display the uploaded image */}
                {formData.image && (
                    <img src={formData.image} alt="img" className="w-full h-72 object-cover" />
                )}

                {/* Text editor to write the content of the Post */}
                {/* <Editor onSave={(content) => setFormData({ ...formData, content })} /> */}

                <Button type="submit" gradientMonochrome="teal" size="sm" className="mb-5">Publish Post</Button>
            </form>
            {/* Alert to display post publish error */}
            {postPublishError !== null && (
                <Alert color="failure">
                    {postPublishError}
                </Alert>
            )}
        </div>
    )
}

// Exporting our Create Posts page
export default CreatePost;