import React from 'react'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import FlagIcon from '@mui/icons-material/Flag';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import { Link } from 'react-router-dom'
import { logout } from '../../../services/redux/slices/adminAuthSlice';
import { useDispatch } from 'react-redux';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';

function SideBar() {
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    const [anchorEl, setAnchorEl] = React.useState(null);
    const dispatch = useDispatch()

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        dispatch(logout())
        toast.info('logout success')
    }

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
            
        >
            <List className='grid gap-3'>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to={'/admin'}>
                        <ListItemIcon>
                            <SupervisorAccountIcon color='primary' />
                        </ListItemIcon>
                        <ListItemText primary={"Connect sync"} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to={'/admin'}>
                        <ListItemIcon>
                            <SpaceDashboardIcon color='primary' />
                        </ListItemIcon>
                        <ListItemText primary={"Dashboard"} />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton component={Link} to={'/admin/user-management'} >
                        <ListItemIcon>
                            <ManageAccountsIcon color='primary' />
                        </ListItemIcon>
                        <ListItemText primary={"User Managment"} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to={'/admin/report'} >
                        <ListItemIcon>
                            <FlagIcon color='primary' />
                        </ListItemIcon>
                        <ListItemText primary={"Report"} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to={'/admin/addcourse'}>
                        <ListItemIcon>
                            <SelfImprovementIcon color='primary' />
                        </ListItemIcon>
                        <ListItemText primary={"Course managment"} />
                    </ListItemButton>
                </ListItem>
                <Divider />

            </List>
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
                </Menu>

            </List>
        </Box>
    );
    return (
        <>
        <Box>
            {/* heading here */}
        </Box>
            <Box className='mt-4'>
                {list()}

            </Box>
        </>
    )
}

export default SideBar




