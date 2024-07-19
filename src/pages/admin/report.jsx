import React from 'react'
import UserManagment from '../../components/admin/userManagment/UserManagment'
import { Box, Divider, Stack } from '@mui/material'
import SideBar from '../../components/admin/sidebar/SideBar'
import BasicBars from '../../components/admin/dashboard/Dashboard'
import PostReport from '../../components/admin/postReport/PostReport'


function Report() {
    return (
        <>
            <Box>
                <Stack direction='row' spacing={1}
                    justifyContent={'space-between'}
                    divider=<Divider orientation="vertical" flexItem /> >
                    <Box
                        flex={1.2}
                    >
                        <SideBar />

                    </Box>
         
                    <PostReport/>
                    

                </Stack>
            </Box>
        </>
    )
}


export default Report