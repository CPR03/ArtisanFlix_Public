// !This file contains the AdminHome component which is the main page for the admin user. (Unused)

import "./AdminHome.css";
import {useState, useEffect, useRef} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Navbar from "../../Navbar/Nav";

function AdminHome() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [created_by, setCreated] = useState("");
    const [url, setUrl] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef();

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        modalRef.current.close();
    };

    useEffect(() => {
        if (isModalOpen && modalRef.current) {
            modalRef.current.showModal();
        }
    }, [isModalOpen]);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            title: title,
            description: description,
            created_by: created_by,
            url: url,
            thumbnail: thumbnail,
        };

        try {
            const response = await axios.post("https://artisan-flix-api.vercel.app/videos", data);
            console.log(response.data);

            //Close modal after submitting the form
            closeModal();
            // Refresh the page
            //window.location.reload();
        } catch (error) {
            console.error(error);
        }

        // Clear the form
        setTitle("");
        setDescription("");
        setCreated("");
        setUrl("");
        setThumbnail("");
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get("https://artisan-flix-api.vercel.app/auth", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data.user);

                // All data has been loaded and prevent error
                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        // Remove the token from the local storage
        localStorage.removeItem("token");

        // Clear the user state
        setUser(null);

        // Navigate back to the login page
        navigate("/login");
    };

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    return (
        <>
            <Navbar onLogout={handleLogout} user={user} onOpenModal={openModal} />

            {/* Release Video Functionality Modal */}
            {isModalOpen && (
                <dialog ref={modalRef} className="modal">
                    <div className="modal-box flex flex-col justify-center items-center">
                        <h2 className="text-2xl mb-2">Release New Video</h2>

                        <form method="POST" onSubmit={handleSubmit} className="space-y-3 p-6 rounded-lg items-center flex flex-col">
                            <div className="w-full">
                                <label>Title</label>
                                <div className="input input-bordered flex items-center gap-2">
                                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="flex-grow" placeholder="Title" required />
                                </div>
                            </div>

                            <div className="w-full">
                                <label>Description</label>
                                <div>
                                    <textarea type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="textarea textarea-bordered w-[390px]" placeholder="Description" required />
                                </div>
                            </div>

                            <div className="w-full">
                                <label>Created By</label>
                                <div className="input input-bordered flex items-center gap-2">
                                    <input type="text" value={created_by} onChange={(e) => setCreated(e.target.value)} className="grow" placeholder="Created by" required />
                                </div>
                            </div>

                            <div className="w-full">
                                <label>Video URL</label>
                                <div className="input input-bordered flex items-center gap-2">
                                    <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} className="grow" placeholder="https://video.url.here" required />
                                </div>
                            </div>

                            <div className="w-full">
                                <label>Thumbnail URL</label>
                                <div className="input input-bordered flex items-center gap-2">
                                    <input type="text" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} className="grow" placeholder="https://thumbnail.url.here" required />
                                </div>
                            </div>

                            <div className="modal-action">
                                <button type="submit" className="btn btn-accent mr-2">
                                    Release
                                </button>
                                <button type="button" className="btn" onClick={closeModal}>
                                    Close
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>
            )}
        </>
    );
}

export default AdminHome;
