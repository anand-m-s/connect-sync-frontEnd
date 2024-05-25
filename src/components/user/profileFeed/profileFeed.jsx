import React, { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles'
import BasicModal from '../modal/Modal';
import { ParallaxScroll } from '../../ui/parallaxScroll';
import { Avatar, Button, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { userAxios } from '../../../constraints/axios/userAxios';
import userApi from '../../../constraints/api/userApi';
import { setUserPosts } from '../../../services/redux/slices/userAuthSlice';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { setEditedUserCredentials } from '../../../services/redux/slices/userAuthSlice';
import { Toaster, toast } from 'sonner';
import { uploadImages } from '../../../constraints/axios/imageUpload';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

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

function ProfileFeed() {
  const user = useSelector((state) => state.userAuth.userInfo)
  const posts = useSelector(state => state.userAuth.posts);
  const dispatch = useDispatch()
  const [openModal, setOpenModal] = useState(false);
  const [bio, setBio] = useState(user.bio || '');
  const [userName, setUserName] = useState(user.userName || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [profilePic,setProfilePic] = useState(user.profilePic||'');
  const [initialPic,setInitialPic]=useState('')
  const [load,setLoad]=useState(false)
  const imageUrl = posts.map(post => post.imageUrl);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await userAxios.get(`${userApi.getUserPost}?id=${user.id}`);
        dispatch(setUserPosts(res.data.post))
      } catch (error) {
        console.error('Error fetching user post:', error);
      }
    };
    const fetchUserDetails = async () => {
      let res = await userAxios.get(`${userApi.getUserDetails}?id=${user.id}`)
      // console.log(res.data)
      setBio(res.data.bio)
      setPhone(res.data.phone)
      setUserName(res.data.userName)
      setProfilePic(res.data.profilePic)
      setInitialPic(res.data.profilePic)
    }
    fetchData();
    if (openModal) {

      fetchUserDetails();
    }

  }, [openModal]);


  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const resetState = () => {
    setBio('')
    setUserName('')
    setPhone('')
    setProfilePic('')
    setLoad(false)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Selected file:', file.name);
      setProfilePic(file);
    } else {
      console.error('No file selected');
    }
  };
  
  const handleSave = async () => {
    try {
      console.log('inside submit for edit save')
      setLoad(true)
      let uploadedProfilePic=profilePic
      if(profilePic!==initialPic){
        const uploadImage = await uploadImages([profilePic])
        console.log(uploadImage[0])
        uploadedProfilePic =uploadImage[0]
      }
      const updateUser = { id: user.id, bio, userName, phone,profilePic:uploadedProfilePic}
      const res = await userAxios.put(`${userApi.editProfile}`, updateUser)

      const updatedUser = {
        ...user,
        ...res.data.updatedUser
      }
      toast.success(res.data.message)
      // console.log(res)
      // console.log(res.data)
      // console.log(res.data.updatedUser)
      // console.log(updatedUser)
      dispatch(setEditedUserCredentials(updatedUser))
      await new Promise(res => setTimeout(() => { res() }, 1000))
      resetState()
      setOpenModal(false);
    } catch (error) {
      console.error('error updation profile', error)
      if (error.response && error.response.data.error) {
        toast.error(error.response.data.error);
      }

    }
  }


  return (
    <Box className=''
      flex={5}
      p={2}
    >
      {/* <Toaster richColors position='top-right'/> */}
      <Stack spacing={1} >
        <Item>
          <Box sx={{ padding: 1 }} square>
            <Box className=' flex'>
              <Avatar
                src={user.profilePic}
                sx={{ width: 130, height: 130, marginRight: 5, marginLeft: 10 }}
              />
              <Box className='mt-10'>
                <Typography variant='h6'>
                  {user.userName}
                </Typography>
                <Typography>
                  {user.bio ? user.bio : ''}
                </Typography>
              </Box>

            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', marginBottom: 2, paddingBottom: 2, marginTop: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant='h6'>26</Typography>
                <Typography variant='subtitle2' color='textSecondary'>Posts</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant='h6'>0</Typography>
                <Typography variant='subtitle2' color='textSecondary'>Followers</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant='h6'>0</Typography>
                <Typography variant='subtitle2' color='textSecondary'>Following</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', marginBottom: 2 }}>
              <Button variant='contained' color='info' size='small' onClick={handleOpenModal}>
                Edit profile
              </Button>

              <Button variant='contained' color='info' size='small'>
                MESSAGE
              </Button>
            </Box>

          </Box>
        </Item>
        <Item ><ParallaxScroll images={imageUrl} /></Item>
      </Stack>


      <BasicModal />
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
              value={userName}
              variant="standard"
              fullWidth
              onChange={(e) => setUserName(e.target.value)}
            />
            <TextField
              label="Bio"
              multiline
              value={bio}

              variant="standard"
              fullWidth
              onChange={(e) => setBio(e.target.value)}
            />
            <TextField
              label="Phone"
              value={phone}
              multiline
              variant="standard"
              fullWidth
              onChange={(e) => setPhone(e.target.value)}
            />
            <Box className='flex'>
              <Avatar 
              sx={{width:56,height:56}}
              src={user.profilePic}
              >              
              </Avatar>
              <Button size='small' component='label'>
                Upload photo
                <input type="file"hidden
                onChange={handleImageChange}
                />
              </Button>
            </Box>
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
            <Button variant='outlined' color='info' onClick={handleSave}>Save</Button>
            <Button onClick={handleCloseModal}>Close</Button>
          </Box>
          {load &&  <BorderLinearProgress/>}
        </Box>
      </Modal>




    </Box>
  )
}

export default ProfileFeed