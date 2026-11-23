import {useLocation, useNavigate} from "react-router-dom";
import Card from "./Card.jsx";
import Box from "@mui/material/Box";
import {useEffect, useState} from "react";
import axios from "axios";
import Progress from "./Progress.jsx";
import Paper from "@mui/material/Paper";
import Snoring from "../src/assets/sounds/YTDown.com_Shorts_Media_V4ibUx_Vg28_Snoring-meme-tiktok_007_48k.m4a"
import {Typography} from "@mui/material";
import NutrimentsProgress from "./components/NutrimentsProgress.jsx";
import Button from "@mui/material/Button";
import DaysProgress from "./components/DaysProgress.jsx";
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import TodayIcon from '@mui/icons-material/Today';
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';
import CalculateIcon from '@mui/icons-material/Calculate';

function Home(props) {

    const [loading, setLoading] = useState(false);
    const [mealId, setMealId] = useState("");
    const [meals, setMeals] = useState([]);
    const categories = ["breakfast", "lunch", "dinner"];
    const {state} = useLocation();
    const goal = state?.goal || props.calories;
    const [currentCal, setCurrentCal] = useState(0);
    const snoring = new Audio(Snoring);
    const navigate = useNavigate();

    const all = meals.reduce((sum, meal) => ({
        fat: sum.fat + Number(meal.fat || 0),
        carb: sum.carb + Number(meal.carb || 0),
        protein: sum.protein + Number(meal.protein || 0),
        cal: sum.cal + Number(meal.calories || 0)
    }), {
        fat: 0,
        carb: 0,
        protein: 0,
        cal: 0
    });

    useEffect(() => {
        axios.get("/api/meals", {params: {date:props.date}})
            .then(res => {
                setMeals(res.data);
                let cals = 0
                res.data.forEach((meal) => {
                    cals += Number(meal.calories)
                })
                setCurrentCal(cals)

            })
    }, [props.date])

    async function handleDelete(id) {
        snoring.currentTime = 4
        await snoring.play()
        setLoading(true);
        setMealId(id);
        try {
            const res = await axios.post("/api/delete-meal", {
                id: id,
                meals
            });


            setMeals(res.data);
            setLoading(false);
            setMealId("")
            let cals = 0
            res.data.forEach((meal) => {
                cals += Number(meal.calories)
            })
            setCurrentCal(cals)

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <main>
            {goal ? (
                <Paper
                    elevation={2}
                    sx={{
                        mb: 2,
                        borderRadius: 3,
                        overflow: "hidden",
                        padding: "10px",
                        width: {xs:300, sm:500},
                        flexGrow: 1,
                    }}
                >
                    <Box>
                        <Box sx={{
                            float: "right",
                        }}>
                            <Progress currentCal={currentCal}
                                      value={goal > 0  ? Math.min(100, (currentCal / goal) * 100) : 0}/>
                        </Box>
                        <Box>

                            <DaysProgress user={props.user} />
                            <Typography  variant="body" sx={{ fontSize:{xs:10,sm:15},display:"flex",gap:1,alignItems:"center" }} color="text.secondary">
                               <ModeStandbyIcon/> Daily calories {goal} kcal
                            </Typography>
                            <br/>
                            <Typography variant="body" sx={{ fontSize:{xs:10,sm:15},display:"flex",gap:1,alignItems:"center"   }} color="text.secondary">
                                <TodayIcon/> Target Date {props.user.target_date}
                            </Typography>
                            <br/>
                            <Typography variant="body" sx={{ fontSize:{xs:10,sm:15},display:"flex",gap:1,alignItems:"center"   }} color="text.secondary">
                                <AccessibilityIcon/> Target weight {props.user.weight_goal}kg
                            </Typography>
                            <br/>

                            <Button onClick={()=>navigate("/calculator")} sx={{my:1, borderRadius:5}} size="small" color="warning" variant="outlined"><CalculateIcon/> Recalculate goal  </Button>
                            <Box sx={{display:"flex", flexWrap:"wrap",justifyContent:"start",gap:"10px",my:1}}>
                                <NutrimentsProgress user={props.user} value={all.cal}
                                                    nType="calorie_goal"/>
                                <NutrimentsProgress user={props.user} value={all.carb} nType="carb"/>
                                <NutrimentsProgress user={props.user} value={all.fat} nType="fat"/>
                                <NutrimentsProgress user={props.user} value={all.protein} nType="protein"/>

                            </Box>
                        </Box>
                    </Box>
                </Paper>
            ) : (
                <h1>Set a goal to start</h1>
            )}

            <Box sx={{
                display: "flex",
                flexDirection: "column",
                width: {xs:300, sm:500},
            }}>
                {categories.map(category => (
                    <Card
                        key={category}
                        user={props.user}
                        title={category.charAt(0).toUpperCase() + category.slice(1)}
                        meals={meals.filter(meal => meal.type === category)}
                        addLink={`/add-meal?type=${category}`}
                        onDelete={handleDelete}
                        loading={loading}
                        mealId={mealId}
                    />
                ))}
            </Box>

        </main>
    );
}

export default Home;