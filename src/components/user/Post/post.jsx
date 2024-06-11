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
import { Box, CardMedia, Divider, Menu,MenuItem, useTheme } from '@mui/material';
import PersistentDrawerRight from '../../common/persistentDrawer';
import { useEffect } from 'react';
import userApi from '../../../constraints/api/userApi';
import { userAxios } from '../../../constraints/axios/userAxios';
import CommentIcon from '@mui/icons-material/Comment';
import ReportPostModal from '../report/Report';

function Post({ userName, profilePic, imageUrl, location, description, postId }) {
    const theme = useTheme();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(0)
    const [anchorEl, setAnchorEl] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const open = Boolean(anchorEl);
    const handleCommentClick = () => {
        setDrawerOpen((prev) => !prev);
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

    const handleLike = async () => {
        try {
            const res = await userAxios.post(`${userApi.toggleLike}?postId=${postId}`)
            console.log(res.data)
            setIsLiked(!isLiked);
            setLikeCount(res.data.likeCount)
        } catch (error) {
            if (error.response && error.response.data.error) {
                toast.error(error.response.data.error);
            }
        }
    }
    useEffect(() => {
        const fetchLikeStatus = async () => {
            try {
                const res = await userAxios.get(`${userApi.likeStatus}?postId=${postId}`);
                setIsLiked(res.data.isLiked);
                setLikeCount(res.data.likeCount)
            } catch (error) {
                console.error('Error fetching like status:', error);
            }
        };
        fetchLikeStatus();
    }, [postId]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOpenModal = () => {
        setModalOpen(true);
        handleClose()
      };
    
      const handleCloseModal = () => {
        setModalOpen(false);
      };



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
                            <MoreVertIcon
                                id="demo-positioned-button"
                                aria-controls={open ? 'demo-positioned-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                            />
                            <Menu
                                id="demo-positioned-menu"
                                aria-labelledby="demo-positioned-button"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                            >
                                <MenuItem onClick={handleOpenModal}>Report</MenuItem>
                                
                            </Menu>
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
                        <IconButton size='small' aria-label="like" onClick={handleLike}>
                            {isLiked ? <FavoriteIcon color='error' /> : <FavoriteBorderOutlinedIcon />}
                        </IconButton>
                        {likeCount !== 0 && <Typography variant='body2'>{likeCount}</Typography>}
                        <IconButton size='small' aria-label="comment" onClick={handleCommentClick}>
                            <CommentIcon />
                        </IconButton>
                        <IconButton size='small' aria-label="share">
                            <ShareIcon />
                        </IconButton>
                    </CardActions>
                </Box>
            </Card>
            <PersistentDrawerRight open={drawerOpen} handleDrawerClose={handleDrawerClose} postId={postId}
                // sx={{ width: { xs: '70%', sm: '80%', md: '90%' } }}
            />
             <ReportPostModal open={modalOpen} handleClose={handleCloseModal} postId={postId} />
        </Box>
    );
}

export default Post;