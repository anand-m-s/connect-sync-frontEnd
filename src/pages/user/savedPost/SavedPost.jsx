import { Box, Stack, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'
import { Toaster } from 'sonner'
import SideBar from '../../../components/user/sideBar/SideBar'
import SavedPostContainer from '../../../components/user/savedPost/Saved';
import RightBar from '../../../components/user/rightbar/rightBar';

function SavedPost() {

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
        <SavedPostContainer/>
        {isSmallScreen && <RightBar/>}
      </Stack>
    </Box>
  </>
  )
}

export default SavedPost