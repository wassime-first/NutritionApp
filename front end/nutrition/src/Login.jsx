import {useState} from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import axios from './api/axios.js';
import {useNavigate} from 'react-router-dom';
import CircularProgress from "@mui/material/CircularProgress";
import Paper from '@mui/material/Paper';
import {Typography} from "@mui/material";


function Login({setLoggedIn, setUser, loggedIn}) {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        let n = e.target.name;
        let value = e.target.value;
        if (n === "name") {
            setName(value);
        } else if (n === "email") {
            setEmail(value);
        } else if (n === "password") {
            setPassword(value);
        }

    }

    async function handleSubmit(e) {
        setLoading(true);
        try {

            const response = await axios.post('/api/login', {
                name,
                email,
                password
            })
            if (response.data) {
                setLoggedIn(true)
                setUser(response.data)
                navigate("/home", {
                    state: {
                        goal: response.data.calorie_goal,
                    }
                })

            } else {
                navigate("/login")
            }
        } finally {
            setLoading(false);
        }
    }


    return (
        <main>
            {!loggedIn ?
                <Box
                    sx={{
                        borderRadius: 1
                    }}
                >
                    {loading ? <CircularProgress/> :
                        <Card variant="outlined" sx={{
                            maxWidth: {sm: 700, xs: 300},

                        }}>
                            <CardContent sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Stack spacing={2}>

                                    <TextField sx={{
                                        width: {xs: 250, sm: 500},
                                    }}
                                               onChange={handleChange}
                                               name="name"
                                               value={name}
                                               id="outlined-basic"
                                               label="User Name"
                                               variant="outlined"/>


                                    <TextField
                                        onChange={handleChange}
                                        id="outlined-basic"
                                        label="Email"
                                        variant="outlined"
                                        type="email"
                                        name="email"
                                        value={email}/>


                                    <TextField
                                        onChange={handleChange}
                                        name="password"
                                        value={password}
                                        id="outlined-password-input"
                                        label="Password"
                                        type="password"
                                        autoComplete="current-password"
                                    />
                                    <CardActions>
                                        <Button onClick={handleSubmit} variant="contained">Login</Button>
                                    </CardActions>
                                </Stack>

                            </CardContent>


                        </Card>}


                </Box> :
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        '& > :not(style)': {
                            m: 1,
                            width: 300,
                            height: 300,
                            borderRadius:5
                        },
                    }}
                >

                    <Paper sx={{display:"flex",flexFlow:"column", justifyContent:"center", alignContent:"center",alignItems:"center"}} elevation={3} >

                        <Typography sx={{my:3}} >

                            You're already logged in!
                        </Typography>
                        <Button onClick={()=> navigate("/home")} color="success" variant="contained">Go home</Button>
                    </Paper>
                </Box>
            }
        </main>
    )
}

export default Login