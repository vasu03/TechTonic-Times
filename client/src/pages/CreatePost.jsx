// Importing required modules
import React from "react";

// Importing the components
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button, FileInput, Select, TextInput } from "flowbite-react";

// Creating a page for Creating Posts
const CreatePost = () => {
  
    // JSX for rendering our element
    return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
        {/* Title of the page */}
        <h1 className="text-center text-2xl my-5 font-semibold">Create a Post</h1>
        {/* Form to fill content of the post */}
        <form action="" className="flex flex-col gap-4">
            {/* Post title and Category container */}
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
                <TextInput type="text" placeholder="Title of Post" required id="title" className="flex-1"/>
                <Select>
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
                <FileInput type="file" accept="image/*" className="flex-auto" />
                <Button type="button" gradientMonochrome="teal" size="sm" className="flex-auto">Upload Image</Button>
            </div>
            {/* Post body input container */}
            <ReactQuill theme="snow" placeholder="Write something here..." required className="h-72 md:mb-1 border-2 rounded-md border-gray-300 dark:border-gray-700"/>
            <Button type="submit" gradientMonochrome="teal" size="sm">Publish Post</Button>
        </form>
    </div>
  )
}

// Exporting our Create Posts page
export default CreatePost;