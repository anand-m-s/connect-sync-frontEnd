import React from 'react'
import { Avatar, Box, IconButton, Typography } from '@mui/material'
import ReplyIcon from '@mui/icons-material/Reply';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

function Comment({ avatarSrc, fallback, name, time, text, onReply }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
      <Avatar src={avatarSrc}>{fallback}</Avatar>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="subtitle2">{name}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ marginRight: '3rem' }}>{time}</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {text}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small" aria-label="reply" onClick={onReply}>
            <ReplyIcon sx={{ height: '16px', width: '16px' }} />
          </IconButton>
          <IconButton size="small" aria-label="like">
            <ThumbUpIcon sx={{ height: '13px', width: '13px' }} />
          </IconButton>
          {/* <IconButton size="small" aria-label="dislike">
          <ThumbDownIcon fontSize="small" />
        </IconButton> */}
        </Box>
      </Box>
    </Box>
  )
}

export default Comment