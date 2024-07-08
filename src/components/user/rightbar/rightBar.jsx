import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { AnimatedTooltip } from '../../ui/animatedToolTip';
import { useOnlineUsers } from '../../../context/OnlineUsers';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import LoaderCore from '../notification/Notification';
import Collapse from '@mui/material/Collapse';
import { motion } from 'framer-motion';
import { userAxios } from '../../../constraints/axios/userAxios';
import userApi from '../../../constraints/api/userApi';
import { useTheme } from '@emotion/react';
import { ClickAwayListener } from '@mui/material';



const shakeAnimation = {
    initial: { x: 0 },
    animate: { x: [0, -5, 5, -5, 5, 0], transition: { duration: .5 } },
};

function RightBar() {
    const { onlineUsers } = useOnlineUsers();
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(false);
    const [notification, setNotification] = useState([])
    const theme = useTheme()

    const handleChange = () => {
        setChecked((prev) => !prev);
    };

    const fetchNotifications = async () => {
        try {         
            const res = await userAxios.get(userApi.getNotification)
            // console.log(res.data)
            setNotification(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }
    // console.log(notification)

    useEffect(() => {
        fetchNotifications()
    }, [checked])

    const closeNotification = () => {
        setChecked(false)
    }

    return (
        <Box className='flex justify-center' flex={1.5}
        >
            <ClickAwayListener onClickAway={closeNotification}>
                <Box
                    sx={{
                        // zIndex: 1,
                        marginTop: 5,
                        position: 'fixed',
                        padding: 1
                    }}>
                    <Box onClick={handleChange} className='border-y border-opacity-80 rounded-lg cursor-pointer p-3'
                        style={{
                            backgroundColor: checked ? (theme.palette.mode === 'light' ? theme.palette.selectedChat.main : theme.palette.selectedChat.main) : 'inherit',
                        }}
                    >
                        <motion.div
                            initial="initial"
                            animate={checked ? "animate" : "initial"}
                            variants={shakeAnimation}
                            className='flex items-center justify-center'
                        >
                            Notification
                            <NotificationsNoneOutlinedIcon color={!checked ? 'disabled' : 'error'} />
                        </motion.div>
                    </Box>
                    <Collapse in={checked} className='mt-1 p-2 rounded-xl'
                    >
                        {checked && <LoaderCore loadingStates={notification} value={0} />}
                    </Collapse>
                </Box>
            </ClickAwayListener>
            {!checked && <Box className='fixed' sx={{ marginTop: '7rem' }} >
                <Box className='flex justify-center items-center text-blue-400 font-semibold text-lg m-3'>Online</Box>
                <Box className="flex flex-row items-center justify-center w-full">
                    <AnimatedTooltip items={onlineUsers} />
                </Box>
            </Box>}
        </Box>
    );
}

export default RightBar;
