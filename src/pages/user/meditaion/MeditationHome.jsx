import { useState, useMemo, useEffect } from "react";
import Button from "@mui/material/Button";
import { Container, Grid, Typography, Card, CardContent, CardMedia } from "@mui/material";
import { Link } from "react-router-dom";
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import { userAxios } from "../../../constraints/axios/userAxios";
import userApi from "../../../constraints/api/userApi";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';


const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});


export default function Meditation() {
    const categories = ["All", "mindfulness", "Stress Relief", "Sleep", "Loving-Kindness", "Visualization", "Body Scan"];
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [courses, setCourses] = useState([])

    const fetchCourses = async () => {
        const res = await userAxios.get(userApi.getCourses)
        // console.log(res.data)
        setCourses(res.data.course)
    }

    useEffect(() => {
        fetchCourses()
    }, [])
    // console.log(courses)

    const filteredCourses = useMemo(() => {
        if (selectedCategory === "All") {
            return courses;
        } else {
            return courses.filter((course) => course.category.toLowerCase().includes(selectedCategory.toLowerCase()));
        }
    }, [selectedCategory, courses]);

    return (
        <>
            <div role="presentation" className="m-7" >
                <Breadcrumbs aria-label="breadcrumb">
                    <StyledBreadcrumb
                        component={Link}
                        to='/home'
                        label="Home"
                        icon={<HomeIcon fontSize="small" />}
                        sx={{ cursor: 'pointer' }}
                    />
                    <StyledBreadcrumb sx={{ cursor: 'pointer' }} label="Meditation" />
                </Breadcrumbs>
            </div>
            <section className="w-full ">
                <div className="flex flex-col md:flex-row items-start md:items-center ml-7 ">
                    <div className="grid gap-1">
                        <Typography variant="h4" className="text-2xl font-bold tracking-tight">Meditation Courses</Typography>
                        <Typography className="text-muted-foreground">Explore our collection of mindfulness and meditation practices.</Typography>
                    </div>
                </div>
                <Grid container spacing={3} className="p-7">
                    <Grid item xs={12} md={3}>
                        <div className="grid gap-3">
                            {categories.map((category) => (
                                <Button
                                    key={category}
                                    variant={selectedCategory === category ? "contained" : "text"}
                                    onClick={() => setSelectedCategory(category)}
                                    className="justify-start"
                                    fullWidth
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <Grid container spacing={3}>
                            {filteredCourses.map((course) => (

                                <Grid item xs={12} sm={6} md={6} key={course.id} className="hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 ease-in-out">
                                    <Card className="relative overflow-hidden rounded-lg shadow-lg group ">
                                        <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                                            <span className="sr-only">View</span>
                                        </Link>
                                        <CardMedia
                                            component="img"
                                            image={course.image}
                                            alt={course.caption}
                                            height="250"
                                            className="object-cover w-full h-64"
                                        />
                                        <CardContent className="p-4 bg-background">
                                            <Typography variant="h6" className="text-xl font-bold">{course.caption}</Typography>
                                            <Typography className="text-sm text-muted-foreground">{course.description}</Typography>
                                            {/* <Button variant="text" className="mt-2">
                                                Learn More
                                            </Button> */}


                                        </CardContent>
                                    </Card>
                                    <div>
                                        <AudioPlayer                                                                                      
                                            src={course.audio}
                                            onPlay={e => console.log("onPlay")}
                                            header={`Now playing: ${course.caption}`}
                                            customIcons={{ play: <PlayArrowIcon fontSize="inherit" color="info"/>, pause: <PauseIcon fontSize="inherit" color="secondary"/> }}
                                        />
                                    </div>
                                </Grid>

                            ))}
                        </Grid>
                    </Grid>
                </Grid>

            </section>
        </>
    );
}
