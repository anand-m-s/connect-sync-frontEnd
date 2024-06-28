import React, { useEffect, useState } from 'react';
import { getSenderFull } from '../../../constraints/config/chatLogic';
import { Avatar, Box, IconButton, useTheme } from '@mui/material';
import { MoreHoriz, Phone, VideoCall } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../../services/socket';
import { useOnlineUsers } from '../../../context/OnlineUsers';
import StyledBadge from '../../ui/miniComponents/StyledBadge';

function ChatHeader({ userId, selectedChat }) {
  const sender = getSenderFull(userId, selectedChat);
  const { socket } = useSocket()
  const theme = useTheme();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(false)
  const { onlineUsers } = useOnlineUsers()

  const checkOnline = () => {
    const isUserOnline = onlineUsers.some((ele) => ele.id === sender._id);
    setIsOnline(isUserOnline);
  };

  useEffect(() => {
    checkOnline();
  }, [sender, onlineUsers]);



  const handleVideoCallClick = () => {
    const roomId = selectedChat[1]._id;
    socket?.emit('video-call', {
      roomId,
      callerId: userId,
      recipientId: sender._id,
    });
    navigate(`/video-call/${roomId}`);
  };


  return (
    <Box
      className="flex items-center h-16 justify-between p-3"
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.selectedChat.main,
      }}
    >
      <Box className="flex items-center gap-3">
        {isOnline ? (<StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
        >
          <Avatar className="h-10 w-10" src={sender.profilePic} alt="Avatar">{sender.userName}</Avatar>
        </StyledBadge>) : (
          <Avatar className="h-10 w-10" src={sender.profilePic} alt="Avatar">{sender.userName}</Avatar>
        )}
        <Box>
          <Box className="font-medium">{sender.userName}</Box>
          <Box className="text-sm text-gray-500 dark:text-gray-400">{isOnline ? 'Online' : 'offline'}</Box>
        </Box>
      </Box>
      <Box className="flex items-center gap-2">
        <IconButton size="small" onClick={handleVideoCallClick}>
          <VideoCall className="h-5 w-5" />
        </IconButton>
        <IconButton size="small">
          <Phone className="h-5 w-5" color='success' />
        </IconButton>
        <IconButton size="small">
          <MoreHoriz className="h-5 w-5" />
        </IconButton>
      </Box>
    </Box>
  );
}

export default ChatHeader;

