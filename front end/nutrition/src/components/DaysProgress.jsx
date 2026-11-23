import * as React from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import {useState} from "react";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 30,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[200],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: '#9FED72',
    },
}));

function DaysProgress({user}) {
    const progress = Math.min((Number(user.days_passed) / Number(user.days_goal)) * 100, 100);

    return (
        <Stack spacing={2} sx={{ flexGrow: 1, my:2 }}>

            <Box sx={{ position: 'relative' }}>
                <Typography  variant="body" sx={{ fontSize:{xs:10,sm:15},display:"flex",gap:1,alignItems:"center" }} color="text.secondary">
                    Days left
                </Typography>
                <BorderLinearProgress
                    variant="determinate"
                    value={progress}
                />

                <Typography
                    sx={{
                        position: 'absolute',
                        top: '70%',
                        left: `50%`,
                        transform: 'translate(-50%, -50%)',
                        fontSize: 10,
                        color: "black"
                    }}
                >
                    {user.days_goal} days
                </Typography>
            </Box>
        </Stack>
    );
}

export default DaysProgress;