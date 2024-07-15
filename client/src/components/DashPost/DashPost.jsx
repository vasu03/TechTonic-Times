// Importing required modules
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast"

// Importing components & icons
import { Button, Modal, Table } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";


// Creating our DashPost component
const DashPost = () => {

    // States to handle Posts data
    const [userPost, setUserPost] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState("");

    // initializing the React hooks
    const { currentUser } = useSelector((state) => state.user);

    // An effect to be triggered when currentUser._id changes to fetch the posts
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Fetch the post(response) from server
                const res = await fetch(`/api/post/getPost?userId=${currentUser._id}`);
                
                // Get the data from response
                const data = await res.json();
                
                // if data is fetched successfully then show it
                if (res.ok) {
                    setUserPost(data.posts);
                }

                // displaying the "show more" btn dynamically
                if (data.posts.length < 9) {
                    setShowMore(false);
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (currentUser.isAdmin) {
            fetchPosts();
        }
    }, [currentUser._id]);

    // Function to handle the Show more Post functionality
    const handleShowMorePosts = async () => {
        const startIndex = userPost.length;
        try {
            const res = await fetch(`/api/post/getPost?userId=${currentUser._id}&startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setUserPost((prev) => [...prev, ...data.posts]);
                if (data.posts.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Fucntion to handle the Deleting of the Post
    const handleDeletePost = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`/api/post/deletePost/${postIdToDelete}/${currentUser._id}`, {method: "DELETE"});
            
            const data = res.json();
            if(!res.ok){
                console.log(error.message);
            }else{
                setUserPost( (prev) => prev.filter((post) => post._id !== postIdToDelete) );
                toast.success("Post deleted.");
            }
        } catch (error) {
            console.log(error);
        }
    }

    // JSX to render our component
    return (
        <div className="overflow-auto table-auto post-table-container">
            {/* Show the post if the user is admin and post do exist */}
            {currentUser.isAdmin && userPost.length > 0 ? (
                <>
                    <Table hoverable className="shadow-md">
                        <Table.Head>
                            <Table.HeadCell>Date Updated</Table.HeadCell>
                            <Table.HeadCell>Post Image</Table.HeadCell>
                            <Table.HeadCell>Post Title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                            <Table.HeadCell>Actions</Table.HeadCell>
                        </Table.Head>

                        {userPost.map((post) => (
                            <Table.Body>
                                <Table.Row className="dark:bg-gray-800">
                                    <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/post/${post.slug}`}>
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-20 h-10 object-cover rounded-md bg-gray-500"
                                            />
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell className="flex-col items-center w-max">
                                        <Link to={`/post/${post.slug}`} className="font-medium text-gray-800 dark:text-gray-200">{post.title}</Link>
                                    </Table.Cell>
                                    <Table.Cell>{post.category}</Table.Cell>
                                    <Table.Cell className="flex-col">
                                        <span onClick={() => {
                                            setShowModal(true);
                                            setPostIdToDelete(post._id);
                                        }} className="text-red-400 cursor-pointer mr-3">Delete</span>
                                        <Link to={`/updatePost/${post._id}`}>
                                            <span className="text-teal-400 cursor-pointer">Edit</span>
                                        </Link>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>

                    {/* Display the Show More button to show rest of the notes */}
                    {showMore && (
                        <button onClick={handleShowMorePosts} className="w-full text-teal-400 p-3 self-center">
                            Show More
                        </button>
                    )}
                </>
            ) : (<p>Oops!! no posts to show up...</p>)}

            {/* Showing the confirmation modal for Deletion of Post */}
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <HiOutlineExclamationCircle className="w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto"/>
                <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">Are you sure, you want to delete this Post ?</h3>
              </div>
              <div className="flex flex-col justify-center items-center gap-3 sm:flex-row">
                <Button color="failure" onClick={handleDeletePost} >Yes, I"m sure</Button>
                <Button color="gray" onClick={() => setShowPopup(false)} >No, Cancel</Button>
                
              </div>
            </Modal.Body>
          </Modal>
        </div>
    );
};

// Export our component
export default DashPost