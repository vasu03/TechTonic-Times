// Imporitng the component
import React, { useEffect, useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";

// Importing icons
// Importing the Icons
import { HiOutlineHeart, HiHeart } from "react-icons/hi";

// Creating the CommentItem component
const CommentItem = ({ comment, handleCommentLikes }) => {
    // Retrieve current user information from Redux store global state
    const { currentUser } = useSelector((state) => state.user);

    // Some states to handle the comments & user data
    const [user, setUser] = useState([]);
    const [getUserError, setGetUserError] = useState(null);

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

    // JSX to render the component
    return (
        <div className="w-full flex border-b border-slate-200 dark:border-slate-700 items-start justify-between gap-2 sm:gap-4 mb-3 sm:p-2 px-1 py-2">
            {/* User profile pic */}
            <div className="shrink-0 items-center justify-center sm:flex">
                <img src={user.profilePicture} alt="DP" className="w-10 h-10 sm:w-14 sm:h-14 object-cover rounded-full" />
            </div>
            {/* Details regarding comment */}
            <div className="flex flex-1 flex-col gap-0 justify-center sm:px-2">
                {/* User name and time of creation and likes */}
                <div className="w-full flex items-start justify-between">
                    <div className="flex items-center justify-start gap-2">
                        <span className="flex flex-1 items-center justify-start font-semibold italic text-sm truncate dark:text-gray-300 text-gray-700">
                            {user ? `@${user.userName}` : "User"}
                        </span>
                        <span className="w-max flex items-center justify-center text-[9px] dark:text-gray-400 text-gray-500 ">
                            {commentCreatedAt}
                        </span>
                    </div>
                    <div className="w-max flex flex-col-reverse items-center justify-center gap-1 text-[10px] dark:text-gray-400 text-gray-500 ">
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
                <div className="flex flex-col items-start justify-center">
                    <div className="text-sm dark:text-gray-400 text-gray-500">
                        {comment.content}
                    </div>
                    <div className="flex gap-2 mt-2 py-2 items-center justify-center dark:text-gray-400 text-gray-600 text-xs border-t border-slate-200 dark:border-slate-700">
                        <span className="">Edit</span>
                        <span className="">Delete</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Exporting the component
export default CommentItem;
