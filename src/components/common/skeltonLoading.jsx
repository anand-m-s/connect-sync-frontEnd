import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

export default function SkeletonLoading() {
  return (
    <Stack spacing={2} p={2}>
      {[1, 2, 3, 4].map((item) => (
        <Box key={item} p={2}  borderRadius="8px" className='border'>
          <Stack direction="row" spacing={2} alignItems="center">
            <Skeleton variant="circular" width={40} height={40} />
            <Box flex={1}>
              <Skeleton variant="text" sx={{ fontSize: '1.25rem' }} width="40%" />
              <Skeleton variant="text" sx={{ fontSize: '0.875rem' }} width="60%" />
            </Box>
            <Skeleton variant="circular" width={24} height={24} />
          </Stack>
          <Box className='flex justify-center'>

          <Skeleton variant="rectangular" width="50%" height={350} sx={{ marginTop: 2 }} />
          </Box>
          <Divider sx={{ marginTop: 2 }} />
          <Skeleton variant="text" sx={{ fontSize: '1rem', marginTop: 2 }} width="80%" />
          <Skeleton variant="text" sx={{ fontSize: '1rem', marginTop: 2 }} width="60%" />
          <Divider sx={{ marginTop: 2 }} />
          <Stack direction="row" spacing={2} justifyContent="flex-start" sx={{ marginTop: 2 }}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="circular" width={24} height={24} />
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}

