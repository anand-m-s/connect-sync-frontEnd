import React, {lazy,Suspense } from 'react'
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import CommentSection from '../user/comment/CommentSection';
const CommentSection = lazy(()=>import('../user/comment/CommentSection'))

const drawerWidth = 444;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(1),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: -444,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: -150,
        }),
        position: 'relative',
    }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));

export default function PersistentDrawerRight({ open, handleDrawerClose, postId }) {
    const theme = useTheme();
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Main open={open}>
                <DrawerHeader />
            </Main>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                    },
                    zIndex: 1301,
                }}
                variant="persistent"
                anchor="right"
                open={open}
            >
                <DrawerHeader
                    style={{
                        backgroundColor: theme.palette.mode === 'light' ? theme.palette.selectedChat.main : theme.palette.selectedChat.main,
                    }}
                >
                    <IconButton onClick={handleDrawerClose} className='justify-start'>

                        {/* {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />} */}
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        {/* <Typography>Back</Typography> */}
                    </IconButton>
                    <Typography className='flex justify-center'>Comments</Typography>
                </DrawerHeader>
                <Divider />
                <Box className="drawer-content">
                    <Suspense fallback={<>Loading...</>}>
                    <CommentSection postId={postId} />
                    </Suspense>
                </Box>
            </Drawer>
        </Box>
    );
}

