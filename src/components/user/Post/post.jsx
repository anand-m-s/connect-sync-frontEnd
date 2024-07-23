import React, { useState, lazy, Suspense, useEffect } from 'react';
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
import { Box, Button, CardMedia, Divider, Menu, MenuItem, useTheme } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import userApi from '../../../constraints/api/userApi';
import { userAxios } from '../../../constraints/axios/userAxios';
import CommentIcon from '@mui/icons-material/Comment';
import ReportPostModal from '../report/Report';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PersistentDrawerRight from '../../common/persistentDrawer';
import { useSocket } from '../../../services/socket';
import { useModal } from '../../../context/modalContext';
import { ChatState } from '../../../context/ChatProvider';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { toast } from 'sonner';
import PropTypes from 'prop-types';
import VerifiedIcon from '@mui/icons-material/Verified';

const Post = ({ userName, profilePic, imageUrl, location, description, postId, userId, comments, likes, saved, verifiedExp }) => {
    const theme = useTheme();
    const { socket } = useSocket()
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(false)
    const user = useSelector((state) => state.userAuth.userInfo);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const { handleOpen, setSource } = useModal()
    const { setSharedPost, sharedPost } = ChatState()


    const oneYearInMilliseconds = 365 * 24 * 60 * 60 * 1000;
    const verifiedExpDate = new Date(verifiedExp);
    const isVerifiedWithinYear = (new Date() - verifiedExpDate) < oneYearInMilliseconds;

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

    const handleLike = async (postId) => {
        try {
            const res = await userAxios.post(`${userApi.toggleLike}?postId=${postId}`);
            const postOwnerId = res.data.user._id
            if (res.data.action === 'Liked') {
                const createdAt = new Date().toISOString()
                setIsLiked(true)
                if (socket && user.id !== postOwnerId) {
                    socket.emit('like', { postId, liker: user.userName, postOwnerId,profilePic:user.profilePic,createdAt});
                }
            } else {
                setIsLiked(false)
            }
            setLikeCount(res.data.likeCount);
        } catch (error) {
            if (error.response && error.response.data.error) {
                toast.error(error.response.data.error);
            }
        }
    };

    useEffect(() => {
        if (likes) {
            setLikeCount(likes.length)
            setIsLiked(likes.includes(user.id))
        }
        setIsSaved(saved)
    }, [postId]);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOpenModal = () => {
        setModalOpen(true);
        handleClose();
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSharedPost = () => {
        setSharedPost([postId, imageUrl])
        handleOpen('search')
        setSource('chat')
    }
    const handleSavedPost = async () => {
        try {
            userAxios.post(`${userApi.savedPost}?postId=${postId}`)
                .then((data) => {
                    console.log(data)
                    toast.info(data.data.message)
                    setIsSaved(prev => !prev)
                })
        } catch (error) {
            if (error.response && error.response.data.error) {
                toast.error(error.response.data.error);
            }
        }
    }

    return (
        <Box className='flex justify-center items-center'>
            <Card sx={{ borderRadius: '1.2rem', width: { xs: '90%', sm: '80%', md: '90%' } }} elevation={1}>
                <CardHeader
                    style={{
                        backgroundColor: theme.palette.mode === 'light' ? theme.palette.selectedChat.main : theme.palette.selectedChat.main,
                    }}
                    avatar={

                        <Avatar src={profilePic} sx={{ bgcolor: "skyblue", cursor: 'pointer' }} aria-label="recipe">
                            {userName.charAt(0)}
                        </Avatar>
                    }

                    action={
                        <ClickAwayListener onClickAway={handleClose}>
                            <div>
                                <Button
                                    aria-label="settings"
                                    id="demo-positioned-button"
                                    aria-controls={open ? 'demo-positioned-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}
                                >
                                    {userId !== user.id && <MoreVertIcon />}
                                </Button>
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
                                >
                                    <MenuItem onClick={handleOpenModal}>Report</MenuItem>
                                </Menu>
                            </div>
                        </ClickAwayListener>
                    }
                    title={<Box className='flex items-center ' sx={{ cursor: 'pointer' }} component={Link} to={`/profile?userId=${userId}`}>
                        {userName} {isVerifiedWithinYear &&
                            <VerifiedIcon color='primary' fontSize='18' className='ml-1' />}
                    </Box>}
                    subheader={location}
                />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        padding: '10px',
                        height: { xs: '200px', sm: '250px', md: '400px' },
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
                            objectFit: 'contain',
                        }}
                    />
                </Box>
                <Box
                    style={{
                        backgroundColor: theme.palette.mode === 'light' ? theme.palette.selectedChat.main : theme.palette.selectedChat.main,
                        cursor: 'pointer',
                    }}
                >
                    <CardContent sx={{ padding: '0' }}>
                        <Box sx={{ padding: '5px', margin: '5px 6px 0 0' }}>
                            <Typography>{userName}</Typography>
                            <Typography variant="body2" color="text.secondary">{description}</Typography>
                        </Box>
                    </CardContent>
                    <CardActions>

                        <IconButton size="small" aria-label="like" onClick={() => handleLike(postId)}>
                            {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderOutlinedIcon />}
                        </IconButton>
                        {likeCount !== 0 && <Typography variant='body2'>{likeCount}</Typography>}
                        <IconButton size="small" aria-label="comment" onClick={handleCommentClick}>
                            <CommentIcon />
                        </IconButton>
                        <IconButton size="small" aria-label="share" onClick={handleSharedPost}>
                            <ShareIcon />
                        </IconButton>
                        <Box className='flex justify-end w-full'>
                            <IconButton onClick={handleSavedPost}>
                                {isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                            </IconButton>
                        </Box>
                    </CardActions>
                </Box>
            </Card>

            <PersistentDrawerRight open={drawerOpen} comments={comments} handleDrawerClose={handleDrawerClose} postId={postId} postOwnerId={userId} />

            <ReportPostModal open={modalOpen} handleClose={handleCloseModal} postId={postId} />
            {/* <SearchComponent source="chat" /> */}
        </Box>
    );
}


Post.propTypes = {
    userName: PropTypes.string,
    profilePic: PropTypes.string,
    imageUrl: PropTypes.array,
    location: PropTypes.string,
    description: PropTypes.string,
    postId: PropTypes.string,
    userId: PropTypes.string,
    comments: PropTypes.array,
    likes: PropTypes.array,
    saved: PropTypes.bool,
    verifiedExp: PropTypes.string
}

export default Post;


