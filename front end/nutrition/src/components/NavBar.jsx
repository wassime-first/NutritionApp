import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import Date from "../components/Date.jsx"
import MenuIcon from '@mui/icons-material/Menu';
import {useState} from "react";
import NavDrawer from "../components/NavDrawer.jsx";
import HomeIcon from '@mui/icons-material/Home';
import Divider from '@mui/material/Divider';
import CalculateIcon from '@mui/icons-material/Calculate';


function NavBar(props) {


    const navigate = useNavigate();
    const [openDrawer, setOpenDrawer] = useState(false);

    function redirectCalculator() {
        navigate("/calculator");
    }

    async function redirectHome() {
        await navigate("/home")
    }

    return (
        <Box sx={{display: "flex", width: '100%', position: "fixed", top: 1, zIndex: 900}}>
            <AppBar position="static">
                <Toolbar sx={{
                    display: "flex",
                    justifyContent: {xs: "center",sm:"space-between"},
                    alignItems: "center",
                    gap:"1rem"
                }}>
                    <Box sx={{
                        display: {sm:"none"},
                    }}>
                        <IconButton onClick={()=> setOpenDrawer(true)} >
                            <MenuIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{display:{xs:"none", sm:"flex"}, alignItems: "center",gap:"1rem"}}>
                        <IconButton
                            onClick={redirectCalculator}
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"

                        >
                            <CalculateIcon/>
                        </IconButton>

                        <Divider orientation="vertical" variant="middle" flexItem />

                        <Typography onClick={redirectHome} variant="h6" component="div"
                                    sx={{flexGrow: 1, cursor: "pointer",display: "flex",gap:1, alignItems: "center"}}>
                            <HomeIcon/> {props.name}
                        </Typography>

                    </Box>
                    <Date date={props.date} setDate={props.setDate}/>

                    {props.loggedIn ?
                        <Button sx={{
                            display: {xs:"none", sm:"flex"},
                        }} onClick={props.logout} color="error">Logout</Button> : null
                    }

                    <NavDrawer setOpenDrawer={setOpenDrawer}
                               userName={props.name}
                               openDrawer={openDrawer}
                               logout={props.logout}
                               loggedIn={props.loggedIn}
                    />

                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default NavBar