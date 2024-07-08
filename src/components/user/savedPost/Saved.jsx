import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Grid, Button, Box, Avatar, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { userAxios } from '../../../constraints/axios/userAxios';
import userApi from '../../../constraints/api/userApi';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { toast } from 'sonner';
import { motion } from 'framer-motion'

export default function SavedPostContainer() {


    const [saved, setSaved] = useState([])
    const fetchSavedPost = async () => {
        try {
            const res = await userAxios.get(userApi.getSavedPosts)
            console.log(res.data)
            setSaved(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchSavedPost()
    }, [])
    console.log(saved)

    const handleSavedPost = async (postId) => {
        try {
            console.log('inside handle save post')
            userAxios.post(`${userApi.savedPost}?postId=${postId}`)
                .then((data) => {
                    console.log(data)
                    toast.info(data.data.message)
                    setSaved((prevSaved) => prevSaved.filter((post) => post.postId._id !== postId));
                })
        } catch (error) {
            if (error.response && error.response.data.error) {
                toast.error(error.response.data.error);
            }
        }
    }

    return (
        <Box className="px-4 py-6 md:px-6 lg:py-16"
            flex={5}
            p={6}
        >
            <Box className="max-w-6xl mx-auto">
                <Box className="mb-8">
                    <Typography variant="h4" className="text-3xl font-bold">Saved Posts</Typography>
                    {/* <Typography className="text-muted-foreground">Your saved posts from across the platform.</Typography> */}
                </Box>
                <Grid container spacing={3}>
                    {saved.map((post, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                            <motion.div
                                initial={{ opacity: 0.0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: .1,
                                    duration: 0.7,
                                    ease: "easeInOut",
                                }}
                                className="relative flex flex-col gap-3 items-center justify-center max-h-96 "
                            >
                                <Card className="overflow-hidden rounded-lg shadow-sm ">
                                    <Link href="#" className="block" prefetch={false}>
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={post.postId.imageUrl[0]}
                                            alt="Post Thumbnail"
                                            className="w-full h-48 object-cover"
                                        />
                                    </Link>
                                    <CardContent>
                                        <Box className='flex justify-between items-center'>

                                            <Avatar src={post.postId.userId.profilePic} sx={{ bgcolor: "skyblue", cursor: 'pointer' }} aria-label="recipe">
                                                {post.postId.userId.userName.charAt(0)}
                                            </Avatar>
                                            <Typography variant="h6" className="text-md font-semibold mb-2">{post.postId.userId.userName}</Typography>
                                        </Box>
                                        {/* <Box className='flex justify-end'>
                                            <Typography variant="body1" className="text-md font-semibold mb-2">{post.postId.location}</Typography>
                                        </Box>
                                        <Box className='flex justify-end'>
                                            <Typography className="text-muted-foreground line-clamp-2">{post.postId.description}</Typography>
                                        </Box> */}

                                            <Box className='flex justify-end'>

                                        <IconButton onClick={() => handleSavedPost(post.postId._id)}>
                                            <BookmarkIcon />
                                        </IconButton>
                                            </Box>

                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                    {saved.length == 0 &&
                        <Box className='flex justify-center w-full mt-6'>
                            <Typography variant='h6'>No saved post yet...</Typography>
                        </Box>
                    }
                </Grid>
                {/* <Box className="mt-8 text-center">
                    <Button variant="outlined">View More</Button>
                </Box> */}
            </Box>
        </Box>
    );
}
