import React from 'react'
import Post from '../Post/post'
import Box from '@mui/material/Box';
import BasicModal from '../modal/Modal';


function Feed() {





  return (
    <Box className=''
      flex={4}
      p={4}
    >
      <div className='p-6'>
      
      </div>
      <Post />
      <Post />
      <Post />
      <Post />
      <BasicModal/>
    </Box>
  )
}

export default Feed