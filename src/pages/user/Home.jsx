import React from 'react'
import { Toaster, toast } from 'sonner';
import Box from '@mui/material/Box';
import { Stack, useMediaQuery, useTheme } from '@mui/material';
import Feed from '../../components/user/feed/feed';
import RightBar from '../../components/user/rightbar/rightBar';
import SideBar from '../../components/user/sideBar/SideBar';
import Divider from '@mui/material/Divider';



function Home() {

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up('sm' && 'md'));

  return (
    <>
      <Toaster />
      <Box >
        <Stack direction='row'
          justifyContent={'space-between'}
          // divider={isSmallScreen ? <Divider orientation="vertical" flexItem /> : null}
        >
          <SideBar />
          <Feed />
          {isSmallScreen && <RightBar />}
        </Stack>
      </Box>
    </>
  )
}

export default Home
