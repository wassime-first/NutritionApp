import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import Box from "@mui/material/Box";


function Date({ date,setDate }) {

    const [cDate, setCDate] = useState(dayjs(date));


    return (
        <Box sx={{mx:{xs:0, sm:"5rem"}, cursor: "pointer", display:{xs:'hidden'} }}>
            <LocalizationProvider  dateAdapter={AdapterDayjs}>
                <DatePicker value={cDate}  onChange={(newValue) => {
                    if (newValue && newValue.isValid()) {
                        setCDate(newValue);
                        setDate(newValue.format("YYYY-MM-DD"))
                    }
                }}/>
            </LocalizationProvider>
        </Box>
    )

}

export default Date;