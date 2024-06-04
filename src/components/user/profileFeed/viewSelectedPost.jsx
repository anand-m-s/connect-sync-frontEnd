import React, { useState } from "react";
import { Modal, Box, Typography, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Carousel from "react-material-ui-carousel";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { userAxios } from "../../../constraints/axios/userAxios";
import userApi from "../../../constraints/api/userApi";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { setUserPosts } from "../../../services/redux/slices/userAuthSlice";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const PostModal = ({ isOpen, onRequestClose, imageUrl, determineUser }) => {

    const [editOpen, setEditOpen] = useState(false);
    const handleEditOpen = () => setEditOpen(true);
    const handleEditClose = () => setEditOpen(false);

    const post = useSelector((state) =>
        state.userAuth.posts.find((post) =>
            Array.isArray(post.imageUrl) ? post.imageUrl.includes(imageUrl) : post.imageUrl === imageUrl
        )
    );
    const posts = useSelector(state => state.userAuth.posts);
    const user = useSelector((state) => state.userAuth.userInfo)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    if (!post) return null;

    const handleDelete = async (postId) => {
        try {
            console.log(postId)
            await userAxios.delete(`${userApi.postDelete}/${postId}`)
            const updatedPosts = posts.filter(p => p._id !== postId);
            toast.success('post deleted');
            dispatch(setUserPosts(updatedPosts));
            handleClose();
            onRequestClose();
            // navigate('/profile', { replace: true });
        } catch (error) {
            if (error.response && error.response.data.error) {
                toast.error(error.response.data.error);
            }
        }
    }

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
    }

    return (
        <>
            <Modal
                open={isOpen}
                onClose={onRequestClose}
                aria-labelledby="post-modal-title"
                aria-describedby="post-modal-description"
            >
                <Stack direction='row' spacing={1} justifyContent={'space-between'}>
                    <Box sx={style}>
                        {user.id == determineUser && <Box className='flex justify-end mb-1 '>
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
                                <MenuItem onClick={handleEditOpen}>Edit</MenuItem>
                                <MenuItem onClick={() => handleDelete(post._id)}>Delete</MenuItem>
                            </Menu>
                        </Box>}
                        <Carousel
                        // autoPlay={false}
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
                        <Typography id="post-modal-title" variant="h6" component="h2" mt={2}>
                            Location: {post.location}
                        </Typography>
                        <Typography id="post-modal-description" >
                            Description: {post.description}
                        </Typography>
                    </Box>
                    <Box>

                    </Box>
                </Stack>
            </Modal>
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

        </>
    );
};

export default PostModal;







