// Importing the required modules
import React, { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Importing the ui components & icons
import { Alert, Button, Modal, Textarea } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

// Importing custom components
import CommentItem from "./CommentItem";


// Creating the Post Comment Section component
const PostCommentSection = ({ postId }) => {
    // Hooks to handle the comment data
    const navigateTo = useNavigate();

    // Retrieve current user information from Redux store global state
    const { currentUser } = useSelector((state) => state.user);

    // Some states to handle the comments for a post
    const [commentToAdd, setCommentToAdd] = useState("");
    const [commentToAddError, setCommentToAddError] = useState(null);
    const [getComments, setGetComments] = useState([]);
    const [getCommentError, setGetCommentError] = useState(null);
    const [commentIdToDelete, setCommentIdToDelete] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

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

    // function to handle the like/unlike over a comment
    const handleCommentLikes = async (commentId) => {
        try {
            if (!currentUser) {
                navigateTo("/signIn");
                return;
            }
            // get the response from server
            const res = await fetch(`/api/post/likeComment/${commentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
            });

            // convert the obtained data
            const data = await res.json();

            // update the comments if its ok
            if (res.ok) {
                setGetComments(getComments.map(
                    (comment) => comment._id === commentId ? {
                        ...comment,
                        likes: data.likes,
                        numberOfLike: data.likes.length
                    } : comment
                ))
            }

        } catch (error) {
            console.log(error.message);
        }
    }

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

    // funciton to handle comment data after editting, so all comments can get reftched
    const handleCommentEdit = (commentId, editedCommentContent) => {
        setGetComments((prevComments) =>
            prevComments.map((comment) =>
                comment._id === commentId ? { ...comment, content: editedCommentContent } : comment
            )
        );
    };

    // function to handle the Deleting of the comment
    const handleCommentDelete = async (commentId) => {
        try {
            if (!currentUser) {
                navigateTo("/signIn");
                return;
            }
            // get the response from server
            const res = await fetch(`/api/post/deleteComment/${commentId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
            });

            // convert the obtained data
            const data = await res.json();

            if (!res.ok) {
                toast.error("Can't delete comment. Please try again later.");
            } else {
                // filter the comments we are fetching after deletion
                getComments.map((comment) => {
                    if (comment._id === commentId) {
                        setGetComments(
                            getComments.filter((comment) => comment._id !== commentId)
                        )
                    }
                });
                toast.success("Comment deleted.")
            }
            setShowPopup(false);
        } catch (error) {
            console.log(error.message);
        }
    }



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
                            {
                                getComments && (
                                    getComments.map((comment) => (
                                        <CommentItem
                                            key={comment && comment._id}
                                            comment={comment}
                                            handleCommentLikes={handleCommentLikes}
                                            handleCommentEdit={handleCommentEdit}
                                            handleCommentDelete={(commentId) => {
                                                setShowPopup(true);
                                                setCommentIdToDelete(commentId);
                                            }} />
                                    ))
                                )}
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

            {/* A popup for confirmation while deleting a comment */}
            {showPopup && (
                <Modal show={showPopup} onClose={() => setShowPopup(false)} popup size="md">
                    <Modal.Header />
                    <Modal.Body>
                        <div className="text-center">
                            <HiOutlineExclamationCircle className="w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">Are you sure, you want to delete this comment ?</h3>
                        </div>
                        <div className="flex flex-col justify-center items-center gap-3 sm:flex-row">
                            <Button color="failure" onClick={() => handleCommentDelete(commentIdToDelete)} >Yes, I"m sure</Button>
                            <Button color="gray" onClick={() => setShowPopup(false)} >No, Cancel</Button>

                        </div>
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
};

// Exporting the component
export default memo(PostCommentSection);