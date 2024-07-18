import React, { useEffect, useRef, useState } from 'react'
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles'
import { ParallaxScroll } from '../../ui/parallaxScroll';
import { Avatar, Button, ButtonBase, Divider, Grow, Slide, Typography, Zoom } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { userAxios } from '../../../constraints/axios/userAxios';
import userApi from '../../../constraints/api/userApi';
import { setUserPosts, resetNewPost } from '../../../services/redux/slices/userAuthSlice';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { setEditedUserCredentials } from '../../../services/redux/slices/userAuthSlice';
import { Toaster, toast } from 'sonner';
import { uploadImages } from '../../../constraints/axios/imageUpload';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { useLocation, useNavigate } from 'react-router';
import UserList from './FollowingAndFollowers';
import { logout } from '../../../services/redux/slices/userAuthSlice';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { useSocket } from '../../../services/socket';
import RazorpayPayment from '../razorPay/RazorPay';
import VerifiedIcon from '@mui/icons-material/Verified';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(0),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const useQuery = () => {
  return new URLSearchParams(useLocation().search)
}

function ProfileFeed() {
  const user = useSelector((state) => state.userAuth.userInfo)
  const posts = useSelector(state => state.userAuth.posts);
  const newPost = useSelector((state) => state.userAuth.newPost);
  const dispatch = useDispatch()
  const [openModal, setOpenModal] = useState(false);
  const [load, setLoad] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState({
    bio: user.bio || '',
    userName: user.userName || '',
    phone: user.phone || '',
    profilePic: user.profilePic || '',
    initialPic: '',
    verified: false,
    verifiedExp: ''
  });

  const [isFollowing, setIsFollowing] = useState(false)
  const [followers, setFollowers] = useState(false)
  const [following, setFollowing] = useState(false)
  const [connectionData, setConnectionData] = useState([])
  const [currentUserConnection, setCurrentUserConnection] = useState(null)
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const followersRef = useRef(null)
  const followingRef = useRef(null)
  const navigate = useNavigate()
  const { socket } = useSocket()
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };



  const updateUserData = (updates) => {
    setUserData((prevState) => ({
      ...prevState,
      ...updates
    }));
  };
  // userId 
  const query = useQuery();
  const userId = query.get('userId');
  const determineUser = userId || user.id

  const oneYearInMilliseconds = 365 * 24 * 60 * 60 * 1000;
  const verifiedExpDate = new Date(userData.verifiedExp);
  const isVerifiedWithinYear = (new Date() - verifiedExpDate) < oneYearInMilliseconds;

  const handleBlock = async() => {
    const res = await userAxios.post(`${userApi.blockUser}?id=${determineUser}`)
    if(res.status==200){
      toast.info(res.data.message)
      navigate('/home')
    }
    setAnchorEl(null);
  }



  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, userRes, followData, currentUserConnection,isBlocked] = await Promise.all([
          userAxios.get(`${userApi.getUserPost}?id=${determineUser}`),
          userAxios.get(`${userApi.getUserDetails}?id=${determineUser}`),
          userAxios.get(`${userApi.following}?userId=${determineUser}`),
          userAxios.get(`${userApi.following}?userId=${user.id}`),
          userAxios.get(`${userApi.isBlock}?id=${determineUser}`)          
        ]);
        console.log(isBlocked.data.isBlocked)
        
        if(isBlocked.data.isBlocked.isBlocked==true){
          toast.error(isBlocked.data.isBlocked.message)
          navigate('/home')
        }
        setConnectionData(followData.data.data)
        setCurrentUserConnection(currentUserConnection.data.data)
        dispatch(setUserPosts(postRes.data.post));
        const userData = userRes.data;
        updateUserData({
          bio: userData.bio || ' ',
          phone: userData.phone || ' ',
          userName: userData.userName,
          profilePic: userData.profilePic,
          initialPic: userData.profilePic,
          verified: userData.verified,
          verifiedExp: userData.verifyTagExp
        });
        setIsFollowing(userData.isFollowing)
        setFollowersCount(userData.followers)
        setFollowingCount(userData.following)
        if (newPost) {
          dispatch(resetNewPost())
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Redirect to login page if unauthorized
          toast.error(error.response.data.message);
          await new Promise(res => setTimeout(() => { res() }, 900))
          dispatch(logout());
          navigate('/login');
        } else {
          console.error('Error:', error.message);
          toast.error(error.response.data.error);
        }

      }
    };
    fetchData();

  }, [determineUser, newPost, isFollowing, followersCount]); //==================need to optimize this isFollowing
  // todo *inverted problem====================
  // optimize differentiate the fetches accordingly====================


  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const resetState = () => {
    setUserData({
      bio: '',
      userName: '',
      phone: '',
      profilePic: '',
      initialPic: ''
    });
    setLoad(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Selected file:', file.name);
      updateUserData({ profilePic: file });
    } else {
      console.error('No file selected');
    }
  };

  const handleSave = async () => {
    try {
      if (!userData.userName.trim()) {
        toast.error("Username cannot be empty");
        return;
      }
      const hasSymbols = /[^a-zA-Z0-9]/.test(userData.userName);
      if (hasSymbols) {
        toast.error("Username cannot contain symbols");
        return;
      }
      if (!/^\d{10}$/.test(userData.phone)) {
        toast.error("Phone number must be 10 digits");
        return;
      }
      console.log('inside submit for edit save')
      setLoad(true)
      let uploadedProfilePic = userData.profilePic
      if (userData.profilePic !== userData.initialPic) {
        const uploadImage = await uploadImages([userData.profilePic])
        console.log(uploadImage[0])
        uploadedProfilePic = uploadImage[0]
      }
      const updateUser = {
        // id: user.id,
        bio: userData.bio,
        userName: userData.userName,
        phone: userData.phone,
        profilePic: uploadedProfilePic
      };
      const res = await userAxios.put(`${userApi.editProfile}`, updateUser)
      console.log(res.data.updatedUser)
      const updatedUser = {
        ...user,
        ...res.data.updatedUser
      }
      console.log(updatedUser)
      dispatch(setEditedUserCredentials(updatedUser))
      toast.success(res.data.message)
      await new Promise(res => setTimeout(() => { res() }, 1500))
      resetState()
      updateUserData(updatedUser)
      setOpenModal(false);
    } catch (error) {
      console.error('error updation profile', error)
      if (error.response && error.response.data.error) {
        toast.error(error.response.data.error);
      }

    } finally {
      setLoad(false)
    }
  }


  const handleFollow = async (userId) => {
    try {
      const res = await userAxios.post(`${userApi.followUser}`, { userIdToToggle: userId })
      setIsFollowing((prevVal) => !prevVal)
      toast.info(res.data.message)
      if (res.data.message == 'following') {
        if (socket) {
          socket.emit('followed', { userId, followedBy: user.userName })
        }
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        toast.error(error.response.data.error);
      }
    }
  }

  const handleDirectMessage = async (userId) => {
    navigate(`/chat?id=${userId}`)
  }

  const showFollowers = () => {
    setFollowers((prev) => !prev)
    setFollowing(false)
  }
  const showFollowing = () => {
    setFollowing((prev) => !prev)
    setFollowers(false)
  }

  useEffect(() => {
    setFollowers(false)
    setFollowing(false)
  }, [determineUser])

  const handleFollowChange = () => {
    if (isFollowing) {

      setFollowersCount(prevCount => prevCount + 1);
    } else {

      setFollowersCount(prevCount => prevCount - 1);
    }
  };

  const handleClickAwayFollowers = () => {
    setFollowers(false);
  };

  const handleClickAwayFollowing = () => {
    setFollowing(false);
  }

  return (
    <Box
      flex={5}
      p={2}
    >
      <Toaster richColors />
      <Stack spacing={1} >
        <Item square elevation={0}>
          <Box sx={{ padding: 1 }} >
            <Box className="flex flex-wrap">
              {user.id !== determineUser && <Box className='flex justify-end w-full mt-4 cursor-pointer'>
                <Box
                  id="basic-button"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                >
                  <MoreVertIcon />
                </Box>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem onClick={handleBlock}>Block</MenuItem>
                </Menu>
              </Box>}
              <Avatar
                src={userData.profilePic || user.profilePic}
                sx={{ width: 130, height: 130, marginRight: 5, marginLeft: 10 }}
              />
              <Box className="mt-10 ">
                <Box className='flex items-center '>
                  <Typography variant="body1" noWrap>
                    {userData.userName || user.userName}
                  </Typography>

                  {isVerifiedWithinYear ? (
                    <VerifiedIcon color='primary' fontSize='small' className='ml-1' />
                  ) : (
                    user.userName === userData.userName && <RazorpayPayment />
                  )}
                  {/* <RazorpayPayment />  */}
                </Box>
                <Box>
                  <Typography>{userData.bio || user.bio}</Typography>
                </Box>

              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-around', marginBottom: 2, paddingBottom: 2, marginTop: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6">{posts.length}</Typography>
                <Typography variant="subtitle2" color="textSecondary">Posts</Typography>
              </Box>


              <ClickAwayListener onClickAway={handleClickAwayFollowers}>
                <ButtonBase>
                  <Box
                    sx={{
                      textAlign: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      // zIndex: '1'
                    }} onClick={showFollowers} ref={followersRef}>
                    <Typography variant="h6">{followingCount}</Typography>
                    <Typography variant="subtitle2" color="textSecondary">Followers</Typography>
                    <Box sx={{ position: 'absolute', top: 55, left: '50%', transform: 'translateX(-50%)', zIndex: '2', width: '25rem' }}>
                      {followers && followingCount > 0 && (
                        <Zoom in={followers} container={followersRef.current} style={{ transitionDelay: followers ? '300ms' : '0ms' }}>
                          <Paper elevation={5}>
                            <UserList
                              users={connectionData.followers}
                              currentUserFollowing={currentUserConnection.following.map(user => user._id)}
                              onFollowChange={handleFollowChange}
                            />
                          </Paper>
                        </Zoom>
                      )}
                    </Box>
                  </Box>
                </ButtonBase>
              </ClickAwayListener>

              <ClickAwayListener onClickAway={handleClickAwayFollowing}>
                <ButtonBase>
                  <Box
                    sx={{
                      textAlign: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      // zIndex: '1'
                    }} onClick={showFollowing} ref={followingRef}>
                    <Typography variant="h6">{followersCount}</Typography>
                    <Typography variant="subtitle2" color="textSecondary">Following</Typography>
                    <Box sx={{ position: 'absolute', top: 55, left: '50%', transform: 'translateX(-50%)', zIndex: '2', width: '25rem' }}>
                      {following && followersCount > 0 && (
                        <Zoom in={following} container={followingRef.current} style={{ transitionDelay: following ? '300ms' : '0ms' }}>
                          <Paper elevation={5}>
                            <UserList
                              users={connectionData.following}
                              currentUserFollowing={currentUserConnection.following.map(user => user._id)}
                              onFollowChange={handleFollowChange}
                            />
                          </Paper>
                        </Zoom>
                      )}
                    </Box>
                  </Box>
                </ButtonBase>
              </ClickAwayListener>
            </Box>
            {!userId || userId === user.id ? (
              <Box sx={{ display: 'flex', justifyContent: 'space-around', marginBottom: 2 }}>
                <Button variant="contained" color="info" size="small" onClick={handleOpenModal}>
                  Edit profile
                </Button>
                <Button variant="contained" color="info" size="small">
                  Share profile
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'space-around', marginBottom: 2 }}>
                <Button
                  variant="contained"
                  color={isFollowing ? 'error' : 'info'}
                  size="small"
                  onClick={() => handleFollow(userId)}
                  sx={{
                    backgroundColor: isFollowing ? '#e64b40' : '', // light red for 'Unfollow'
                    transition: 'background-color 0.3s ease, color 0.3s ease',
                  }}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
                <Button variant="contained" color="info" size="small" onClick={() => handleDirectMessage(determineUser)}>
                  Message
                </Button>
              </Box>
            )}
          </Box>
        </Item>
        <Divider />
        <Item elevation={0} square ><ParallaxScroll determineUser={determineUser} posts={posts} /></Item>
      </Stack>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack spacing={3}>
            <TextField
              label="User name"
              multiline
              value={userData.userName}
              variant="standard"
              fullWidth
              onChange={(e) => updateUserData({ userName: e.target.value })}
            />
            <TextField
              label="Bio"
              multiline
              value={userData.bio}

              variant="standard"
              fullWidth
              onChange={(e) => updateUserData({ bio: e.target.value })}
            />
            <TextField
              label="Phone"
              value={userData.phone}
              multiline
              variant="standard"
              fullWidth
              onChange={(e) => updateUserData({ phone: e.target.value })}
            />
            <Box className='flex'>
              {/* <Avatar
                sx={{ width: 56, height: 56 }}
                src={userData.profilePic||user.profilePic}
              >
              </Avatar> */}
              <Button size='small' component='label' variant='outlined' color='info'>
                change profile picture
                <input type="file" hidden
                  onChange={handleImageChange}
                />
              </Button>
            </Box>
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
            <Button variant='contained' color='info' onClick={handleSave}>Save</Button>
            <Button onClick={handleCloseModal}>Close</Button>
          </Box>
          {load && <BorderLinearProgress className='m-5' />}
        </Box>
      </Modal>
    </Box>
  )
}

export default ProfileFeed
