import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
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
import { Link } from 'react-router-dom';
import { useModal } from '../../../context/modalContext';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useContext } from 'react';
import ColorModeContext from '../../../context/colorModeContext';
import Switch from '@mui/material/Switch';


const Navbar = () => {

    const { handleOpen } = useModal()
    const [state, setState] = React.useState({
        left: false,
    });
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = React.useState(null);
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    const isSmallScreen = useMediaQuery(theme.breakpoints.up('sm'));

    const MaterialUISwitch = styled(Switch)(({ theme }) => ({
        width: 62,
        height: 34,
        padding: 7,
        '& .MuiSwitch-switchBase': {
          margin: 1,
          padding: 0,
          transform: 'translateX(6px)',
          '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
              backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                '#fff',
              )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            '& + .MuiSwitch-track': {
              opacity: 1,
              backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
          },
        },
        '& .MuiSwitch-thumb': {
          backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
          width: 32,
          height: 32,
          '&::before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
              '#fff',
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
          },
        },
        '& .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
          borderRadius: 20 / 2,
        },
      }));

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
            p={2}
            sx={{ width: '250px' }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>

                <ListItem disablePadding>
                    <ListItemButton onClick={toggleDrawer(true)}>
                        <ListItemIcon>
                            <CycloneIcon color='info' fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary={"Connect sync"} />
                    </ListItemButton>
                </ListItem>
                <Divider />

                <ListItem disablePadding>
                    <ListItemButton component={Link} to={'/home'}>
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
                            <ExploreOutlinedIcon color='info' />
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
                    <ListItemButton onClick={handleOpen}>
                        <ListItemIcon>
                            <AddCircleOutlineOutlinedIcon color='primary' />
                        </ListItemIcon>
                        <ListItemText primary={"Create"} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to={'/profile'}>
                        <ListItemIcon>
                            <PersonOutlineOutlinedIcon color='primary' />
                        </ListItemIcon>
                        <ListItemText primary={"Profile"} />
                    </ListItemButton>
                </ListItem>
                {/* <ListItem disablePadding>
                    <ListItemButton onClick={colorMode.toggleColorMode}>
                        <ListItemIcon>
                            {theme.palette.mode === 'light' ? <Brightness7Icon color='primary'/> : <Brightness4Icon color='inherit'/>}
                        </ListItemIcon>
                        <ListItemText primary={theme.palette.mode==='light'?'Dark':'Light'} />
                    </ListItemButton>
                </ListItem> */}
                <ListItem disablePadding>
                    <ListItem>
                        <ListItemIcon>
                            {theme.palette.mode === 'light' ? (
                                <Brightness7Icon color="primary" />
                            ) : (
                                <Brightness4Icon color="inherit" />
                            )}
                        </ListItemIcon>
                        <ListItemText primary={theme.palette.mode == 'light' ? 'Dark mode' : 'Light mode'} />
                        <MaterialUISwitch
                            size='small'                            
                            checked={theme.palette.mode === 'dark'}
                            onChange={colorMode.toggleColorMode}
                            color="info"
                        />
                    </ListItem>
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
    useEffect(() => {
        if (isSmallScreen) {
            setState({ left: true });
        }
    }, [isSmallScreen]);

    return (


        <Box
            sx={{ width: '100%' }}>
            <Toaster richColors />
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
                    // hideBackdrop='false'
                    variant='permanent'
                    anchor={"left"}
                    open={state.left}
                    onClose={toggleDrawer(false)}
                >
                    {list()}
                </Drawer>
            )}
        </Box>


    );
};

export default Navbar;
