import PropTypes from "prop-types";
import axios from "axios";
import "./Nav.css";
import {useState, useRef} from "react";
import Stream from "../Stream/Steam";
import logo from "../../public/logo_nav.png";
import emailjs from "@emailjs/browser";

function Navbar(props) {
    const {onLogout, user} = props; // Destructuring props
    const [searchTerm, setSearchTerm] = useState(""); // State for search term
    const formRef = useRef(); // Reference for the form

    const [title, setTitle] = useState(""); // State for title updating
    const [description, setDescription] = useState(""); // State for description updating
    const [created_by, setCreated] = useState(""); // State for creator updating
    const [url, setUrl] = useState(""); // State for URL updating
    const [thumbnail, setThumbnail] = useState(""); // State for thumbnail updating

    const [newName, setNewName] = useState(user.name); // State for new name input
    const [newEmail, setNewEmail] = useState(user.email); // State for new email input
    const [newPassword, setNewPassword] = useState(""); // State for new password input
    const [currPassword, setCurrPassword] = useState(""); // State for new password input

    const [errorMessage, setErrorMessage] = useState(""); // State for error message

    // Handle video submission/release
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
            document.getElementById("release_video_modal_toggle").checked = false;

            // Clear the form after submission
            setTitle("");
            setDescription("");
            setCreated("");
            setUrl("");
            setThumbnail("");

            // !Refresh the page (Unusable in React)
            //window.location.reload();
        } catch (error) {
            console.error(error);
            setErrorMessage(error.response.data.message);
        }
    };

    // Handle profile update
    const handleUpdateProfile = async (e) => {
        e.preventDefault(); // Prevent the default form submission

        // Prepare the data to update
        const data = {
            name: newName,
            email: newEmail,
            currPassword: currPassword,
            password: newPassword,
        };

        try {
            const response = await axios.put(`https://artisan-flix-api.vercel.app/users/${user._id}`, data);

            if (response.status !== 200) {
                throw new Error("Failed to update profile");
            }

            document.getElementById("edit_profile_modal").checked = false;

            // Clear the form after submission
            setNewPassword("");
            setCurrPassword("");
            setErrorMessage("");

            console.log("Profile updated successfully:", response.data);
        } catch (error) {
            console.error("Failed to update profile:", error.response.data.message);
            setErrorMessage(error.response.data.message);
        }
    };

    // Send email using EmailJS
    const sendEmail = (e) => {
        e.preventDefault();
        emailjs.sendForm("service_juuelz6", "template_g6e6kuc", formRef.current, "f02220gT6hIs0NpV9").then(
            (result) => {
                console.log(result.text + `: Email sent successfully!`);
                document.getElementById("my_modal_7").checked = true;
            },
            (error) => {
                console.log(error.text);
            }
        );
    };

    // Clear the form after sending the email
    const clearForm = () => {
        if (formRef.current) {
            formRef.current.reset();
        }
    };

    const clearUpdateProfile = () => {
        setNewPassword("");
        setCurrPassword("");
        setErrorMessage("");
    };

    const clearErrorMessage = () => {
        setErrorMessage("");
    };

    return (
        <>
            {/* Navbar */}
            <div className="navbar bg-base-100 sticky top-0 z-10">
                {/* Logo */}
                <img src={logo} alt="" width={65} />

                {/* Brand Name */}
                <div className="flex-1">
                    <a href="#" className="btn btn-ghost text-xl" onClick={() => setSearchTerm("")}>
                        ArtisanFlix
                    </a>
                </div>

                <div className="flex gap-2">
                    {/* Search Bar */}
                    <div className="form-control">
                        <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>

                    {/* Button */}
                    {user &&
                        (user.role === "admin" ? (
                            // If the user is an admin, show the release video button
                            <label htmlFor="release_video_modal_toggle" className="btn btn-accent xs:hidden sm:flex justify-center items-center">
                                Release New Video
                            </label>
                        ) : (
                            // If the user is not an admin, show the contact us button
                            <label htmlFor="my_modal_6" className="btn btn-accent xs:hidden sm:flex justify-center items-center">
                                Contact Us
                            </label>
                        ))}

                    {/* User Avatar */}
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost avatar">
                            {user && <p>{user.name}</p>}
                        </div>

                        {/* Dropdown Menu */}
                        <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                            {/* Dropdown menu items */}
                            <li>
                                {user &&
                                    (user.role === "admin" ? (
                                        // If the user is an admin, show the release video button
                                        <label htmlFor="release_video_modal_toggle" className="btn btn-accent sm:hidden md:hidden">
                                            Release New Video
                                        </label>
                                    ) : (
                                        // If the user is not an admin, show the contact us button
                                        <>
                                            <label htmlFor="my_modal_6" className="btn btn-accent sm:hidden md:hidden">
                                                Contact Us
                                            </label>

                                            <label htmlFor="edit_profile_modal" className="modal-button">
                                                Edit Profile
                                            </label>
                                        </>
                                    ))}
                            </li>

                            <li>
                                <a onClick={onLogout}>Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Contact Modal */}
            <input type="checkbox" id="my_modal_6" className="modal-toggle" />
            <div className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <form ref={formRef} onSubmit={sendEmail} className="form-control">
                        {/* Modal Title */}
                        <div className="mb-4 text-lg font-bold flex flex-col items-center justify-center">
                            <q className="text-center">Great vision without great people is irrelevant.</q>
                            <p>Lets work together.</p>
                        </div>

                        {/* Enter name */}
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <input type="text" name="user_name" className="input input-bordered w-full mb-4" placeholder="Your name" />

                        {/* Enter email */}
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input type="email" name="user_email" className="input input-bordered w-full mb-4" placeholder="Your email" />

                        {/* Enter message */}
                        <label className="label">
                            <span className="label-text">Message</span>
                        </label>
                        <textarea name="message" className="textarea textarea-bordered h-24 mb-4" placeholder="Input message here." />

                        <div className="modal-action flex justify-end">
                            <input type="submit" value="Send" className="btn btn-primary mr-2" />
                            <label htmlFor="my_modal_6" className="btn btn-ghost" onClick={clearForm}>
                                Close
                            </label>
                        </div>
                    </form>
                </div>
            </div>

            {/* Message Sent Modal */}
            <input type="checkbox" id="my_modal_7" className="modal-toggle" />
            <div className="modal" role="dialog">
                <div className="modal-box">
                    <h3 className="text-lg font-bold mb-3">Message Sent!</h3>
                    <p>Thank you for your feedback.</p>
                    <div className="modal-action justify-end">
                        <label htmlFor="my_modal_7" className="btn btn-ghost">
                            Close
                        </label>
                    </div>
                </div>
            </div>

            {/* Release Video Modal */}
            <input type="checkbox" id="release_video_modal_toggle" className="modal-toggle" />
            <dialog className="modal modal-bottom sm:modal-middle">
                <div className="modal-box flex flex-col justify-center items-center">
                    <h2 className="text-2xl mb-2">Release New Video</h2>

                    <form method="POST" onSubmit={handleSubmit} className="space-y-3 p-6 rounded-lg items-center flex flex-col">
                        {/* Set Video Title */}

                        {errorMessage === "A video with this title and URL already exists!" && <p className="text-error font-bold">{errorMessage}</p>}
                        <div className="w-full">
                            <label>Title</label>
                            <div className={`input input-bordered flex items-center gap-2 ${errorMessage === "A video with this title and URL already exists!" ? "input-error" : "input-bordered"}`}>
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="flex-grow" placeholder="Title" required />
                            </div>
                        </div>

                        {/* Set Video Description */}
                        <div className="w-full">
                            <label>Description</label>
                            <div>
                                <textarea type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="textarea textarea-bordered sm:w-[390px] xs:w-[320px]" placeholder="Description" required />
                            </div>
                        </div>

                        {/* Set Video Creator */}
                        <div className="w-full">
                            <label>Created By</label>
                            <div className="input input-bordered flex items-center gap-2">
                                <input type="text" value={created_by} onChange={(e) => setCreated(e.target.value)} className="grow" placeholder="Created by" required />
                            </div>
                        </div>

                        {/* Set Video URL */}
                        <div className="w-full">
                            <label>Video URL</label>
                            <div className={`input input-bordered flex items-center gap-2 ${errorMessage === "A video with this title and URL already exists!" ? "input-error" : "input-bordered"}`}>
                                <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} className="grow" placeholder="https://video.url.here" required />
                            </div>
                        </div>

                        {/* Set Video Thumbnail */}
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
                            <label htmlFor="release_video_modal_toggle" className="btn" onClick={clearErrorMessage}>
                                Close
                            </label>
                        </div>
                    </form>
                </div>
            </dialog>

            {/* Edit Profile Modal */}
            <input type="checkbox" id="edit_profile_modal" className="modal-toggle" />
            <div className="modal modal-bottom sm:modal-middle" role="dialog">
                <div className="modal-box">
                    <h3 className="text-lg font-bold mb-3">Edit Profile</h3>

                    <form method="PUT" onSubmit={handleUpdateProfile} className="form-control">
                        {/* Edit Name */}
                        <label className="label justify-start">
                            <span className="label-text mr-2">Edit Name</span>
                            {errorMessage === "Username is already taken!" && <p className="label-text text-error font-bold">({errorMessage})</p>}
                        </label>
                        <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className={`input w-full mb-4 ${errorMessage === "Username is already taken!" ? "input-error" : "input-bordered"}`} placeholder="Enter new name" />

                        {/* Edit Email */}
                        <label className="label">
                            <span className="label-text">Edit Email</span>
                        </label>
                        <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="input input-bordered w-full mb-4" placeholder="Enter new email" />

                        {/* Edit Password */}
                        <label className="label">
                            <span className="label-text">Edit Password</span>
                        </label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input input-bordered w-full mb-4" placeholder="Enter new password" />

                        {/* Edit Password */}
                        <label className="label justify-start">
                            <span className="label-text mr-2">Enter Current Password</span>
                            {errorMessage === "Wrong/Empty password input!" && <p className="label-text text-error font-bold">({errorMessage})</p>}
                        </label>
                        <input type="password" value={currPassword} onChange={(e) => setCurrPassword(e.target.value)} className={`input w-full mb-4 ${errorMessage === "Wrong/Empty password input!" ? "input-error" : "input-bordered"}`} placeholder="Enter current password" />

                        <div className="modal-action justify-end">
                            <input type="submit" value="Save" className="btn btn-primary mr-2" />
                            <label htmlFor="edit_profile_modal" className="btn btn-ghost" onClick={clearUpdateProfile}>
                                Close
                            </label>
                        </div>
                    </form>
                </div>
            </div>

            <Stream user={user} searchItem={searchTerm} />
        </>
    );
}

Navbar.propTypes = {
    onLogout: PropTypes.func.isRequired,
    user: PropTypes.any.isRequired,
};

export default Navbar;
