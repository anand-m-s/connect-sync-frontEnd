import React from 'react'
import Box from '@mui/material/Box';
import Navbar from '../Navbar/Navbar';
import { useMediaQuery, useTheme } from '@mui/material';

function SideBar() {

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <Box
            sx={{ flex: isSmallScreen ? 0 : .8 }}
        >
            <Box sx={{ position: 'sticky', top: 0 }}>
                <Navbar />
            </Box>
        </Box>


    )
}

export default SideBar



