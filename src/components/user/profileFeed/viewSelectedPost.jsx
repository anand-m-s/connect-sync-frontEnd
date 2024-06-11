import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Carousel from "react-material-ui-carousel";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { userAxios } from "../../../constraints/axios/userAxios";
import userApi from "../../../constraints/api/userApi";
import { Toaster, toast } from "sonner";
import { setUserPosts } from "../../../services/redux/slices/userAuthSlice";
import PersistentDrawerRight from "../../common/persistentDrawer";
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';


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
    zIndex: -1
};

const PostModal = ({ isOpen, onRequestClose, imageUrl, determineUser }) => {
    

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(0)
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
    const dispatch = useDispatch();
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

    // useEffect(() => {
    //     const fetchLikeStatus = async () => {
    //         try {
    //             // console.log(post._id)
    //             // const res = await userAxios.get(`${userApi.likeStatus}?postId=${post._id}`);                
    //             // setIsLiked(res.data.isLiked);
    //             // setLikeCount(res.data.likeCount)
    //         } catch (error) {
    //             console.error('Error fetching like status:', error);
    //         }
    //     };
    //     fetchLikeStatus();
    //     // return () => {
    //     //     setIsLiked(false)
    //     // }

    // }, []);





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


    const handleLike = async (postId) => {
        try {
            console.log(postId)
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

    return (
        <>
            <Modal
                open={isOpen}
                onClose={onRequestClose}
                aria-labelledby="post-modal-title"
                aria-describedby="post-modal-description"
            // slotProps={{ backdrop: { invisible: true } }}                
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
                        <Typography id="post-modal-title" component="h2" mt={2}>
                            Location: {post.location}
                        </Typography>
                        <Typography id="post-modal-description" >
                            Description: {post.description}
                        </Typography>
                        <IconButton size='small' aria-label="like" onClick={() => handleLike(post._id)}>
                            {isLiked ? <FavoriteIcon color='error' /> : <FavoriteBorderOutlinedIcon />}
                        </IconButton>
                        <IconButton size='small' aria-label="comment" onClick={handleCommentClick}>
                            <MapsUgcOutlinedIcon />
                        </IconButton>
                    </Box>
                    <Box>

                    </Box>
                </Stack>
            </Modal>

            <PersistentDrawerRight open={drawerOpen} handleDrawerClose={handleDrawerClose} postId={post._id} />


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
































// import React, { useEffect, useState } from "react";
// import { Drawer, Box, Typography, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import Carousel from "react-material-ui-carousel";
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import { userAxios } from "../../../constraints/axios/userAxios";
// import userApi from "../../../constraints/api/userApi";
// import { Toaster, toast } from "sonner";
// import { useNavigate } from "react-router-dom";
// import { setUserPosts } from "../../../services/redux/slices/userAuthSlice";
// import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';
// import PersistentDrawerRight from "../../common/persistentDrawer";


// const PostModal = ({ isOpen, onRequestClose, imageUrl, determineUser }) => {
//     const [drawerOpen, setDrawerOpen] = useState(false);
//     const handleCommentClick = () => {
//         setDrawerOpen((prev) => !prev);
//     };

//     const handleDrawerClose = () => {
//         setDrawerOpen(false);
//     };

//     useEffect(() => {
//         if (drawerOpen) {
//             document.body.classList.add('no-scroll');
//         } else {
//             document.body.classList.remove('no-scroll');
//         }
//     }, [drawerOpen]);

//     const [editOpen, setEditOpen] = useState(false);
//     const handleEditOpen = () => setEditOpen(true);
//     const handleEditClose = () => setEditOpen(false);

//     const post = useSelector((state) =>
//         state.userAuth.posts.find((post) =>
//             Array.isArray(post.imageUrl) ? post.imageUrl.includes(imageUrl) : post.imageUrl === imageUrl
//         )
//     );
//     const posts = useSelector(state => state.userAuth.posts);
//     const user = useSelector((state) => state.userAuth.userInfo);
//     const [anchorEl, setAnchorEl] = useState(null);
//     const open = Boolean(anchorEl);
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     const handleClick = (event) => {
//         setAnchorEl(event.currentTarget);
//     };
//     const handleClose = () => {
//         setAnchorEl(null);
//     };

//     if (!post) return null;

//     const handleDelete = async (postId) => {
//         try {
//             await userAxios.delete(`${userApi.postDelete}/${postId}`);
//             const updatedPosts = posts.filter(p => p._id !== postId);
//             toast.success('Post deleted');
//             dispatch(setUserPosts(updatedPosts));
//             handleClose();
//             onRequestClose();
//         } catch (error) {
//             if (error.response && error.response.data.error) {
//                 toast.error(error.response.data.error);
//             }
//         }
//     };

//     const handleEditPost = async (e) => {
//         try {
//             e.preventDefault();
//             const updatedPost = {
//                 ...post,
//                 description: e.target.elements.description.value,
//                 location: e.target.elements.location.value
//             };
//             await userAxios.put(`${userApi.editPost}`, updatedPost);
//             toast.success('Post updated successfully');
//             const updatedPosts = posts.map(p => p._id === post._id ? updatedPost : p);
//             dispatch(setUserPosts(updatedPosts));
//             handleClose();
//             handleEditClose();
//             onRequestClose();
//         } catch (error) {
//             if (error.response && error.response.data.error) {
//                 toast.error(error.response.data.error);
//             }
//         }
//     };

//     return (
//         <>
//             <Drawer
//                 anchor="left"
//                 open={isOpen}
//                 onClose={onRequestClose}
//                 PaperProps={{ style: { width: '400px', zIndex: 1300 } }}
//             >
//                 <Box sx={{ p: 4 }}>
//                     {user.id === determineUser && (
//                         <Box className='flex justify-end mb-1'>
//                             <MoreVertIcon
//                                 id="demo-positioned-button"
//                                 aria-controls={open ? 'demo-positioned-menu' : undefined}
//                                 aria-haspopup="true"
//                                 aria-expanded={open ? 'true' : undefined}
//                                 onClick={handleClick}
//                             />
//                             <Menu
//                                 id="demo-positioned-menu"
//                                 aria-labelledby="demo-positioned-button"
//                                 anchorEl={anchorEl}
//                                 open={open}
//                                 onClose={handleClose}
//                                 anchorOrigin={{
//                                     vertical: 'top',
//                                     horizontal: 'left',
//                                 }}
//                                 transformOrigin={{
//                                     vertical: 'top',
//                                     horizontal: 'left',
//                                 }}
//                             >
//                                 <MenuItem onClick={handleEditOpen}>Edit</MenuItem>
//                                 <MenuItem onClick={() => handleDelete(post._id)}>Delete</MenuItem>
//                             </Menu>
//                         </Box>
//                     )}
//                     <Carousel>
//                         {Array.isArray(post.imageUrl) ? (
//                             post.imageUrl.map((url, idx) => (
//                                 <img
//                                     key={idx}
//                                     src={url}
//                                     className="w-full h-auto object-contain rounded-lg"
//                                     alt={`Post Image ${idx + 1}`}
//                                 />
//                             ))
//                         ) : (
//                             <img
//                                 src={post.imageUrl}
//                                 className="w-full h-auto object-contain rounded-lg"
//                                 alt="Post"
//                             />
//                         )}
//                     </Carousel>
//                     <Typography variant="h6" component="h2" mt={2}>
//                         Location: {post.location}
//                     </Typography>
//                     <Typography>
//                         Description: {post.description}
//                     </Typography>
//                     <IconButton size='small' aria-label="comment" onClick={handleCommentClick}>
//                         <MapsUgcOutlinedIcon />
//                     </IconButton>
//                 </Box>
//                 <PersistentDrawerRight open={drawerOpen} handleDrawerClose={handleDrawerClose} postId={post._id} />
//             </Drawer>

//             <Dialog
//                 open={editOpen}
//                 onClose={handleEditClose}
//                 aria-labelledby="form-dialog-title"
//             >
//                 <DialogTitle id="form-dialog-title">Edit Post</DialogTitle>
//                 <DialogContent>
//                     <form id="myForm" onSubmit={handleEditPost}>
//                         <TextField
//                             autoFocus
//                             margin="normal"
//                             id="description"
//                             label="Description"
//                             type="text"
//                             fullWidth
//                             defaultValue={post.description}
//                         />
//                         <TextField
//                             margin="dense"
//                             id="location"
//                             label="Location"
//                             type="text"
//                             fullWidth
//                             defaultValue={post.location}
//                         />
//                     </form>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleEditClose} color="primary">
//                         Cancel
//                     </Button>
//                     <Button type="submit" form="myForm" color="primary">
//                         Save Changes
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </>
//     );
// };

// export default PostModal;







