import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';


export default function NutrimentsCalculator({cal,protein,carb,fat}) {
    return (
        <Box sx={{ width: '100%' }}>
            <Stack sx={{color:"black"}} spacing={2}>
                <Box sx={{borderRadius:1,px:1,backgroundColor:"orange",width:{xs: 180, sm: 300}, display: "flex", justifyContent: "space-between"}}>
                    <Typography variant="body" component="h5">
                        calorie:
                    </Typography>
                    <Typography variant="body" component="h5">
                        {cal}Kcal
                    </Typography>
                </Box>
                <Box sx={{ borderRadius: 1, px: 1, backgroundColor: "#90FF1A", width:{xs: 180, sm: 300}, display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body" component="h5">
                        protein:
                    </Typography>
                    <Typography variant="body" component="h5">
                        {protein}g
                    </Typography>
                </Box>
                <Box sx={{ borderRadius: 1, px: 1, backgroundColor: "#60C1E5",width:{xs: 180, sm: 300}, display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body" component="h5">
                        fat:
                    </Typography>
                    <Typography variant="body" component="h5">
                        {fat}g
                    </Typography>
                </Box>
                <Box sx={{ borderRadius: 1, px: 1, backgroundColor: "#ff1a1e", width:{xs: 180, sm: 300}, display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body" component="h5">
                        carb:
                    </Typography>
                    <Typography  variant="body" component="h5">
                        {carb}g
                    </Typography>
                </Box>
            </Stack>
        </Box>
    );
}