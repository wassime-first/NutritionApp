import SearchIcon from '@mui/icons-material/Search';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import axios from "axios";
import {useState, useEffect} from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import {Link, useSearchParams} from "react-router-dom";
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Chip from '@mui/material/Chip';
import CircularProgress from "@mui/material/CircularProgress";
import Fuse from "fuse.js";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import CardMedia from '@mui/material/CardMedia';
import Fart
    from "../src/assets/sounds/YTDown.com_Shorts_Media_Ql2ihwQtfvM_Dramatic-fart-sound-effect-no-copyright_006_48k.m4a"
import {Skeleton} from "@mui/material";
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import EditIcon from '@mui/icons-material/Edit';
import NutrimentsProgress from "./components/NutrimentsProgress.jsx";
import NutrimentsCalculator from "./components/NutrimentsCalculator.jsx";


function Add({date, user}) {

    // foods to show in the add page (from the api or the db)
    const [foods, setFood] = useState([]);
    // loading state
    const [loading, setLoading] = useState(false);
    // image loading
    const [imageLoading, setImageLoading] = useState(true);
    //search bar input value
    const [searchInput, setSearchInput] = useState('');
    const [searchType, setSearchType] = useState('Products');
    // food api page
    const [page, setPage] = useState(1);
    // total pages of food api
    const [totalPages, setTotalPages] = useState(1);
    // value for opening meals modal
    const [open, setOpen] = useState(false);
    // open notification
    const [openNotification, setOpenNotification] = useState(false);
    // value for adding food modal
    const [openModal, setOpenModal] = useState(false);

    const [quantity, setQuantity] = useState(1);
    // current food in the modal to add
    const [currentFood, setCurrentFood] = useState({});
    // calories to submit in meal db
    const [calories, setCalories] = useState(1);
    const [protein, setProtein] = useState(1);
    const [fat, setFat] = useState(1);
    const [carb, setCarb] = useState(1);
    // get the type of meals from the url
    const [searchParams] = useSearchParams();

    const [editFood, setEditFood] = useState(false);
    // know the current scroll positons
    const [atTop, setAtTop] = useState(window.scrollY <= 300)

    const [atBottom, setAtBottom] = useState(window.scrollY > 600)


    // the meal type
    const type = searchParams.get("type");

    const fart = new Audio(Fart)

    // search type
    const searching = [
        {
            value:1,
            label:"Products"
        },
        {
            value:2,
            label:"Basic"
        }
    ]

    // update the scroll status
    useEffect(() => {
        const handleScroll = () => {
            setAtTop(window.scrollY <= 300);

            setAtBottom(
                window.scrollY >= 800
            );
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // get the db food
    useEffect(() => {
        setLoading(true);
        axios.get("/api/food")
            .then(res => {
                setFood(res.data);
                setLoading(false);
            })
    }, [])


    //search methode for foods in the db
    const fuse = new Fuse(foods.filter(food => !food.api), {
        keys: ['name'],
        threshold: 0.5,
    })


    // modal styles
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        backgroundImage: `
        linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9)),
        url(${currentFood.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRchtrnoMJecCD6N44jBM9IDEZOf-noNxcwwIzlSv85lQ&s=10"})
        `,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backdropFilter: 'blur(10px)',


        transform: 'translate(-50%, -50%)',
        width: {xs: 250, sm: 400},
        bgcolor: 'background.paper',
        border: '2px solid #000',
        borderRadius: '20px',
        boxShadow: 24,
        p: 4,
        maxHeight: '90vh',
        overflowY: 'auto',
    };

    // scroll button style
    const fabStyle = {
        position: 'fixed',
        bottom: 30,
        left: 30,
        '&:hover': {
            color: 'black'
        },
        color: "white",
        backgroundColor: "transparent",
    }

    function handleOpen(food) {
        setOpen(true);
        setCurrentFood(food)
        const cals = (Number(food.calorie))
        const fat = (Number(food.fat))
        const protein = (Number(food.protein))
        const carb = (Number(food.carb))
        const quantity = (Number(food.quantity))
        setCalories(Math.floor(cals));
        setFat(Math.floor(fat));
        setProtein(Math.floor(protein));
        setCarb(Math.floor(carb));
        setQuantity(Math.floor(quantity));
    }

    function handleClose() {
        setOpen(false);
        setCurrentFood({})
        setQuantity(1)
        setCalories(1)
    }

    async function handleSubmit() {
        fart.currentTime = 6.5
        await fart.play()
        setOpenNotification(true);
        handleClose();

        await axios.post("/api/add-meal", {
            type,
            date,
            calories,
            image_url: currentFood.image,
            name: currentFood.name,
            carb: carb,
            protein: protein,
            fat: fat,
            quantity: quantity,
            unit: currentFood.unit,
        })


    }

    function handleOpenModal() {
        setOpenModal(true);
    }

    function handleCloseModal() {
        setOpenModal(false);
    }


    async function addFood(f) {
        setLoading(true);
        try {

            const res = await axios.post("/api/add-food", {
                name: f.name,
                calories_per_100g: f.calorie,
                image_url: f.image,
                carb: f.carb,
                protein: f.protein,
                fat: f.fat,
                quantity: f.quantity,
                unit: f.unit,
            });
            setFood(prev => [...prev, res.data]
            );
            setOpenNotification(true);


        } finally {
            setLoading(false);
        }


    }

    function handleChange(e) {
        let value = Number(e.target.value);

        const cals = (Number(currentFood.calorie) * value) / currentFood.quantity;
        const fat = (Number(currentFood.fat) * value) / currentFood.quantity;
        const protein = (Number(currentFood.protein) * value) / currentFood.quantity;
        const carb = (Number(currentFood.carb) * value) / currentFood.quantity;
        setCalories(Math.floor(cals));
        setFat(Math.floor(fat));
        setProtein(Math.floor(protein));
        setCarb(Math.floor(carb));
        setQuantity(value);
    }

    function handleChangeCustom(e) {
        const {name, value} = e.target;
        setCurrentFood(prev => ({
                ...prev, [name]: value
            }
        ));

    }

    async function deleteFood(id) {
        setLoading(true);
        const res = await axios.post(`/api/delete-food`, {id})
        if (res.status === 200) {
            const updatedFood = foods.filter(food => food.id !== id);
            setFood(updatedFood);
        }
        setLoading(false);
    }

    async function updateFood(f, submit) {
        console.log(f);
        if (submit) {

            const res = await axios.post(`/api/update-food`, {

                id: currentFood.id,
                name: currentFood.name,
                image_url: currentFood.image,
                calories_per_100g: currentFood.calorie,
                carb: currentFood.carb,
                protein: currentFood.protein,
                fat: currentFood.fat,
                quantity: currentFood.quantity,
                unit: currentFood.unit
            })
            setCurrentFood({})

            let data = await res.data
            let updatedFoods = foods.map(food =>
                food.id === data.id
                    ? data
                    : food)
            setFood(updatedFoods)
            setOpenNotification(true);
            fart.currentTime = 6.5;
            fart.play()
        } else {
            setCurrentFood(f)
            setOpenModal(true);


        }

    }

    async function searchFoodApi(currentPage, append) {
        setLoading(true);
        const result = fuse.search(searchInput)
        try {
            const res = await axios.get('/api/search-food', {
                params: {name: searchInput, page: await currentPage, type: searchType},
            });

            let foodies = [];
            result.forEach(item => {
                foodies.push(item.item);
            })
            let apiFood = []
            console.log(res.data[0].results);
            res.data[0].results.forEach(item => {
                foodies.push(item);
                apiFood.push(item);
            })


            setTotalPages(Number(res.data[0]["total_pages"]))
            if (append) {
                setFood(prev => [...prev, ...apiFood]);
            } else {
                setFood(foodies);
            }
        } catch (error) {
            let foodies = [];
            result.forEach(item => {
                foodies.push(item.item);
            })
            setFood(foodies);
        } finally {
            setLoading(false);
        }

    }


    return (
        <main
            onKeyDown={async (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();

                    if (open || openModal) {
                        if (openModal) {
                            await addFood();
                        } else if (open) {
                            await handleSubmit();
                        }
                    } else {
                        await searchFoodApi(page, false);
                    }
                }
            }}
        >
            <Paper elevation={2} sx={{

                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                maxWidth: "100%",
                width: '100%',
                padding: '2rem',
            }}>
                <Paper
                    component="form"
                    sx={{
                        p: '2px 4px', display: 'flex', alignItems: 'center', maxWidth: 400,

                    }}
                >
                    <Box>
                        <TextField
                            // sx={{ width: {xs: 300, sm: 500} }}
                            id="outlined-select-currency-native"
                            select
                            label="Type"
                            onChange={(e) => setSearchType(e.target.value)}
                            defaultValue={"Products"}
                            slotProps={{
                                select: {
                                    native: true,
                                },
                            }}
                            // helperText="search type"
                        >
                            {searching.map((option) => (
                                <option key={option.value} value={option.label}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                        <InputBase
                            onChange={event => {
                                setSearchInput(event.target.value)
                                setLoadMore(false)
                            }}
                            sx={{ml: 1, flex: 1}}
                            placeholder="food"
                            inputProps={{'aria-label': 'search food by name'}}
                        />
                        <IconButton onClick={()=>searchFoodApi(page)} type="button" sx={{p: '10px'}} aria-label="search">
                            <SearchIcon/>
                        </IconButton>
                    </Box>
                </Paper>
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: {sm: "1fr 1fr", lg: "1fr 1fr 1fr"},
                    gap: '1rem',
                }}>
                    {foods.length > 0 && foods.map(food => (
                        <div key={food.id}>
                            <Card onClick={() => handleOpen(food)} sx={{
                                width: 300,
                            }}>
                                <CardActionArea sx={{display: "flex", flexWrap: "wrap", justifyContent: "start"}}>

                                    <Box sx={{display: "flex"}}>
                                        {food.api && imageLoading ?
                                            (<Skeleton variant="rounded" animation="wave" width={100} height={150}/>) :

                                            <CardMedia
                                                component="img"
                                                onLoad={() => setImageLoading(false)}
                                                onError={() => setImageLoading(false)}
                                                src={food.api ? food.image : !food.api && food.image ? food.image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRchtrnoMJecCD6N44jBM9IDEZOf-noNxcwwIzlSv85lQ&s=10"}
                                                sx={{
                                                    maxWidth: 100,
                                                    maxHeight: 150,
                                                    mr: 1,
                                                    mb: 1,
                                                    // float: "left",
                                                    cursor: "pointer",
                                                    borderRadius: "10px",
                                                }}/>}
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            alignContent: 'center',
                                            justifyContent: 'center',
                                            // display: 'flow-root',

                                        }}>

                                            <Box>
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {food.name}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="h6"
                                                            sx={{color: 'text.secondary', fontSize: {xs: 10, sm: 15}}}>
                                                    Quantity: {food.quantity}{food.unit}
                                                </Typography>
                                            </Box>
                                            {food.category && <Box>
                                                <Typography variant="h6"
                                                            sx={{color: 'text.secondary', fontSize: {xs: 10, sm: 15}}}>
                                                    Category: {food.category}
                                                </Typography>
                                            </Box>}

                                        </Box>
                                    </Box>

                                    <Box sx={{
                                        display: 'flex',
                                        // clear: "both",
                                        gap: '1rem',
                                        // mx: "1rem",
                                        alignItems: 'center',
                                        justifyContent: 'start',
                                        // position: 'relative',
                                        // right: 50,
                                        my: "1rem",
                                        // mb: "1rem",
                                        // paddingTop: '1rem',
                                    }}>
                                        <NutrimentsProgress user={user} value={food.calorie}
                                                            nType={"calorie_goal"}/>
                                        <NutrimentsProgress user={user} value={food.carb} nType={"carb"}/>
                                        <NutrimentsProgress user={user} value={food.fat} nType={"fat"}/>
                                        <NutrimentsProgress user={user} value={food.protein} nType={"protein"}/>

                                    </Box>


                                    <Box sx={{width: "100%", display: "flex", justifyContent: "space-around"}}>
                                        {!food.api ?
                                            <>
                                                <IconButton
                                                    onClick={async (event) => {
                                                        event.stopPropagation();
                                                        await deleteFood(food.id);
                                                    }}
                                                    aria-label="delete"
                                                    color="error"
                                                >
                                                    <DeleteForeverIcon/>
                                                </IconButton>
                                                <IconButton
                                                    onClick={async (event) => {
                                                        event.stopPropagation();
                                                        setEditFood(true)
                                                        setCurrentFood(food)
                                                        await updateFood(food, false);
                                                    }
                                                    }
                                                    aria-label="Add"
                                                    color="warning"
                                                >
                                                    <EditIcon/>
                                                </IconButton>

                                            </> :
                                            <IconButton
                                                onClick={async (event) => {
                                                    event.stopPropagation();
                                                    await addFood(food);
                                                }
                                                }
                                                aria-label="Add"
                                                color="primary"
                                            >
                                                <AddIcon/>
                                            </IconButton>
                                        }
                                    </Box>

                                </CardActionArea>
                            </Card>

                        </div>
                    ))}</Box>
                {loading && <CircularProgress aria-label="Loading…"/>}
                {foods.find((food) => food.api) && totalPages > page ? <Button onClick={async () => {
                    setPage(page + 1);
                    await searchFoodApi(page + 1, true);
                }} variant="outlined" color="default">
                    Load More ...
                </Button> : null}


                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        {loading ? <CircularProgress/> : <>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                {currentFood.name}
                            </Typography>
                            <Box
                                component="form"
                                sx={{'& > :not(style)': {m: 1, width: '15ch'}}}
                                noValidate
                                autoComplete="off"
                            >

                                <TextField type="number" onChange={handleChange} id="filled-basic"
                                           value={quantity}
                                           label={`Quantity (${currentFood.unit})`} variant="filled"/>
                            </Box>

                            <NutrimentsCalculator cal={calories} protein={protein} fat={fat}
                                                  carb={carb}/>

                            <Box sx={{width: {xs: 180, sm: 300}, marginTop: 4, mb: 2}}>

                                <Slider color="success" onChange={handleChange} max={1000}
                                        defaultValue={1}
                                        aria-label="quantity"
                                        valueLabelDisplay="auto" sx={{
                                    maxWidth: {xs: 200, sm: 300}
                                }} value={quantity}/>
                            </Box>
                            <Button onClick={handleSubmit}>Add</Button>
                        </>}
                    </Box>
                </Modal>


                <Modal
                    open={openModal}
                    onClose={handleCloseModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Add a costume food
                        </Typography>
                        <Box
                            component="form"
                            sx={{'& > :not(style)': {m: 1, width: '15ch'}}}
                            noValidate
                            autoComplete="off"
                        >

                            <TextField name="name" onChange={handleChangeCustom} id="filled-basic"
                                       value={currentFood.name}
                                       label="Food name" variant="filled"/>
                            <TextField name="calorie" onChange={handleChangeCustom}
                                       id="filled-basic"
                                       value={currentFood.calorie}
                                       label="Calories per unit" variant="filled"/>
                            <TextField name="image" onChange={handleChangeCustom}
                                       id="filled-basic"
                                       value={currentFood.image}
                                       label="image url(optional)" variant="filled"/>
                            <TextField name="protein" onChange={handleChangeCustom}
                                       value={currentFood.protein} label="Protein per unit"
                                       variant="filled"/>

                            <TextField name="carb" onChange={handleChangeCustom}
                                       value={currentFood.carb} label="Carbs per unit"
                                       variant="filled"/>

                            <TextField name="fat" onChange={handleChangeCustom}
                                       value={currentFood.fat} label="Fat per unit" variant="filled"/>

                            <TextField name="unit" onChange={handleChangeCustom}
                                       value={currentFood.unit} label="Unit" variant="filled"/>

                            <TextField name="quantity" onChange={handleChangeCustom}
                                       value={currentFood.quantity} label="Quantity" variant="filled"/>

                        </Box>

                        <Button onClick={async () => {
                            if (editFood) {
                                await updateFood(currentFood, true);
                                setEditFood(false)
                            } else {
                                await addFood(currentFood);
                            }
                            setOpenModal(false)
                        }}>{editFood ? "Edit" : "Add"}</Button>
                    </Box>
                </Modal>
            </Paper>

            <Box sx={{
                '& > :not(style)': {m: 1},
                position: "fixed",
                bottom: 20,
                right: 20,
                zIndex: 1000
            }}>
                <Fab onClick={() => {
                    setEditFood(false)
                    handleOpenModal()
                }}
                     size="medium" color="primary" aria-label="add">
                    <AddIcon/>
                </Fab>
            </Box>

            <Snackbar
                open={openNotification}
                autoHideDuration={5000}
                onClose={(event, reason) => {
                    if (reason === 'clickaway') {
                        return;
                    }
                    setOpenNotification(false)
                }}
                message=" Successfully added the food!!"
                anchorOrigin={{vertical: "bottom", horizontal: "center"}}

            >
                <Alert
                    onClose={(event, reason) => {
                        if (reason === 'clickaway') {
                            return;
                        }

                        setOpenNotification(false);
                    }}
                    severity="success"
                    variant="filled"
                    sx={{width: '100%'}}
                >
                    Successfully added the food!!
                </Alert>
            </Snackbar>
            {atBottom ?
                <Fab onClick={() => {
                    scrollTo({
                        top: 0,
                        behavior: 'smooth',
                    })
                }} aria-label="scroll top"
                     size="small"
                     sx={fabStyle}>

                    <VerticalAlignTopIcon/>
                </Fab> : atTop && <Fab onClick={() => {
                scrollTo({
                    top: document.documentElement.scrollHeight,
                    behavior: 'smooth',
                })
            }} aria-label="scroll top"
                                       size="small"
                                       sx={fabStyle}>

                <VerticalAlignBottomIcon/>
            </Fab>}

        </main>
    )
}

export default Add;