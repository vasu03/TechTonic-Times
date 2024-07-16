// Importing required modules
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

// Importing Firebase api
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";

// Importing the components
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button, FileInput, Select, TextInput, Alert } from "flowbite-react";

// Creating a page for Updating Posts
const UpdatePost = () => {
    // Initialize the hooks
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user)

    // States handling the Image file uploading
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(null);
    const [imageFileUploadingError, setImageFileUploadingError] = useState(null);
    const [imageFileUploadingSuccess, setImageFileUploadingSuccess] = useState(null);

    // States to manage Post form contents
    const [formData, setFormData] = useState({});
    const [postPublishError, setPostPublishError] = useState(null);
    const { postId } = useParams();

    // Effect to be triggered when the Post ID changes
    useEffect(() => {
        try {
            const fetchPost = async () => {
                const res = await fetch(`/api/post/getPost?postId=${postId}`);
                const data = await res.json();
                if (!res.ok) {
                    console.log(data.message);
                    setPostPublishError(data.message);
                    return;
                }
                if (res.ok) {
                    setPostPublishError(null);
                    setFormData(data.posts[0]);
                }
            };

            fetchPost();
        } catch (error) {
            console.log(error.message);
        }
    }, [postId]);

    // Function handling the uploading of image
    const uploadImage = async () => {
        try {
            // Stop if there is no image to upload
            if (!imageFile) {
                setImageFileUploadingError("Please select an Image.");
                return;
            }

            // If the image exists
            setImageFileUploadingError(null);
            const storage = getStorage();
            const imgFileName = formData.title + "-" + new Date().getTime() + "-" + imageFile.name;
            const storageRef = ref(storage, imgFileName);
            const uploadTask = uploadBytesResumable(storageRef, imageFile);

            // Start the upload to Firebase storage
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    // Take snapshots as the image is uploading
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageFileUploading(progress.toFixed(0));
                },
                (error) => {
                    // Throw the error (if any)
                    setImageFileUploadingError("Update Failed (Image must be less than 2 MB) or (it must be of type Image)...");
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
                        setImageFileUploadingSuccess("Image Updated Successfully.");
                        setFormData((prevData) => ({ ...prevData, image: downloadURL }));

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
    };

    // Function to handle the Publishing of Post formData
    const handlePostPublish = async (e) => {
        e.preventDefault();

        try {
            // Get the response from server by making a request
            const res = await fetch(`/api/post/updatePost/${formData._id}/${currentUser._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            // Convert the data into JSON
            const data = await res.json();

            // If the response is not okay then stop publishing
            if (!res.ok) {
                setPostPublishError(data.message);
                return;
            }
            // If the response is okay then navigate to a specific route
            else if (res.ok) {
                setPostPublishError(null);
                navigate(`/post/${data.slug}`);
                setFormData({});
            }
        } catch (error) {
            console.log(error);
            setPostPublishError("Something went wrong...");
        }
    };

    // Custom toolbar configs for quill
    const modules = {
        syntax: true,
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': [1, 2, 3, false] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [
                { 'color': [] },
                {
                    'background': [
                        'false',
                        '#fef08a', '#fde047', '#facc15',    // red 
                        '#f87171', '#ef4444', '#dc2626',    // yellow
                        '#86efac', '#4ade80', '#22c55e',    // green
                        '#7dd3fc', '#38bdf8', '#0ea5e9',    // skyblue
                        '#6b7280', '#4b5563', '#1f2937',    // gray
                        '#a78bfa', '#8b5cf6', '#7c3aed',    // violet
                    ]
                }
            ],
            [{ 'font': [] }],
            [{ 'align': [] }],
            [{ 'direction': 'rtl' }],
            ['link'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['clean']
        ],
    }

    // JSX for rendering our element
    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            {/* Title of the page */}
            <h1 className="text-center text-2xl my-5 font-semibold">Update a Post</h1>
            {/* Form to fill content of the post */}
            <form action="" className="flex flex-col gap-4" onSubmit={handlePostPublish}>
                {/* Post title and Category container */}
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <TextInput
                        type="text"
                        placeholder="Title of Post"
                        required
                        id="title"
                        className="flex-1"
                        onChange={(e) => {
                            setPostPublishError(null);
                            setFormData((prevData) => ({ ...prevData, title: e.target.value }));
                        }}
                        value={formData.title || ""}
                    />
                    <Select
                        onChange={(e) => {
                            setPostPublishError(null);
                            setFormData((prevData) => ({ ...prevData, category: e.target.value }));
                        }}
                        value={formData.category || "uncategorized"}
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
                        onChange={(e) => {
                            setPostPublishError(null);
                            setImageFile(e.target.files[0]);
                        }}
                    />
                    <Button
                        type="button"
                        gradientMonochrome="teal"
                        size="sm"
                        className="flex-auto flex items-center justify-center"
                        onClick={uploadImage}
                    >
                        Update Image
                    </Button>
                </div>

                {/* Progress bar to show image upload progress */}
                {imageFileUploading !== null && <progress value={imageFileUploading} max="100" />}
                {/* Alert to display image upload error */}
                {imageFileUploadingError !== null && <Alert color="failure">{imageFileUploadingError}</Alert>}
                {/* Alert to display image upload success */}
                {imageFileUploadingSuccess !== null && <Alert color="success">{imageFileUploadingSuccess}</Alert>}
                {/* Display the uploaded image */}
                {formData.image && <img src={formData.image} alt="img" className="w-full h-72 object-cover" />}

                {/* Post body input container */}
                <ReactQuill
                    modules={modules}
                    theme="snow"
                    placeholder="Write something here..."
                    required
                    className="md:mb-1 overflow-auto border-2 rounded-md border-gray-300 dark:border-gray-700"
                    onChange={(value) => {
                        setPostPublishError(null);
                        setFormData((prevData) => ({ ...prevData, content: value }));
                    }}
                    value={formData.content || ""}
                />
                <Button type="submit" gradientMonochrome="teal" size="sm" className="mb-5">
                    Update Post
                </Button>
            </form>
            {/* Alert to display post publish error */}
            {postPublishError !== null && <Alert color="failure">{postPublishError}</Alert>}
        </div>
    );
};

// Exporting our Update Posts page
export default UpdatePost;