import React from 'react'
import { Toaster, toast } from 'sonner';
import Box from '@mui/material/Box';
import { Stack, useMediaQuery, useTheme } from '@mui/material';
import ProfileFeed from '../../../components/user/profileFeed/profileFeed';
import RightBar from '../../../components/user/rightbar/rightBar';
import SideBar from '../../../components/user/sideBar/SideBar';
import Divider from '@mui/material/Divider';



function Profile() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up('sm' && 'md'));
  return (
    <>
      <Toaster />
      <Box>
        <Stack direction='row' spacing={1}
          justifyContent={'space-between'}
        // divider={isSmallScreen ? <Divider orientation="vertical" flexItem /> : null}
        >
          {/* <Navbar /> */}
          <SideBar />
          <ProfileFeed />
          {isSmallScreen && <RightBar />}
        </Stack>
      </Box>
    </>
  )
}

export default Profile
