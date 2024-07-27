// Importing required modules
import React, { memo } from "react";
import { Link } from "react-router-dom";

// Importing ui components & icons
import { HiArrowRight } from "react-icons/hi";


// Creating the ArticleCard component
const ArticleCard = ({ article }) => {


    // JSX to render the component
    return (
        <div className="p-1 rounded-lg group flex flex-col gap-2 
            hover:cursor-pointer hover:scale-95 transition-all duration-500 
            hover:duration-500 border-2 border-gray-200 dark:border-slate-800
            bg-gray-100 dark:bg-slate-800"
        >
            {/* Article image */}
            <Link to={`/post/${article.slug}`} >
                <img
                    src={article.image}
                    alt={article.title}
                    className="object-cover w-full z-[1000] 
                        group-hover:scale-95  group-hover:transition-all 
                        group-hover:duration-500 duration-500 rounded-md" />
            </Link>

            {/* Article informations */}
            <div className="flex flex-col items-center self-center 
                group-hover:px-1  group-hover:transition-all gap-1
                group-hover:duration-500 duration-500" 
            >
                <p className="text-lg line-clamp-2">{article.title}</p>
                <span className="text-xs italic py-[.15rem] px-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-400 dark:border-slate-800">{article.category}</span>
            </div>
            <Link
                to={`/post/${article.slug}`}
                className="flex items-center self-center justify-center gap-2 my-2 text-sm
                    w-full md:w-[50%] text-cyan-500 border border-cyan-500 p-1 rounded-md 
                    group-hover:scale-95 group-hover:transition-all group-hover:duration-500 duration-500
                    group-hover:bg-cyan-500 group-hover:text-gray-50" >
                <span>Read article</span>
                <HiArrowRight />
            </Link>
        </div>
    );
};

// Exporting the component
export default memo(ArticleCard);