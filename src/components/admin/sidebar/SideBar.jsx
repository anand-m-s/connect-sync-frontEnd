import React from 'react';
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
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../../../services/redux/slices/adminAuthSlice';
import { useDispatch } from 'react-redux';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import { useSidebar } from '../../../context/SideBarHighLight';
import { toast } from 'sonner'; 

function SideBar() {
  const { selected, setSelected } = useSidebar();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.info('Logout success');
  };

  React.useEffect(() => {
    setSelected(location.pathname);
  }, [location, setSelected]);

  const listItems = [
    { text: 'Connect sync', icon: <SupervisorAccountIcon color='primary' />,  },
    { text: 'Dashboard', icon: <SpaceDashboardIcon color='primary' />, to: '/admin' },
    { text: 'User Management', icon: <ManageAccountsIcon color='primary' />, to: '/admin/user-management' },
    { text: 'Report', icon: <FlagIcon color='primary' />, to: '/admin/report' },
    { text: 'Course Management', icon: <SelfImprovementIcon color='primary' />, to: '/admin/addcourse' },
  ];

  return (
    <>
      <Box>
        {/* heading here */}
      </Box>
      <Box className='mt-4 p-2'>
        <Box role="presentation">
          <List className='grid gap-5 p-28'>
            {listItems.map((item, index) => (
              <ListItem
                key={index}
                disablePadding
                selected={selected === item.to}
                sx={{
                  backgroundColor: selected === item.to ? 'lightgrey' : 'inherit',
                  '&.Mui-selected': {
                    backgroundColor: 'lightgrey',
                    borderRadius:'.5rem'
                  },
                }}
              >
                <ListItemButton component={Link} to={item.to} onClick={() => setSelected(item.to)}>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
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
              {/* <MenuItem
                onClick={handleClose}
                sx={{
                  padding: '10px 60px',
                }}
              >
                Report
              </MenuItem> */}
            </Menu>
          </List>
        </Box>
      </Box>
    </>
  );
}

export default SideBar;








