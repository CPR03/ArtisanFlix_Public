import "./Login.css";
import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function Login() {
    const [name, setUsername] = useState(""); // Username/name state
    const [password, setPassword] = useState(""); // Password state
    const [errorMessage, setErrorMessage] = useState(""); // Error message state

    const navigate = useNavigate();

    // Handle the login form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            name: name,
            password: password,
        };

        try {
            const response = await axios.post("https://artisan-flix-api.vercel.app/login", data);
            console.log(response.data);

            // Store the token
            localStorage.setItem("token", response.data.token);

            // Navigate to the home page
            navigate("/");

        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                setErrorMessage(error.response.data.message); // Set the error message
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
        }
    };

    return (
        <>

            <div className="flex flex-col justify-center items-center h-screen">

                { /* Form for Login */ }
                <form method="POST" onSubmit={handleSubmit} className="bgForm flex flex-col w-96 space-y-3 p-6 rounded-lg items-center bg-base-100">
                    <h1 className="text-2xl mb-2 font-bold">Login to ArtisanFlix</h1>

                    {errorMessage && <p className="text-warning">{errorMessage}</p>}

                    <label className="input input-bordered flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                        </svg>
                        <input type="text" value={name} onChange={(e) => setUsername(e.target.value)} className="grow" placeholder="Username" required />
                    </label>

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
                        Login
                    </button>

                    <p className="mt-4 flex flex-col items-center">
                        Do not have an account yet? <br></br>
                        <a href="/register" className="text-blue-500 hover:underline">
                            Register here!
                        </a>
                    </p>
                </form>
            </div>
        </>
    );
}

export default Login;
