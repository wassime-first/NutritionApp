import {useState, useEffect} from 'react'
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import axios from "./api/axios.js";
import {useNavigate} from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from '@mui/material/Divider';
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Thinking from "../public/images/Thinking.svg"
import Height from "../public/images/heaight.svg"
import Sport from "../public/images/sport.svg"
import Check from "../public/images/check.svg"
import Weight from "../public/images/Weight.svg"
import Time from "../public/images/time.svg"
import Goal from "../public/images/Goal.svg"


function Calculator() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    const [currentDate] = useState(formattedDate);
    const [age, setAge] = useState(1);
    const [weight, setWeight] = useState(80);
    const [height, setHeight] = useState(160);
    const [weightGoal, setWeightGoal] = useState(100);
    const [daysGoal, setDaysGoal] = useState(30);
    const [activity] = useState([
        {
            value: 1.2,
            label: 'Sedentary',
        },
        {
            value: 1.4,
            label: 'Light exercise',
        },
        {
            value: 1.5,
            label: 'Moderate exercise',
        },
        {
            value: 1.7,
            label: 'Very active',
        },
        {
            value: 1.9,
            label: 'Extremely active',
        }
    ]);
    const [selectedActivity,setSelectedActivity] = useState(1.2);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [err, setError] = useState(false);
    const navigate = useNavigate();

    function handleChange(e) {
        const n = e.target.name;
        const value = Number(e.target.value);
        typeof value <= 0 ? setError(true) : setError(false);
        if (!err) {
            if (n === "age") {
                setAge(value)
            } else if (n === "weight") {
                setWeight(value)
            } else if (n === "height") {
                setHeight(value)
            } else if (n === "WeightGoal") {
                setWeightGoal(value)
            }else if (n === "days") {
                setDaysGoal(value)
            }
        }
    }

    const ageImg = Thinking
    const heightImg = Height
    const weightImg =  Weight

    async function handleSubmit(e) {
        let check = step === 1 ? age : step === 2 ? weight :step===3 ? height:step===4 ? weightGoal: step===5 ? daysGoal: selectedActivity ;
        if (check && !err) {
            if (step < 6) {
                setStep(step + 1)
            } else {
                setLoading(true)
                const res = await axios.post("/api/user_data", {
                    age: age,
                    weight: weight,
                    height: height,
                    activity: selectedActivity,
                    weight_goal: weightGoal,
                    days_goal: daysGoal,
                    date: currentDate,

                })
                setLoading(false)
                navigate("/home", {
                    state: {
                        goal: res.data.goal
                    }
                })
            }
        } else {
            setError(true);
        }

    }

    return (
        <>

            <Box
                onKeyDown={async (event) => {
                    if (event.key === "Enter") {
                        event.preventDefault()
                        await handleSubmit()
                    }
                }}
                sx={{
                    borderRadius: 1
                }
                }
            >
                {loading ? <CircularProgress/> :
                    <Card variant="outlined" sx={{
                        maxWidth: {xs: 300, sm: 700},
                    }}>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <CardMedia component="img"
                                       sx={{
                                           width: 150,
                                           height: 150,
                                           my: 5,
                                           borderRadius: 50,
                                           // padding:2,
                                           backgroundColor: "white",

                                       }}
                                       image={step === 1 ? ageImg : step === 2 ? weightImg :step===3 ? heightImg: step===4 ? Goal :step===5 ? Time: Sport}
                                       alt="Age"/>
                            <Divider sx={{width: 200}}>
                                <Chip label={step === 1 ? "Age" : step === 2 ? "Weight" :step===3 ? "Height": step===4 ? "Goal weight":step===5 ? "Days goal": "Activity"} size="small"/>
                            </Divider>
                        </Box>
                        <CardContent sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>

                            { step<=5 ?
                            <TextField type={"number"} slotProps={{
                                htmlInput: {
                                    min: 1,
                                    step: 1
                                }
                            }} required sx={{
                                width: {xs: 300, sm: 500},

                            }}
                                       onChange={handleChange}
                                       name={step === 1 ? "age"
                                           : step === 2 ? "weight"
                                               :step=== 3 ? "height"
                            :step=== 4 ? "weightGoal":"days"}
                                       value={step === 1 ? age
                                           : step === 2 ? weight
                                               : step===3 ? height
                            :step === 4 ? weightGoal
                                                       :  daysGoal}
                                       id="outlined-basic"
                                       label={step === 1 ? "age"
                                           : step === 2 ? "weight (kg)"
                                               :step===3 ?  "height (cm)"
                            :step === 4 ? "Weight goal (kg)"
                                                       : "Days goal"}
                                       error={err}
                                       helperText={err && "Daddy Chill"}
                                       variant="outlined"/>
                                :


                                    <TextField
                                        sx={{ width: {xs: 300, sm: 500} }}
                                        id="outlined-select-currency-native"
                                        select
                                        label="Activity"
                                        onChange={(e) => setSelectedActivity(e.target.value)}
                                        defaultValue={1.2}
                                        slotProps={{
                                            select: {
                                                native: true,
                                            },
                                        }}
                                        helperText="Please select your daily activity"
                                    >
                                        {activity.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </TextField>
                            }



                        </CardContent>
                        <CardActions
                            sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2}}>


                            <Button onClick={handleSubmit} variant="contained">next</Button>

                            {step > 1 &&
                                <Button onClick={() => setStep(step - 1)} variant="contained">previews</Button>
                            }

                        </CardActions>

                    </Card>}


            </Box>
        </>

    )
}

export default Calculator