import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {useState} from "react";

function NutrimentsProgress({value, user, nType}) {

    const percentage = (value * 100) / user[nType]
    const [color] = useState(nType === "protein" ? "success" :
        nType === "carb" ? "warning" : nType === "calorie_goal" ? "info" : "yellow");

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center',justifyContent: 'center'}}>
            <Box sx={{position: 'relative', display: 'inline-flex'}}>

                {/* background progress */}
                <CircularProgress
                    size={50}
                    thickness={5}
                    variant="determinate"
                    value={100}
                    sx={{color: 'grey', position: 'absolute', inset: '0'}}
                />

                {/*actuall progress*/}
                <CircularProgress size={50} thickness="5"   sx={{
                    color: nType === "fat" && percentage < 100
                        ? "#e61566"
                        : {}
                }} color={percentage < 100 ? color : "error"}
                                  variant="determinate" value={percentage > 100 ? 100 : percentage}/>

                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: "column",
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography sx={{display: "flex", flexDirection: "column", lineHeight: 1, fontSize: "0.6rem",}}
                                variant="caption">

                        {Math.floor(value)} {nType === "calorie_goal" ? "Kcal" : "g"}
                    </Typography>
                </Box>

            </Box>
            <Typography sx={{lineHeight: 1, fontSize: "0.6rem",}} variant="caption">

                {nType === "calorie_goal" ? "cal" : nType}
            </Typography>
        </Box>
    );
}

export default NutrimentsProgress