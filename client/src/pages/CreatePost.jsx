// Importing required modules 
import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";

// Importing UI components from Flowbite
import { Button, FileInput, Select, TextInput, Alert } from "flowbite-react"; 

// Importing custom components
import Editor from "../components/TextEditor/Editor"; 

const CreatePost = () => {
    // Initialize navigate for post-publication redirect
    const navigate = useNavigate(); 

    // State variables to manage file uploads, form data, and editor content
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(null);
    const [imageFileUploadingError, setImageFileUploadingError] = useState(null);
    const [imageFileUploadingSuccess, setImageFileUploadingSuccess] = useState(null);
    const [postPublishError, setPostPublishError] = useState(null);
    const [formData, setFormData] = useState({});
    const [editorContent, setEditorContent] = useState("");

    // Function to upload the image to Firebase Storage
    const uploadImage = async () => {
        if (!imageFile) {
            setImageFileUploadingError("Please select an Image.");
            return;
        }

        try {
            // Reset any previous errors
            setImageFileUploadingError(null); 
            // Get Firebase storage instance
            const storage = getStorage(); 
            // Generate a unique file name
            const imgFileName = `${formData.title || "post"}-${Date.now()}-${imageFile.name}`; 
            // Reference to storage location
            const storageRef = ref(storage, imgFileName);                      
            // Start the upload task 
            const uploadTask = uploadBytesResumable(storageRef, imageFile);    

            // Monitor upload progress
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    // Calculate upload progress
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100; 
                    setImageFileUploading(progress.toFixed(0));     // Update progress in state
                },
                (error) => {
                    setImageFileUploadingError("Upload failed. Ensure the file is a valid image.");
                    setImageFileUploading(null);                    // Reset upload progress
                },
                async () => {
                    // Get the download URL after successful upload
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref); 
                    setImageFileUrl(downloadURL);                                   // Set the image URL in state
                    setImageFileUploading(null);                                    // Reset upload progress
                    setImageFileUploadingError(null);                               // Reset any errors
                    setImageFileUploadingSuccess("Upload Successful.");             // Set success message
                    setFormData((prev) => ({ ...prev, image: downloadURL }));       // Save image URL in formData
                    setTimeout(() => setImageFileUploadingSuccess(null), 2000);     // Reset success message after 2 seconds
                }
            );
        } catch (error) {
            console.error(error); // Log any errors
        }
    };

    // Function to handle the post submission
    const handlePostPublish = async (e) => {
        // Prevent default form submission
        e.preventDefault(); 

        // Merge editorContent into formData before submitting the post
        const finalFormData = { ...formData, content: editorContent };

        try {
            const res = await fetch("/api/post/createPost", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalFormData),
            });

            // Parse the response
            const data = await res.json();          

            if (!res.ok) {
                // Handle errors if post submission fails
                setPostPublishError(data.message);  
            } else {
                setPostPublishError(null);          // Reset error if post is successfully published
                navigate(`/post/${data.slug}`);     // Redirect to the newly created post page
            }
        } catch (error) {
            setPostPublishError("Something went wrong.");
            console.error(error);
        }
    };

    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-center text-2xl my-5 font-semibold">Create a Post</h1>
            <form className="flex flex-col gap-4" onSubmit={handlePostPublish}>
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    {/* Title Input */}
                    <TextInput
                        type="text"
                        placeholder="Title of Post"
                        id="title"
                        className="flex-1"
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })} // Update formData on title change
                        value={formData.title}
                    />
                    {/* Category Select */}
                    <Select
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })} // Update formData on category selection
                        value={formData.category}
                    >
                        <option value="">Select a Category</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                        <option value="javascript">Javascript</option>
                        <option value="nodejs">NodeJS</option>
                        <option value="reactjs">ReactJS</option>
                        <option value="mongodb">MongoDB</option>
                    </Select>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-between border-2 rounded-md border-gray-300 dark:border-gray-700 p-3">
                    {/* Image Upload Section */}
                    <FileInput
                        type="file"
                        accept="image/*"
                        className="flex-auto"
                        onChange={(e) => setImageFile(e.target.files[0])} // Update imageFile state when a file is selected
                    />
                    <Button
                        type="button"
                        gradientMonochrome="teal"
                        size="sm"
                        onClick={uploadImage}
                    >
                        Upload Image
                    </Button>
                </div>

                {/* Display upload progress, errors, or success message */}
                {imageFileUploading && <progress value={imageFileUploading} max="100" />}
                {imageFileUploadingError && <Alert color="failure">{imageFileUploadingError}</Alert>}
                {imageFileUploadingSuccess && <Alert color="success">{imageFileUploadingSuccess}</Alert>}
                
                {/* Display uploaded image */}
                {formData.image && <img src={formData.image} alt="Uploaded" className="w-full h-72 object-cover" />} 

                {/* Text editor for the post content */}
                <Editor
                    initialValue={editorContent}
                    onSave={(content) => setEditorContent(content)} // Update editorContent when the editor saves content
                />

                {/* Submit Button */}
                <Button type="submit" gradientMonochrome="teal" size="sm" disabled={imageFileUploading}>
                    {imageFileUploading ? "Uploading Image..." : "Publish Post"}
                </Button>
            </form>

            {/* Display post publish errors */}
            {postPublishError && <Alert color="failure">{postPublishError}</Alert>}
        </div>
    );
};

// Exporting the CreatePost page
export default CreatePost; 