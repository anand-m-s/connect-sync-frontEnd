import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import useMediaQuery from '@mui/material/useMediaQuery';
import './Navbar.css';
import { useEffect } from 'react'
import CycloneIcon from '@mui/icons-material/Cyclone';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { logout } from '../../../services/redux/slices/userAuthSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { Toaster, toast } from 'sonner';


const Navbar = () => {
    const [state, setState] = React.useState({
        left: false,
    });
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = React.useState(null);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.up('sm'));
    const toggleDrawer = (open) => (event) => {
        if (!isSmallScreen) {
            if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
                return;
            }
            setState({ left: open });
        }

    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        dispatch(logout());
        toast.info('logout successfull')
        navigate('/login')
    }
    const list = () => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>

                <ListItem disablePadding>
                    <ListItemButton onClick={toggleDrawer(true)}>
                        <ListItemIcon>
                            <CycloneIcon color='info' />
                        </ListItemIcon>
                        <ListItemText primary={"Connect sync"} />
                    </ListItemButton>
                </ListItem>
                <Divider />

                <ListItem disablePadding>
                    <ListItemButton onClick={toggleDrawer(true)}>
                        <ListItemIcon>
                            <HomeIcon color='primary' />
                        </ListItemIcon>
                        <ListItemText primary={"Home"} />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <SearchOutlinedIcon color='info' />
                        </ListItemIcon>
                        <ListItemText primary={"Search"} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <ExploreOutlinedIcon color='error' />
                        </ListItemIcon>
                        <ListItemText primary={"Explore"} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <ChatBubbleOutlineOutlinedIcon color='info' />
                        </ListItemIcon>
                        <ListItemText primary={"Message"} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <NotificationsNoneOutlinedIcon color='primary' />
                        </ListItemIcon>
                        <ListItemText primary={"Notification"} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <AddCircleOutlineOutlinedIcon color='primary' />
                        </ListItemIcon>
                        <ListItemText primary={"Create"} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <PersonOutlineOutlinedIcon color='primary' />
                        </ListItemIcon>
                        <ListItemText primary={"Profile"} />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleClick}>
                        <ListItemIcon>
                            <MoreHorizOutlinedIcon color='primary' />
                        </ListItemIcon>
                        <ListItemText primary={"More"} />
                    </ListItemButton>
                </ListItem>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem
                        onClick={handleLogout}
                        sx={{
                            padding: '10px 60px',
                        }}
                    >
                        Logout
                    </MenuItem>
                    <MenuItem
                        onClick={handleClose}
                        sx={{
                            padding: '10px 60px',
                        }}
                    >
                        Report
                    </MenuItem>
                    <MenuItem
                        onClick={handleClose}
                        sx={{
                            padding: '10px 60px',
                        }}
                    >Activity
                    </MenuItem>
                </Menu>

            </List>


        </Box>
    );


    console.log(isSmallScreen)
    useEffect(() => {
        if (isSmallScreen) {
            setState({ left: true });
        }
    }, [isSmallScreen]);

    return (
        <div className='Navbar'>
            <Toaster richColors />
            <>
                <MenuIcon
                    onClick={toggleDrawer(true)}
                />
                {!isSmallScreen ? (<Drawer
                    variant='temporary'
                    anchor={"left"}
                    open={state.left}
                    onClose={toggleDrawer(false)}
                    >
                    {list()}
                </Drawer>) : (
                    <Drawer
                        hideBackdrop='false'
                        variant='permanent'
                        anchor={"left"}
                        open={state.left}
                        onClose={toggleDrawer(false)}
                    >
                        {list()}
                    </Drawer>
                )}
            </>
        </div>
    );
};

export default Navbar;
