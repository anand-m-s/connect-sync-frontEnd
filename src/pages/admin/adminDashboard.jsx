import React from 'react'
import { Box, Divider, Stack } from '@mui/material'
import SideBar from '../../components/admin/sidebar/SideBar'
import BasicBars from '../../components/admin/dashboard/Dashboard'



function AdminDashboard() {

  return (
    <>
      <Box>
        <Stack direction='row' spacing={1}
          justifyContent={'space-between'}
          divider=<Divider orientation="vertical" flexItem /> >
          <Box
          flex={1.2}
          >
            <SideBar/>
          </Box>
          <BasicBars/>       
        </Stack>
      </Box>
    </>
  )
}

export default AdminDashboard