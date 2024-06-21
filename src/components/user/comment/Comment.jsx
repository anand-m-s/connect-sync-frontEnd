import React from 'react'
import { Avatar, Box, IconButton, Typography } from '@mui/material'
import ReplyIcon from '@mui/icons-material/Reply';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Comment({ avatarSrc, fallback, name, time, content, onReply, userId }) {
  const user = useSelector((state) => state.userAuth.userInfo)
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 0 }}>
      <Avatar src={avatarSrc}>{fallback}</Avatar>
      <Box sx={{ flex: 1 }}>

        <Box
        //  sx={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <Box className='flex justify-between '>
            <Typography variant="subtitle2" component={Link} to={`/profile?userId=${userId}`} >{name}</Typography>
            <Typography variant="caption" color="text.secondary"
              sx={{ marginRight: '3rem' }}
            >{time}
              {/* {user.id == userId && <IconButton >
                <MoreVertIcon fontSize='small' sx={{ height: '15px', width: '15px' }} />
              </IconButton>} */}
              <IconButton >
                <MoreVertIcon fontSize='small' sx={{ height: '15px', width: '15px' }} />
              </IconButton>
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" className='flex justify-start' >
          {content}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small" aria-label="reply" onClick={onReply}>
            <ReplyIcon sx={{ height: '16px', width: '16px' }} />
          </IconButton>
          {/* <IconButton size="small" aria-label="like">
            <ThumbUpIcon sx={{ height: '13px', width: '13px' }} />
          </IconButton> */}
          {/* <IconButton size="small" aria-label="dislike">
          <ThumbDownIcon fontSize="small" />
        </IconButton> */}
        </Box>
      </Box>
    </Box>
  )
}

export default Comment