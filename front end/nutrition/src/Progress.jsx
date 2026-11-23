import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function Progress({value, currentCal}) {
    return (
        <Box sx={{position: 'relative', display: 'inline-flex'}}>

            {/* background progress */}
            <CircularProgress
                size={150}
                thickness={10}
                variant="determinate"
                value={100}
                sx={{ color: 'grey', position: 'absolute',inset: '0' }}
            />

            {/*actuall progress*/}
            <CircularProgress size={150} thickness="10" color={value < 100 ? "success" : "error"} variant="determinate" value={value}/>

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
                <Typography sx={{display: "flex", flexDirection: "column"}} variant="caption">

                    {currentCal} kcal
                </Typography>
                <Typography variant="caption">

                    {`${Math.round(value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

export default Progress