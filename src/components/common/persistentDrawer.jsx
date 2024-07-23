import React, { lazy, Suspense } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useMediaQuery } from '@mui/material';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

const CommentSection = lazy(() => import('../user/comment/CommentSection'));

const drawerWidth = 420;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(1),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: -drawerWidth,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: 0,
        }),
        position: 'relative',
    })
);

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
    // backdropFilter: 'blur(33px)', // Apply blur effect
    // backgroundColor: 'rgba(255, 255, 255, 0.5)', 
  }));

export default function PersistentDrawerRight({ open, handleDrawerClose, postId, comments, postOwnerId }) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const drawerContent = (
        <>
            <DrawerHeader
                style={{ backgroundColor: theme.palette.mode === 'light' ? theme.palette.selectedChat.main : theme.palette.selectedChat.main }}
            >
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
                <Typography>Comments</Typography>
            </DrawerHeader>
            <Divider />
            <Box className="drawer-content">
                <Suspense fallback={<>Loading...</>}>
                    <CommentSection postId={postId} comments={comments} postOwnerId={postOwnerId} />
                </Suspense>
            </Box>
        </>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Main open={open} >
                <DrawerHeader />
            </Main>
            {isSmallScreen ? (
                <SwipeableDrawer
                    anchor="bottom"
                    open={open}
                    onClose={handleDrawerClose}
                    onOpen={() => { }}
                    disableSwipeToOpen={false}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: '100%',
                            height: '77%',
                        },
                    }}
                >
                    {drawerContent}
                </SwipeableDrawer>                
            ) : (
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                        },
                    }}
                    variant="persistent"
                    anchor="right"
                    open={open}
                >
                    {drawerContent}
                </Drawer>
            )}
        </Box>
    );
}


