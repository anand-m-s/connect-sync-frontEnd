import React, { useState } from 'react'
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';
import { Box, CardMedia, Divider, useTheme } from '@mui/material';
import PersistentDrawerRight from '../../common/persistentDrawer';
import { useEffect } from 'react';

function Post({ userName, profilePic, imageUrl, location, description,postId }) {
    const theme = useTheme();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const handleCommentClick = () => {
        setDrawerOpen((prev)=>!prev);
    };
 
    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };
    useEffect(() => {
        if (drawerOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    }, [drawerOpen]);

    return (
        <Box className='flex justify-center items-center '>

            <Card sx={{ marginBottom: 3, borderRadius: '1.2rem', width: { xs: '70%', sm: '80%', md: '90%' } }} elevation={1}>
                <CardHeader
                    // sx={{background:''}}
                    style={{
                        backgroundColor: theme.palette.mode === 'light' ? theme.palette.selectedChat.main : theme.palette.selectedChat.main,
                        cursor: 'pointer'
                    }}
                    avatar={
                        <Avatar src={profilePic} sx={{ bgcolor: "skyblue" }} aria-label="recipe">
                            {userName.charAt(0)}
                        </Avatar>
                    }
                    action={
                        <IconButton aria-label="settings">
                            <MoreVertIcon />
                        </IconButton>
                    }
                    title={userName}
                    subheader={location}
                />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        padding: '10px',
                        height: { xs: '200px', sm: '250px', md: '400px' }, // Responsive heights
                        overflow: 'hidden',
                    }}
                >

                    <CardMedia
                        component="img"
                        image={imageUrl[0]}
                        alt="Post image"
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain'
                        }}
                    />

                </Box>
                <Box
                    style={{
                        backgroundColor: theme.palette.mode === 'light' ? theme.palette.selectedChat.main : theme.palette.selectedChat.main,
                        cursor: 'pointer'
                    }}
                >
                    <CardContent disableSpacing sx={{ padding: '0' }}>
                        <Box sx={{ padding: '5px', margin: '5px 6px 0 0' }}>
                            <Typography >
                                {userName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" >
                                {description}
                            </Typography>
                        </Box>
                    </CardContent>
                    <CardActions disableSpacing>
                        <IconButton size='small' aria-label="like">
                            <FavoriteBorderOutlinedIcon />
                        </IconButton>
                        <IconButton size='small' aria-label="comment" onClick={handleCommentClick}>
                            <MapsUgcOutlinedIcon />
                        </IconButton>
                        <IconButton size='small' aria-label="share">
                            <ShareIcon />
                        </IconButton>
                    </CardActions>
                </Box>
            </Card>
            <PersistentDrawerRight open={drawerOpen} handleDrawerClose={handleDrawerClose} postId={postId} />
        </Box>
    );
}

export default Post;