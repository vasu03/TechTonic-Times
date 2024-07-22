// Importing the required modules
import React, { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

// Importing the ui components
import { Alert, Button, Textarea } from "flowbite-react";

// Importing custom components
import CommentItem from "./CommentItem";


// Creating the Post Comment Section component
const PostCommentSection = ({ postId }) => {
    // Retrieve current user information from Redux store global state
    const { currentUser } = useSelector((state) => state.user);

    // Some states to handle the comments for a post
    const [commentToAdd, setCommentToAdd] = useState("");
    const [commentToAddError, setCommentToAddError] = useState(null);
    const [getComments, setGetComments] = useState([]);
    const [getCommentError, setGetCommentError] = useState(null);

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
                    content: commentToAdd,
                    postId: postId,
                    userId: currentUser._id
                }),
            });

            // convert the obtained data
            const data = await res.json();

            // If the response is not ok then show error
            if (!res.ok) {
                setCommentToAddError(data.message);
            } else {
                setCommentToAdd("");
                setGetComments([data, ...getComments]);
                toast.success("Comment added!!");
                setCommentToAddError(null);
            }
        } catch (error) {
            setCommentToAddError(error.message);
        }
    }

    // function to handle editting of comment


    // Effect to handle the fetching of comments whenever post changes
    useEffect(() => {
        try {
            // creating a function for fetching comments
            const fetchComments = async () => {
                // get the response from server
                const res = await fetch(`/api/post/getComment/${postId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                });

                // convert the obtained data
                const data = await res.json();

                if (!res.ok) {
                    setGetCommentError(data.message);
                } else {
                    setGetComments(data);
                }
            }

            // call the function for execution
            fetchComments();


        } catch (error) {
            console.log(error.message);
        }
    }, [postId]);


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
                <form onSubmit={handleAddComment} className="flex flex-col items-center justify-center gap-2 my-3 border border-gray-500 dark:border-gray-600 p-2 rounded-lg w-full">
                    <Textarea
                        value={commentToAdd}
                        onChange={(e) => setCommentToAdd(e.target.value)}
                        placeholder="Add a comment..."
                        rows={3}
                        maxLength={200}
                    />
                    <div className="flex items-center justify-between w-full">
                        <p className="text-xs text-gray-500 dark:text-gray-300">{200 - commentToAdd.length} characters remaining</p>
                        <Button size={"xs"} gradientMonochrome="cyan" type="submit" className="self-end rounded-md">Comment</Button>
                    </div>
                    {/* Alert to display updation Failure */}
                    {commentToAddError !== null && (
                        <Alert color="failure" className="mt-5">
                            {commentToAddError}
                        </Alert>
                    )}
                </form>
            )}



            {/* Showing all the comments for a post */}
            {getComments.length > 0 ?
                // Show all the comments
                (
                    <div className="flex flex-col mt-3 overflow-auto sm:px-2">
                        {/* Show no. of comments */}
                        <div className="flex items-center justify-start w-full gap-2 my-2 p-2 text-gray-500 dark:text-gray-300">
                            <p>Comments</p>
                            <div className="flex items-center justify-center rounded-md w-6 h-6 dark:bg-gray-600 bg-gray-200 cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-500">{getComments.length}</div>
                        </div>

                        {/* Show the actual comments */}
                        <div className="px-1 flex flex-col items-center sm:px-3 h-[30rem] overflow-auto">
                            {getComments.map((comment) => (
                                <CommentItem key={comment._id} comment={comment} />
                            ))}
                        </div>
                    </div>
                ) :
                // Else show other content
                (
                    <div className="flex flex-col w-full items-center justify-center gap-1 text-sm text-gray-500 dark:text-gray-300">
                        <p>No comments yet.</p>
                        <p>Be the first one to comment on this post !!</p>
                    </div>
                )}
        </div>
    );
};

// Exporting the component
export default memo(PostCommentSection);