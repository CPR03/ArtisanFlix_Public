import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Registration from "./Registration/Registration.jsx";
import Login from "./Login/Login.jsx";
import Home from "./Home/Home.jsx";
// import AdminHome  from "./Home/AdminHome.jsx";

function App() {
    return (
        <div>
            <Router>
                <div>
                    <Routes>
                        <Route path="/register" element={<Registration />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<Home />} />
                        {/* <Route path="/admin" element={<AdminHome />} /> */}
                    </Routes>
                </div>
            </Router>
        </div>
    );
}

export default App;