import React from 'react'

import { Toaster, toast } from 'sonner';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Stack } from '@mui/material';
import ProfileFeed from '../../../components/user/profileFeed/profileFeed';
import RightBar from '../../../components/user/rightbar/rightBar';
import SideBar from '../../../components/user/sideBar/SideBar';
import Divider from '@mui/material/Divider';


function Profile() {

  return (
    <>
      <Toaster />
      <Box>
        <Stack direction='row' spacing={5}
          justifyContent={'space-between'}
          divider={<Divider orientation="vertical" flexItem />}
        >
          {/* <Navbar /> */}
          <SideBar/>
          <ProfileFeed/>
          <RightBar/>                 
        </Stack>
      </Box>
    </>
  )
}

export default Profile
