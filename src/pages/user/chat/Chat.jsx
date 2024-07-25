import React from 'react'
import Stack from '@mui/material/Stack';
import { Box, Divider, ListItem, useMediaQuery, useTheme } from '@mui/material';
import Navbar from '../../../components/user/Navbar/Navbar';
import ChatComponent from '../../../components/user/chat/ChatComponent';
import SideBar from '../../../components/user/sideBar/SideBar';

function Chat() {

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <>
      <Box >
        <Stack direction="row" spacing={1}
          justifyContent={'space-between'}
        >
          {!isSmallScreen && <SideBar />}
          <ChatComponent />
        </Stack>
      </Box>
    </>
  )
}

export default Chat