// Imporitng the component
import React, { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import toast from "react-hot-toast";

// Importing ui components & icons
import { HiOutlineHeart, HiHeart } from "react-icons/hi";
import { Button, Textarea } from "flowbite-react";

// Creating the CommentItem component
const CommentItem = ({ comment, handleCommentLikes, handleCommentEdit, handleCommentDelete }) => {
    // Retrieve current user information from Redux store global state
    const { currentUser } = useSelector((state) => state.user);

    // Some states to handle the comments & user data
    const [user, setUser] = useState({});
    const [getUserError, setGetUserError] = useState(null);
    const [isCommentEditable, setIsCommentEditable] = useState(false);
    const [editedCommentContent, setEditedCommentContent] = useState(comment.content);

    // Variables to handle the comments data
    const commentCreatedAt = moment(comment.createdAt).fromNow();

    // Effect to fetch the user data for every comment
    useEffect(() => {
        try {
            // function to fetch the user data
            const fetchUser = async () => {
                // get the response from server
                const res = await fetch(`/api/user/getCommentUser/${comment.userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                });

                // convert the obtained data
                const data = await res.json();

                if (!res.ok) {
                    setGetUserError(data.message);
                } else {
                    setUser(data);
                }
            }

            // calling thr funciton for execution
            fetchUser();
        } catch (error) {
            console.log(error.message);
        }
    }, [comment]);


    // function to handle making the comment editable
    const handleIsCommentEditable = async () => {
        //  and initially set the original content value
        setIsCommentEditable(true);
        setEditedCommentContent(comment.content);
    }

    // function to handle the submission of editted comment
    const handleSubmitEditedComment = async () => {
        try {
            // get the response from server
            const res = await fetch(`/api/post/editComment/${comment._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    content: editedCommentContent
                })
            });

            // convert the obtained data
            const data = await res.json();

            if (!res.ok) {
                setGetUserError(data.message);
            } else {
                setIsCommentEditable(false);
                handleCommentEdit(comment._id, editedCommentContent);
                toast.success("Comment Edited.")
            }
        } catch (error) {
            console.log(error.message);
        }
    }


    // JSX to render the component
    return (
        <div className="w-full flex border-b border-slate-200 dark:border-slate-700 items-start justify-between gap-2 sm:gap-4 mb-3 sm:p-2 px-1 py-2">
            {/* User profile pic */}
            <div className="shrink-0 items-center justify-center sm:flex">
                <img src={user.profilePicture} alt="DP" className="w-10 h-10 sm:w-14 sm:h-14 object-cover rounded-full" />
            </div>

            {/* Details regarding comment */}
            <div className="flex flex-1 flex-col gap-0 justify-center sm:px-2">
                {/* Show the comment data if not in editable mode otherwise let the textarea take the place */}
                {isCommentEditable ?
                    (
                        <>
                            <Textarea
                                value={editedCommentContent}
                                onChange={(e) => setEditedCommentContent(e.target.value)}
                                rows={3}
                                maxLength={200}
                            />
                            <div className="flex items-center justify-between w-full">
                                <p className="text-xs text-gray-500 dark:text-gray-300">{200 - comment.content.length} characters remaining</p>
                                <div className="flex flex-col-reverse sm:flex-row items-center justify-center cursor-pointer">
                                    <Button size={"xs"} onClick={() => setIsCommentEditable(false)} type="button" color={"primary"} className="self-end rounded-md text-red-100 font-light">Cancel</Button>
                                    <Button size={"xs"} onClick={handleSubmitEditedComment} type="button" color={"primary"} className="self-end rounded-md text-cyan-500">Update</Button>
                                </div>
                            </div>
                        </>
                    ) :
                    (
                        <>
                            {/* User name and time of creation and likes */}
                            <div className="w-full flex items-start justify-between mb-2">
                                <div className="flex items-center justify-start gap-2">
                                    <span className="flex flex-1 items-center justify-start font-semibold italic text-sm truncate dark:text-gray-300 text-gray-700">
                                        {user ? `@${user.userName}` : "User"}
                                    </span>
                                    <span className="w-max flex items-center justify-center text-[9px] dark:text-gray-400 text-gray-500 ">
                                        {commentCreatedAt}
                                    </span>
                                </div>
                                <div className="w-max flex items-center justify-center gap-1 text-[10px] dark:text-gray-400 text-gray-500 ">
                                    {comment.numberOfLike}
                                    <button
                                        type="button"
                                        className="bg-transparent flex items-center justify-center"
                                        onClick={() => handleCommentLikes(comment._id)}
                                    >
                                        <HiOutlineHeart
                                            className={`
                                    text-lg 
                                    cursor-pointer
                                        ${currentUser && Array.isArray(comment.likes) &&
                                                comment.likes.includes(currentUser._id) &&
                                                "stroke-red-500 fill-red-500"
                                                }
                                        `}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Content of the comment */}
                            <div className="flex items-start justify-start">
                                <div className="text-sm dark:text-gray-400 text-gray-500">
                                    {comment.content}
                                </div>
                            </div>

                            {/* Btns for performing Edit/Delete action over a comment */}
                            <div className="flex gap-2 mt-2 py-2 items-center justify-start w-max dark:text-gray-400 text-gray-600 text-xs border-t border-slate-200 dark:border-slate-700">
                                {/* Show the Edit comment btn if the user is either admin or author of comment */}
                                {currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                                    <button onClick={handleIsCommentEditable} type="button" className="hover:text-cyan-500">Edit</button>
                                )}
                                {/* Show the Delete comment btn if the user is either admin or author of comment */}
                                {currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                                    <button onClick={() => handleCommentDelete(comment._id)} type="button" className="hover:text-red-400">Delete</button>
                                )}
                            </div>
                        </>
                    )}
            </div>
        </div >
    );
};

// Exporting the component
export default memo(CommentItem);
