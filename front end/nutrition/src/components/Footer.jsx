import Divider from '@mui/material/Divider';
import {useState} from "react";
import Box from "@mui/material/Box";

function Footer() {

    const [year, setYear] = useState(new Date().getFullYear());
    return (
        <footer>
            <Box sx={{maxWidth: 800, marginTop: '2rem'}}>
                <Divider />
                <h5> Wassime Ben c {year}</h5>
            </Box>
        </footer>
    )
}

export default Footer;