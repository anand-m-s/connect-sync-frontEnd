import React from 'react'
import Box from '@mui/material/Box';
import Navbar from '../Navbar/Navbar';

function SideBar() {
    return (
        <Box
            flex={.8}
            // padding={1}
        >
            <Box sx={{ position: 'sticky', top: 0 }}>
                <Navbar />
            </Box>
        </Box>


    )
}

export default SideBar



