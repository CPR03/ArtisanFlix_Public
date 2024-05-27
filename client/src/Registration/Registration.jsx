import "./Registration.css";
import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function Registration() {
    const [email, setEmail] = useState(""); // Email state
    const [name, setName] = useState(""); // Username/name state
    const [password, setPassword] = useState(""); // Password state

    const [errorMessage, setErrorMessage] = useState(""); // Error message state

    const navigate = useNavigate();

    // Handle the registration form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            email: email,
            name: name,
            password: password,
        };

        try {
            const response = await axios.post("https://artisan-flix-api.vercel.app/users", data);
            console.log(response.data);

            navigate("/login");
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data.error === "Username is already taken!") {
                // Set the error message to state
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage(error.response.data.message);
            }
            console.log(error.response.data.error);
        }
    };

    return (
        <>
            <div className="flex flex-col justify-center items-center h-screen">
                <form method="POST" onSubmit={handleSubmit} className="bgForm flex flex-col w-96 space-y-3 p-6 rounded-lg items-center bg-base-100">
                    <h1 className="text-2xl mb-2 font-bold">Register to ArtisanFlix</h1>

                    { /* Display the error message if username already taken */}
                    {errorMessage && <p className="text-error">{errorMessage}</p>}

                    { /* Enter email */}
                    <label className="input input-bordered flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                        </svg>
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="grow" placeholder="Email" required />
                    </label>

                    { /* Enter username */}
                    <label className={`input flex items-center gap-2 ${errorMessage ? "input-error" : "input-bordered"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                        </svg>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="grow" placeholder="Username" required />
                    </label>

                    { /* Enter password */}
                    <label className="input input-bordered flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                            <path
                                fillRule="evenodd"
                                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="grow" required />
                    </label>

                    <button type="btn" className="btn btn-accent">
                        Register
                    </button>

                    { /* Already have an account? Login here! Part*/}
                    <p className="mt-4 flex flex-col items-center">
                        Already have an account? <br></br>
                        <a href="/login" className="text-blue-500 hover:underline">
                            Login here!
                        </a>
                    </p>
                </form>
            </div>
        </>
    );
}

export default Registration;
