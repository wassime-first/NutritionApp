import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import LogoutIcon from '@mui/icons-material/Logout';
import Drawer from '@mui/material/Drawer';
import {useNavigate} from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import CalculateIcon from '@mui/icons-material/Calculate';

function NavDrawer({setOpenDrawer, userName, openDrawer, logout, loggedIn}) {

    const navigate = useNavigate();

    const DrawerList = (
        <Box sx={{width: 250}} role="presentation" onClick={() => setOpenDrawer(false)}>
            <List>

                <ListItem key="userName" disablePadding onClick={() => navigate("/home")}>
                    <ListItemButton>
                        <ListItemIcon><HomeIcon/></ListItemIcon>
                        <ListItemText primary={userName}/>
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider/>
            <List>

                <ListItem key="calculator" disablePadding onClick={() => navigate("/calculator")}>
                    <ListItemButton>
                        <ListItemIcon>
                            <CalculateIcon/>
                        </ListItemIcon>
                        <ListItemText primary="calculator"/>
                    </ListItemButton>
                </ListItem>
                {loggedIn && <ListItem key="logout" disablePadding onClick={logout}>
                    <ListItemButton>
                        <ListItemIcon>
                            <LogoutIcon color="error"/>
                        </ListItemIcon>
                        <ListItemText sx={{color: "red"}} primary="Logout"/>
                    </ListItemButton>
                </ListItem>}

            </List>
        </Box>
    );


    return (
        <>
            <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
                {DrawerList}
            </Drawer>
        </>
    )
}

export default NavDrawer