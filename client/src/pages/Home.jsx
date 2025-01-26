// Importing required modules
import React, { useEffect, useState } from "react";

// Importing custom components
import ArticleCard from "../components/RecentArticles/ArticleCard";

// Importing pre-defined UI components
import { Spinner } from "flowbite-react";

// Creating the Home page
const Home = () => {

	// States to handle the fetching of Recent Articles
	const [isLoading, setIsLoading] = useState(false);
	const [isFetchError, setIsFetchError] = useState(false);
	const [recentArticles, setRecentArticles] = useState(null);

	// An effect that triggers when anything on the homepage changes
	useEffect(() => {
		// function to fetch the Recent Articles data
		const fetchRecentArticles = async () => {
			try {
				setIsLoading(true);
				// get the response from the server
				const res = await fetch(`/api/post/getPost?limit=8`, {
					method: "GET",
				});

				// convert the obtained data 
				const data = await res.json();

				// If the data is not fetched then set the error
				if (!res.ok) {
					setIsFetchError(true);
					setIsLoading(false);
					return;
				} else {
					// grab the first item from the obtained array
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

		// calling the function to fetch data
		fetchRecentArticles();
	}, []);

	// JSX to render the Home page
	return (
		<main className="min-h-screen w-[95%] lg:w-[90%] mx-auto">
			<div className="h-screen">Home Cont</div>

			{/* Recent Article section */}
			<div className="w-full flex flex-col items-center justify-center gap-4 py-6 sm:pb-4 mb-4 border-t border-slate-400 dark:border-slate-400">
				<h1 className="my-4 text-xl sm:text-3xl font-medium text-gra-500 dark:text-gray-300">Latest Articles</h1>
				{!isLoading ? (
					<div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
						{recentArticles && recentArticles.map((article) => (
							<ArticleCard key={article._id} article={article} />
						))}
					</div>
				) : (
					<>
						<Spinner size="sm" />
						<span>Loading...</span>
					</>
				)}
			</div>
		</main>
	);
};

// Export the Home page
export default Home;