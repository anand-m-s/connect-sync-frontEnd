import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, CircularProgress, ClickAwayListener } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Carousel from "react-material-ui-carousel";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { userAxios } from "../../../constraints/axios/userAxios";
import userApi from "../../../constraints/api/userApi";
import { toast } from "sonner";
import { setUserPosts } from "../../../services/redux/slices/userAuthSlice";
import PersistentDrawerRight from "../../common/persistentDrawer";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import Skeleton from '@mui/material/Skeleton';
import CommentIcon from '@mui/icons-material/Comment';

const style = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 22,
    p: 4,
    borderRadius: 6,
    
};

const PostModal = ({ isOpen, onRequestClose, postId, determineUser }) => {
    const [comments, setComments] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [editOpen, setEditOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const posts = useSelector(state => state.userAuth.posts);
    const post = posts.find((post) =>
        Array.isArray(post.imageUrl) ? post._id.includes(postId) : post._id === postId
    );
    const user = useSelector((state) => state.userAuth.userInfo);
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchPostData = async () => {
            setLoading(true);
            await new Promise(res => setTimeout(() => { res() }, 300))

            try {
                const [res, like] = await Promise.all([
                    userAxios.get(`${userApi.comments}?postId=${postId}`),
                    userAxios.get(`${userApi.likeStatus}?postId=${postId}`)
                ]);
                setIsLiked(like.data.isLiked);
                setLikeCount(like.data.likeCount);
                setComments(res.data);
            } catch (error) {
                console.error('Error fetching data', error);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchPostData();
        }

        return () => {
            setIsLiked(false);
        };
    }, [postId, isOpen]);

    const handleEditOpen = () => {
        handleClose()
        setEditOpen(true)
    };
    const handleEditClose = () => setEditOpen(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    if (!post) return null;

    const handleCommentClick = () => {
        setDrawerOpen((prev) => !prev);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    const handleDelete = async (postId) => {
        handleClose()
        try {
            await userAxios.delete(`${userApi.postDelete}/${postId}`);
            const updatedPosts = posts.filter(p => p._id !== postId);
            toast.success('Post deleted');
            dispatch(setUserPosts(updatedPosts));
            handleClose();
            onRequestClose();
        } catch (error) {
            if (error.response && error.response.data.error) {
                toast.error(error.response.data.error);
            }
        }
    };

    const handleEditPost = async (e) => {
        try {
            e.preventDefault();
            const updatedPost = {
                ...post,
                description: e.target.elements.description.value,
                location: e.target.elements.location.value
            };
            await userAxios.put(`${userApi.editPost}`, updatedPost);
            toast.success('Post updated successfully');
            const updatedPosts = posts.map(p => p._id === post._id ? updatedPost : p);
            dispatch(setUserPosts(updatedPosts));
            handleClose();
            handleEditClose();
            onRequestClose();
        } catch (error) {
            if (error.response && error.response.data.error) {
                toast.error(error.response.data.error);
            }
        }
    };

    const handleLike = async (postId) => {
        try {
            const res = await userAxios.post(`${userApi.toggleLike}?postId=${postId}`);
            setIsLiked(!isLiked);
            setLikeCount(res.data.likeCount);
        } catch (error) {
            if (error.response && error.response.data.error) {
                toast.error(error.response.data.error);
            }
        }
    };

    return (
        <>
            <ClickAwayListener onClickAway={onRequestClose}>
                <Box >
                    <Box

                    // open={isOpen}
                    // onClose={onRequestClose}
                    // aria-labelledby="post-modal-title"
                    // aria-describedby="post-modal-description"
                    >
                        <Stack direction='row' spacing={0} justifyContent={'space-between'}>
                            <Box
                                sx={style}
                            >
                                {user.id === determineUser && (
                                    <Box className='flex justify-end mb-1 '>
                                        <MoreVertIcon
                                            id="demo-positioned-button"
                                            aria-controls={menuOpen ? 'demo-positioned-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={menuOpen ? 'true' : undefined}
                                            onClick={handleClick}
                                        />
                                        <Menu
                                            id="demo-positioned-menu"
                                            aria-labelledby="demo-positioned-button"
                                            anchorEl={anchorEl}
                                            open={menuOpen}
                                            onClose={handleClose}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                        >
                                            <MenuItem onClick={handleEditOpen}>Edit</MenuItem>
                                            <MenuItem onClick={() => handleDelete(post._id)}>Delete</MenuItem>
                                        </Menu>
                                    </Box>
                                )}
                                {loading ? (
                                    <Box height={400}>
                                        <Skeleton variant="rectangular" className="rounded-xl" width="100%" height={300} />
                                        <Skeleton variant="text" />
                                        <Skeleton variant="text" />
                                    </Box>
                                ) : (
                                    <>
                                        <Carousel
                                        >
                                            {Array.isArray(post.imageUrl) ? (
                                                post.imageUrl.map((url, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={url}
                                                        className="w-full h-auto object-contain rounded-lg"
                                                        alt={`Post Image ${idx + 1}`}
                                                    />
                                                ))
                                            ) : (
                                                <img
                                                    src={post.imageUrl}
                                                    className="w-full h-auto object-contain rounded-lg"
                                                    alt="Post"
                                                />
                                            )}
                                        </Carousel>
                                        <Typography id="post-modal-title" component="h2" mt={1}>
                                            Location: {post.location}
                                        </Typography>
                                        <Typography id="post-modal-description">
                                            Description: {post.description}
                                        </Typography>
                                        <IconButton size='small' aria-label="like" onClick={() => handleLike(post._id)}>
                                            {isLiked ? <FavoriteIcon color='error' /> : <FavoriteBorderOutlinedIcon />}
                                            {likeCount !== 0 && <Typography variant='body2'>{likeCount}</Typography>}
                                        </IconButton>
                                        <IconButton size='small' aria-label="comment" onClick={handleCommentClick}>
                                            {/* <MapsUgcOutlinedIcon /> */}
                                            <CommentIcon />
                                        </IconButton>
                                    </>
                                )}
                            </Box>
                            <Box />
                        </Stack>
                    </Box>
                    <PersistentDrawerRight open={drawerOpen} handleDrawerClose={handleDrawerClose} postId={post._id} comments={comments} />
                    <Dialog
                        open={editOpen}
                        onClose={handleEditClose}
                        aria-labelledby="form-dialog-title"
                    >
                        <DialogTitle id="form-dialog-title">Edit Post</DialogTitle>
                        <DialogContent>
                            <form id="myForm" onSubmit={handleEditPost}>
                                <TextField
                                    autoFocus
                                    margin="normal"
                                    id="description"
                                    label="Description"
                                    type="text"
                                    fullWidth
                                    defaultValue={post.description}
                                />
                                <TextField
                                    margin="dense"
                                    id="location"
                                    label="Location"
                                    type="text"
                                    fullWidth
                                    defaultValue={post.location}
                                />
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleEditClose} color="primary">
                                Cancel
                            </Button>
                            <Button type="submit" form="myForm" color="primary">
                                Save Changes
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </ClickAwayListener>



        </>
    );
};

export default PostModal;
