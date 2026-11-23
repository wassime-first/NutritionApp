import {useState, useEffect} from 'react';
import Login from "./Login.jsx";
import axios from "./api/axios.js"
import {Route, Routes, Navigate, useNavigate} from 'react-router-dom';
import ProtectedRout from "./ProtectedRout.jsx";
import Home from "./Home.jsx";
import CircularProgress from '@mui/material/CircularProgress';
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import Calculator from "./Calculator.jsx";
import Add from "./Add.jsx";


function App() {
    // today  date
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    const [date, setDate] = useState(formattedDate);
    //  user and his data
    const [user, setUser] = useState(null);
    //  loading state
    const [loading, setLoading] = useState(true);
    // login state
    const [loggedIn, setLoggedIn] = useState(false);
    // navigate
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("/api/user")
            .then(response => {
                if (response.data.logged_in) {
                    setUser(response.data);
                    setLoggedIn(true);
                }

            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    async function logout() {
        await axios.get('/api/logout')
        setLoggedIn(false)
        setUser(null);
        navigate("/login");

    }

    if (loading) {
        return <CircularProgress aria-label="Loading…"/>;
    }

    return (
        <>

            {user && <NavBar loggedIn={loggedIn}
                             logout={logout}
                             date={date}
                             setDate={setDate}
                             name={user && user.name}

            />}
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to="/home" replace/>}
                />

                <Route
                    path="/home"
                    element={
                        <ProtectedRout user={user}>
                            {user && <Home user={user} date={date} calories={user.calorie_goal}/>}
                        </ProtectedRout>
                    }
                />

                <Route
                    path="/calculator"
                    element={
                        <ProtectedRout user={user}>
                            <Calculator/>
                        </ProtectedRout>
                    }
                />

                <Route
                    path="/add-meal"
                    element={
                        <ProtectedRout user={user}>
                            <Add user={user} date={date}/>
                        </ProtectedRout>
                    }
                />
               <Route path="/login" element={<Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} setUser={setUser}/>}/>
            </Routes>

            <Footer/>
        </>
    );
}

export default App;