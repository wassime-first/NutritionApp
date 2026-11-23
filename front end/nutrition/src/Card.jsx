import {useEffect, useState} from "react";
import {
    Box,
    Collapse,
    IconButton,
    List,
    ListItem, ListItemSecondaryAction,
    ListItemText,
    Paper,
    Typography
} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from "@mui/icons-material/Add";
import Avatar from '@mui/material/Avatar';

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {Link} from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import NutrimentsProgress from "./components/NutrimentsProgress.jsx";


function Card({title, meals = [], addLink, onDelete, loading, mealId, user}) {
    const [open, setOpen] = useState(false);
    const [all, setAll] = useState({});
    useEffect(() => {
        const totals = meals.reduce((sum, meal) => ({
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
        // console.log(meals[0].protein);

        setAll(totals);
    }, [meals])

    const diner = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaAGnvzpOmL9BAAhHdzIk9nVpM4rTau7iB2E5pkL2Lsg&s=10"
    const lunch = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7P9RdI_funTnff2iQJIsg1k4G6MmDBmt1KNWcZyOpAQ&s=10"
    const breakfast = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg7pX3DjI8bH3yhBqFPmv59v-V9RP3lhdw_kKfbZB5bg&s=10"


    return (
        <Paper
            elevation={2}
            sx={{

                mb: 2,
                // display: "flex",
                color: "black",
                backgroundColor: "#9FED72",
                borderRadius: 3,
                overflow: "hidden",
                width: "100%",
                flexGrow: 1,

            }}
        >
            <Box sx={{pl: 1, pb: 1}}>

                <Box sx={{mt:1,display: "flex", gap: 1,alignItems: "center"}}>
                    <Avatar alt={title} src={title==="Lunch" ? lunch : title==="Dinner" ? diner : breakfast} />
                    <Typography variant="h6" color="text.secondary">
                        {title}
                    </Typography>
                </Box>
                <Box sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    mt: 2,
                    justifyContent: "start",
                }}>
                    <NutrimentsProgress user={user} value={all.cal}
                                        nType="calorie_goal"/>
                    <NutrimentsProgress user={user} value={all.carb} nType="carb"/>
                    <NutrimentsProgress user={user} value={all.fat} nType="fat"/>
                    <NutrimentsProgress user={user} value={all.protein} nType="protein"/>
                </Box>
            </Box>

            <Paper
                elevation={2}
                sx={{
                    mb: 2,
                    ml: 1,
                    borderRadius: 3,
                    overflow: "hidden",
                    width: "90%",
                    flexGrow: 1,
                }}
            >

                {/* Header */}
                <Box
                    onClick={() => setOpen(prev => !prev)}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 2,
                        cursor: "pointer",
                        "&:hover": {
                            bgcolor: "action.hover"
                        }
                    }}
                >
                    <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                        <ExpandMoreIcon
                            sx={{
                                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.2s"
                            }}
                        />

                        <Typography variant="h6">
                            Show food
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            ({meals.length})
                        </Typography>
                    </Box>

                    {/* Add meal link */}
                    <IconButton
                        component={Link}
                        to={addLink}
                        onClick={event => event.stopPropagation()}
                        aria-label={`Add ${title.toLowerCase()} meal`}
                        color="primary"
                    >
                        <AddIcon/>
                    </IconButton>
                </Box>

                {/* Collapsible content */}
                <Collapse in={open} timeout="auto" unmountOnExit>
                    {meals.length > 0 ? (
                        <List disablePadding>
                            {meals.map(meal => (

                                <ListItem
                                    key={meal.id}
                                    divider
                                    secondaryAction={
                                        loading && mealId === meal.id
                                            ? <CircularProgress/>
                                            : (
                                                <IconButton
                                                    edge="end"
                                                    color="error"
                                                    aria-label={`Delete ${meal.name}`}
                                                    onClick={() => onDelete?.(meal.id)}
                                                >
                                                    <DeleteForeverIcon/>
                                                </IconButton>
                                            )
                                    }
                                    sx={{px: 3, py: 1.5}}
                                >
                                    <Box sx={{width: "100%", pr: 5}}>

                                        {/* Image and meal information */}
                                        <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                                            <Box
                                                component="img"
                                                src={meal.image || "your-placeholder-image"}
                                                alt="food"
                                                sx={{
                                                    width: 100,
                                                    height: 100,
                                                    objectFit: "cover",
                                                    borderRadius: 2
                                                }}
                                            />

                                            <ListItemText
                                                primary={meal.name}
                                                secondary={`Quantity: ${meal.quantity}${meal.unit}`}
                                            />
                                        </Box>

                                        {/* Nutritional progress bars */}
                                        <Box sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: 1,
                                            mt: 2,
                                            justifyContent: "start",
                                        }}>
                                            <NutrimentsProgress user={user} value={meal.calories}
                                                                nType="calorie_goal"/>
                                            <NutrimentsProgress user={user} value={meal.carb} nType="carb"/>
                                            <NutrimentsProgress user={user} value={meal.fat} nType="fat"/>
                                            <NutrimentsProgress user={user} value={meal.protein} nType="protein"/>
                                        </Box>

                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography
                            color="text.secondary"
                            variant="body2"
                            sx={{px: 3, pb: 2}}
                        >
                            No meals added yet.
                        </Typography>
                    )}
                </Collapse>


            </Paper>

        </Paper>
    );
}

export default Card;

