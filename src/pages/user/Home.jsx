import React from 'react'
import Navbar from '../../components/user/Navbar/Navbar'
import { Toaster, toast } from 'sonner';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Stack } from '@mui/material';
import Feed from '../../components/user/feed/feed';
import RightBar from '../../components/user/rightbar/rightBar';
import SideBar from '../../components/user/sideBar/SideBar';
import Divider from '@mui/material/Divider';


function Home() {

  return (
    <>
      <Toaster />
      <Box>
        <Stack direction='row' spacing={5}
          justifyContent={'space-between'}
          divider={<Divider orientation="vertical" flexItem/>}
        >
          {/* <Navbar /> */}
          <SideBar/>
          <Feed/>
          <RightBar/>
         
        
        </Stack>
      </Box>
    </>
  )
}

export default Home