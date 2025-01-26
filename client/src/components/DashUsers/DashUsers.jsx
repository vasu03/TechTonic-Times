// Importing required modules
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, redirect } from "react-router-dom";
import toast from "react-hot-toast";

// Importing components & icons
import { Button, Modal, Table } from "flowbite-react";
import { HiCheck, HiOutlineExclamationCircle, HiOutlineTrash, HiX } from "react-icons/hi";

// Creating our DashUsers component
const DashUsers = () => {
    // States to handle Userss data
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState("");

    // initializing the React hooks
    const { currentUser } = useSelector((state) => state.user);
    // An effect to be triggered when currentUser.id changes
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Fetch the Users from server
                const res = await fetch("/api/user/getUsers");
                const data = await res.json();
                if (res.ok) {
                    setUsers(data.users);
                }
                if (data.users.length < 9) {
                    setShowMore(false);
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (currentUser.isAdmin) {
            fetchUsers();
        }
    }, [currentUser._id]);

    // Function to handle the Show more Users functionality
    const handleShowMoreUsers = async () => {
        const startIndex = users.length;
        try {
            const res = await fetch(`/api/user/getUsers?startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setUsers((prev) => [...prev, ...data.users]);
                if (data.users.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Fucntion to handle the Deleting of the Users
    const handleDeleteUsers = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
                method: "DELETE"
            });
            const data = res.json();
            if (!res.ok) {
                console.log(error.message);
            } else {
                setUsers((prev) => prev.filter((users) => users._id !== userIdToDelete));
                toast.success("User deleted.");
            }
        } catch (error) {
            console.log(error);
        }
    }

    // JSX to render our component
    return (
        <div className="overflow-auto table-auto Users-table-container">
            {/* Show the Users if the user is admin and Users do exist */}
            {currentUser.isAdmin && users.length > 0 ? (
                <>
                    <Table hoverable className="shadow-md">
                        <Table.Head>
                            <Table.HeadCell>Date Created</Table.HeadCell>
                            <Table.HeadCell>User Image</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                            <Table.HeadCell>User ID</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell>Admin</Table.HeadCell>
                            <Table.HeadCell>Creator</Table.HeadCell>
                            <Table.HeadCell>Actions</Table.HeadCell>
                        </Table.Head>

                        {users.map((user) => (
                            <Table.Body key={user._id} >
                                <Table.Row className="dark:bg-gray-800">
                                    <Table.Cell >{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                                    <Table.Cell>
                                        <img
                                            src={user.profilePicture}
                                            alt={"DP"}
                                            className="w-16 h-16 rounded-full object-cover bg-gray-500"
                                        /> 
                                    </Table.Cell>
                                    <Table.Cell className="flex-col items-center w-max">
                                        <p className="font-medium text-gray-800 dark:text-gray-200">{user.userName}</p>
                                    </Table.Cell>
                                    <Table.Cell>{user._id}</Table.Cell>
                                    <Table.Cell>{user.email}</Table.Cell>
                                    <Table.Cell>
                                        {user.isAdmin ? <HiCheck className="text-green-400 text-2xl" /> : <HiX className="text-red-400 text-2xl" />}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <HiX className="text-red-400 text-2xl" />
                                    </Table.Cell>
                                    <Table.Cell className="flex-col">
                                        <span onClick={() => {
                                            setShowModal(true);
                                            setUserIdToDelete(user._id);
                                        }} className="text-red-400 cursor-pointer mr-3 text-2xl flex items-center justify-start"><HiOutlineTrash /></span>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>

                    {/* Display the Show More button to show rest of the notes */}
                    {showMore && (
                        <button onClick={handleShowMoreUsers} className="w-full text-teal-400 p-3 self-center">
                            Show More
                        </button>
                    )}
                </>
            ) : (<p>Oops!! no Users to show up...</p>)}

            {/* Showing the confirmation modal for Deletion of Users */}
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">Are you sure, you want to delete this User ?</h3>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-3 sm:flex-row">
                        <Button color="failure" onClick={handleDeleteUsers} >Yes, I'm sure</Button>
                        <Button color="gray" onClick={() => setShowPopup(false)} >No, Cancel</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

// Export our component
export default DashUsers