import React from 'react'
import Box from '@mui/material/Box';
import Navbar from '../Navbar/Navbar';

function SideBar() {
    return (
        <Box className='bg-stone-500'
            flex={1}
          
        >
         <Navbar/>
        </Box>
    )
}

export default SideBar