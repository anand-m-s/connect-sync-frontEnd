import React from 'react'
import { getSenderFull } from '../../../constraints/config/chatLogic'
import { Avatar, Box, IconButton, useTheme } from '@mui/material'
import { MoreHoriz, Phone, VideoCall } from '@mui/icons-material'


function ChatHeader({ userId, selectedChat }) {
    const sender = getSenderFull(userId, selectedChat)
    const theme = useTheme();
    return (
        <>
         <Box
            className="flex items-center h-16 justify-between p-3"
            sx={{
                borderBottom: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.selectedChat.main,
            }}
        >
                <Box className="flex items-center gap-3">
                    <Avatar className="h-10 w-10" src={sender.profilePic} alt="Avatar">{sender.userName}</Avatar>
                    <Box>
                        <Box className="font-medium">{sender.userName}</Box>
                        <Box className="text-sm text-gray-500 dark:text-gray-400">Online</Box>
                    </Box>
                </Box>
                <Box className="flex items-center gap-2">
                    <IconButton size="small">
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
        </>
    )
}

export default ChatHeader