import React, { useState } from 'react'
import { Avatar, Box, IconButton, Menu, MenuItem, Typography, useTheme } from '@mui/material'
import ReplyIcon from '@mui/icons-material/Reply';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { userAxios } from '../../../constraints/axios/userAxios';
import userApi from '../../../constraints/api/userApi';

function Comment({ avatarSrc, fallback, name, time, content, onReply, userId, postOwnerId, commentId, fetchAgain }) {

  const user = useSelector((state) => state.userAuth.userInfo)
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  }
  const theme = useTheme()
  const handleClose = () => {
    setAnchorEl(null);
  }

  const handleCommentDelete = async (id) => {
    try {
      handleClose()
      const res = await userAxios.delete(`${userApi.deleteComment}?id=${id}`)
      toast.info(res.data.message)
      fetchAgain()
    } catch (error) {
      if (error.response && error.response.data.error) {
        console.log(error.response.data.error);
        toast.error('delete error')
      }
    }
  }

  return (
    <Box className='rounded-md mt-3 shadow-md'
      sx={{
        display: 'flex', gap: 1, mb: 0,
        // border: `1px solid ${theme.palette.divider}`,

        backgroundColor: theme.palette.comments.main,
      }}
    >
      <Box className='p-2 mt-2'>

        <Avatar src={avatarSrc}>{fallback}</Avatar>
      </Box>
      <Box sx={{ flex: 1 }}>

        <Box
        //  sx={{ display: 'flex', justifyContent: 'space-between' }}

        >
          <Box className='flex mt-1 justify-between '>
            <Box className=''>

              <Typography variant="subtitle2" component={Link} to={`/profile?userId=${userId}`} >{name}</Typography>
            </Box>
            <Box className='flex justify-end items-center mr-2'>
              <Typography variant="caption" color="text.secondary"
              >{time}
              </Typography>
              {(user.id === userId || user.id === postOwnerId) && (
                <>
                  <IconButton onClick={handleClick}>
                    <MoreVertIcon fontSize="small" sx={{ height: '11px', width: '11px' }} />
                  </IconButton>
                  <Menu
                    id="demo-positioned-menu"
                    aria-labelledby="demo-positioned-button"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                  >
                    <MenuItem
                      onClick={() => handleCommentDelete(commentId)}
                    >Delete</MenuItem>
                  </Menu>
                </>
              )}

            </Box>


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

