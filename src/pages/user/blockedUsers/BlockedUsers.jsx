import { Box, Divider, Stack, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'
import { Toaster } from 'sonner'
import SideBar from '../../../components/user/sideBar/SideBar'
import RightBar from '../../../components/user/rightbar/rightBar';
import BlockedUsersList from '../../../components/user/blockedUsers/BlockedUser';

function BlockedUsers() {

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.up('sm' && 'md'));

  return (
    <>
    <Toaster />
    <Box>
      <Stack direction='row' spacing={1}
        justifyContent={'space-between'}
    //   divider={isSmallScreen ? <Divider orientation="vertical" flexItem /> : null}
      >
        {/* <Navbar /> */}
        <SideBar />
        <BlockedUsersList/>
        {isSmallScreen && <RightBar/>}
      </Stack>
    </Box>
  </>
  )
}

export default BlockedUsers