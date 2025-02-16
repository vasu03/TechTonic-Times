import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, FileInput, Select, TextInput, Alert } from "flowbite-react";
import Editor from "../components/TextEditor/Editor";
import { Cloudinary } from "@cloudinary/url-gen";

const CreatePost = () => {
    const navigate = useNavigate();

    // State variables
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [imageFileUploadingError, setImageFileUploadingError] = useState(null);
    const [imageFileUploadingSuccess, setImageFileUploadingSuccess] = useState(null);
    const [postPublishError, setPostPublishError] = useState(null);
    const [formData, setFormData] = useState({});
    const [editorContent, setEditorContent] = useState("");

    const uploadImage = async () => {
        if (!imageFile) {
            setImageFileUploadingError("Please select an Image.");
            return;
        }

        try {
            setImageFileUploadingError(null);
            setImageFileUploading(true);

            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
            const cloudUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

            const formData = new FormData();
            formData.append("file", imageFile);
            formData.append("upload_preset", cloudUploadPreset);


            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();

            if (response.ok) {
                setImageFileUrl(data.secure_url);
                setImageFileUploading(false);
                setImageFileUploadingError(null);
                setImageFileUploadingSuccess("Upload Successful.");
                setFormData((prev) => ({ ...prev, image: data.secure_url }));
                setTimeout(() => setImageFileUploadingSuccess(null), 2000);
            } else {
                setImageFileUploadingError("Upload failed. Ensure the file is a valid image.");
                setImageFileUploading(false);
            }
        } catch (error) {
            setImageFileUploadingError("Something went wrong.");
            setImageFileUploading(false);
            console.error(error);
        }
    };


    // Function to handle the post submission
    const handlePostPublish = async (e) => {
        e.preventDefault();

        const finalFormData = { ...formData, content: editorContent };

        try {
            const res = await fetch("/api/post/createPost", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalFormData),
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
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        value={formData.title}
                    />
                    {/* Category Select */}
                    <Select
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                        onChange={(e) => setImageFile(e.target.files[0])}
                    />
                    <Button
                        type="button"
                        gradientMonochrome="teal"
                        size="sm"
                        onClick={uploadImage}
                        disabled={imageFileUploading}
                    >
                        {imageFileUploading ? "Uploading..." : "Upload Image"}
                    </Button>
                </div>

                {/* Display upload errors or success message */}
                {imageFileUploadingError && <Alert color="failure">{imageFileUploadingError}</Alert>}
                {imageFileUploadingSuccess && <Alert color="success">{imageFileUploadingSuccess}</Alert>}

                {/* Display uploaded image */}
                {formData.image && <img src={formData.image} alt="Uploaded" className="w-full h-72 object-cover" />}

                {/* Text editor for the post content */}
                <Editor
                    initialValue={editorContent}
                    onSave={(content) => setEditorContent(content)}
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

export default CreatePost;