// Importing the required modules
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

// Importing the ui components
import { Alert, Button, Textarea } from "flowbite-react";


// Creating the Post Comment Section component
const PostCommentSection = ({ postId }) => {
    // Retrieve current user information from Redux store global state
    const { currentUser } = useSelector((state) => state.user);

    // Some states to handle the comments
    const [comment, setComment] = useState("");
    const [commentError, setCommentError] = useState(null);

    // function to handle the adding of new comments to a post
    const handleAddComment = async (e) => {
        e.preventDefault();
        try {
            // get a response from the server
            const res = await fetch("/api/post/addComment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    content: comment,
                    postId: postId,
                    userId: currentUser._id
                }),
            });

            // convert the obtained data
            const data = await res.json();

            // If the response is not ok then show error
            if (!res.ok) {
                setCommentError(data.message);
            } else{
                setComment("");
                toast.success("Comment added!!");
                setCommentError(null);
            }
        } catch (error) {
            setCommentError(error.message);
        }
    }

    // function to handle editting of comment

    //   JSX to render the component
    return (
        <div className="my-4 py-4 mx-auto sm:px-2 max-w-screen-lg w-full border-t border-slate-400 dark:border-slate-700">
            {/* Show the current user info */}
            {currentUser ?
                (
                    <div className="flex items-center justify-start gap-2 mb-3 text-sm text-gray-500 dark:text-gray-300">
                        <p className="text-base">Signed In as: </p>
                        <img src={currentUser.profilePicture} alt="DP" className="w-8 h-8 object-cover rounded-full " />
                        <Link to={"/dashboard?tab=profile"} className="text-cyan-600 hover:underline hover:underline-offset-2">
                            @{currentUser.userName}
                        </Link>
                    </div>
                ) :
                (
                    <div className="flex flex-col w-full items-center justify-center gap-1 text-sm text-gray-500 dark:text-gray-300">
                        <p>You must be logged in to comment on this post.</p>
                        <Link to={"/signIn"} className="text-cyan-600 hover:underline hover:underline-offset-2">LogIn Here</Link>
                    </div>
                )
            }

            {/* Input for writting the comment */}
            {currentUser && (
                <form onSubmit={handleAddComment} className="flex flex-col items-center justify-center gap-2 w-full">
                    <Textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a comment..."
                        rows={3}
                        maxLength={200}
                    />
                    <div className="flex items-center justify-between w-full">
                        <p className="text-xs text-gray-500 dark:text-gray-300">{200 - comment.length} characters remaining</p>
                        <Button size={"xs"} gradientMonochrome="cyan" type="submit" className="self-end rounded-md">Comment</Button>
                    </div>
                </form>
            )}

            {/* Alert to display updation Failure */}
            {commentError !== null && (
                <Alert color="failure" className="mt-5">
                    {commentError}
                </Alert>
            )}
        </div>
    );
};

// Exporting the component
export default PostCommentSection;