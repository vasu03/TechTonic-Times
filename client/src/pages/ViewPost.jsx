// Importing required modules
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import moment from "moment";

// Importing ui components
import { Spinner } from "flowbite-react";

// Importing custom components
import PostCommentSection from "../components/PostCommentSection/PostCommentSection";
import ArticleCard from "../components/RecentArticles/ArticleCard";


// Creating the View Post page
const ViewPost = () => {
    // Grab the slug from params
    const { postSlug } = useParams();

    // States to handle fetching post data
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchError, setIsFetchError] = useState(false);
    const [post, setPost] = useState(null);
    const [recentArticles, setRecentArticles] = useState(null);

    // variables to handle fetching post data
    const createdAt = moment(post && post.createdAt).fromNow();
    const updatedAt = moment(post && post.updatedAt).fromNow();

    // An effect to trigger the fetching of post data
    useEffect(() => {
        // function to fetch data
        const fetchPost = async () => {
            try {
                setIsLoading(true);
                // get the response from the server
                const res = await fetch(`/api/post/getPost?slug=${postSlug}`, {
                    method: "GET"
                });

                // convert the obtained data
                const data = await res.json();

                // the data is not fetched then set errors
                if (!res.ok) {
                    setIsFetchError(true);
                    setIsLoading(false);
                    return;
                } else {
                    // grab the first element from obtained array
                    setPost(data.posts[0]);
                    setIsLoading(false);
                    setIsFetchError(false);
                }
            } catch (error) {
                setIsLoading(true);
                setIsFetchError(true);
                console.log(error);
            }
            
        }
        // Calling the function for fetching
        fetchPost();
    }, [postSlug]);

    // An effect to trigger the fetching of recently published articles
    useEffect(() => {
        // function to fetch data
        const fetchRecentArticles = async () => {
            try {
                setIsLoading(true);
                // get the response from the server
                const res = await fetch(`/api/post/getPost?limit=3`, {
                    method: "GET"
                });

                // convert the obtained data
                const data = await res.json();

                // the data is not fetched then set errors
                if (!res.ok) {
                    setIsFetchError(true);
                    setIsLoading(false);
                    return;
                } else {
                    // grab the first element from obtained array
                    setRecentArticles(data.posts);
                    setIsLoading(false);
                    setIsFetchError(false);
                }
            } catch (error) {
                setIsLoading(true);
                setIsFetchError(true);
                console.log(error);
            }
        }
        // Calling the function for fetching
        fetchRecentArticles();
    }, []);
    

    // JSX to render the page
    return (
        <>
            {isLoading ?
                (
                    // Showing the Loader untill data fetched
                    <div className="min-h-screen flex items-center justify-center">
                        <Spinner size={"xl"} className=""></Spinner>
                    </div>
                ) :
                (
                    // Showing the Post when data is fetched
                    <main className="p-3 flex flex-col items-center gap-5 sm:gap-3 max-w-6xl min-h-screen mx-auto ">
                        {/* Show title of Post */}
                        <h2 className="text-3xl sm:text-4xl font-bold text-center sm:p-3">
                            {post && post.title}
                        </h2>

                        {/* Show the category of Post */}
                        <Link to={`/search?category=${post && post.category}`}>
                            <button className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 hover:dark:bg-gray-700 px-3 py-1 rounded-xl">
                                {post && post.category}
                            </button>
                        </Link>

                        {/* Show the Image in th post */}
                        <img
                            src={post && post.image}
                            className="w-full h-[50vw] lg:h-[40vw] object-cover rounded-lg my-4 shadow-md shadow-slate-500 dark:shadow-none"
                            alt={post && post.alt} />

                        {/* Showing the date of post creation & updation */}
                        <div className="w-full sm:px-2 sm:my-4 flex items-center justify-between text-[10px] sm:text-sm italic text-gray-400 border-b border-slate-400 dark:border-slate-700">
                            <p>Published: {createdAt}</p>
                            <p>Updated: {updatedAt}</p>
                        </div>

                        {/* Actual content of post */}
                        <div
                            dangerouslySetInnerHTML={{ __html: post && post.content }}
                            className="w-full mx-auto post-content"></div>

                        {/* Post comment box */}
                        <PostCommentSection postId={post && post._id} />

                        {/* Recent Articles section */}
                        <div className="flex flex-col items-center justify-center gap-4 py-4 sm:p-4 mb-4 border-t border-slate-400 dark:border-slate-700 w-full">
                            <h1 className="text-xl sm:text-2xl font-light text-gray-500 dark:text-gray-300">Recent articles</h1>
                            <div className="flex flex-col sm:flex-row items-start justify-center gap-4">
                                {recentArticles && (
                                        recentArticles.map((article) => (
                                            <ArticleCard key={article._id} article={article} />
                                        ))
                                    )
                                }
                            </div>
                        </div>
                    </main>
                )}
        </>
    );
};

// Exporting the ViewPost page
export default ViewPost;