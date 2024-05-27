import "./Home.css";
import {useState, useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Navbar from "../Navbar/Nav";
import Footer from "../Footer/Footer";
import logo from "../../public/logo_nav.png";

function Home() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    // Fetch user data
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
                        Authorization: `Bearer ${token}`, // Send the token in the headers
                    },
                });

                // Set the user data
                setUser(response.data.user);

                // All data has been loaded and prevent error
                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserData();

        const intervalId = setInterval(fetchUserData, 1000);
        return () => clearInterval(intervalId);
    }, [navigate]);

    const handleLogout = () => {
        // Remove the token from the local storage
        localStorage.removeItem("token");

        // Clear the user state
        setUser(null);

        // Navigate back to the login page
        navigate("/login");
    };

    // If the page is still loading
    if (isLoading) {
        return (
            <>
                <div className="flex flex-col justify-center items-center h-screen">
                    <div className="flex flex-col items-center">
                        <img className="mb-3" src={logo} alt="" width={150} />
                        <q className="font-bold">Empowering Creators, Inspiring Viewers.</q>
                    </div>
                    <h1 className="">Page is loading... Please be patient.</h1>
                </div>
            </>
        );
    }

    // If the page has loaded
    return (
        <>
            <Navbar onLogout={handleLogout} user={user} />
            <Footer />
        </>
    );
}

export default Home;
