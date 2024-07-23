import React from 'react';
import StyledBadge from './StyledBadge';
import Avatar from '@mui/material/Avatar';
import { getSender, getSenderProfilePic, isOnline } from '../../../constraints/config/chatLogic';

const ChatAvatar = ({ onlineUsers, user, chat }) => {
  const senderUserName = getSender(user.id, chat.users);
  const isUserOnline = isOnline(onlineUsers, senderUserName);
  const profilePic = getSenderProfilePic(user.id, chat.users);
  return (
    isUserOnline ? (
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
      >
        <Avatar className="h-12 w-12" src={profilePic} alt="Avatar">{senderUserName.substring(0,2)}</Avatar>
      </StyledBadge>
    ) : (
      <Avatar className="h-12 w-12" src={profilePic} alt="Avatar">{senderUserName.substring(0,2)}</Avatar>
    )
  );
};

export default ChatAvatar;
