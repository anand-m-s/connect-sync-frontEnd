import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { AnimatedTooltip } from '../../ui/animatedToolTip';
import { useOnlineUsers } from '../../../context/OnlineUsers';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import Notifications from '../notification/Notification';
import Collapse from '@mui/material/Collapse';
import { motion } from 'framer-motion';
import { userAxios } from '../../../constraints/axios/userAxios';
import userApi from '../../../constraints/api/userApi';
import { useTheme } from '@emotion/react';
import { Badge, ClickAwayListener } from '@mui/material';
import { MeditationCard } from '../meditation/ExploreMeditation';





const shakeAnimation = {
    initial: { x: 0 },
    animate: { x: [0, -5, 5, -5, 5, 0], transition: { duration: .5 } },
};

function RightBar() {
    const { onlineUsers, notificationCount, setNotificationCount, notification, setNotification } = useOnlineUsers()
    const [checked, setChecked] = useState(false)
    const theme = useTheme()

    const handleChange = () => {
        setChecked((prev) => !prev);
        // if (checked) {
        //     setNotificationCount(0)
        // }
    }


    const fetchNotifications = async () => {
        try {
            const res = await userAxios.get(userApi.getNotification)
            // console.log(res.data)
            setNotification(res.data.data)
            setNotificationCount(res.data.newNotifications)
        } catch (error) {
            console.log(error)
        }
    }

    const markNotificationAsRead = async () => {
        await userAxios.put(userApi.markNotificationAsRead)
    }

    useEffect(() => {
        return () => {
            if (checked) {
                markNotificationAsRead()
                setNotificationCount(0)
                setNotification((prevNotificatoins) => {
                    return prevNotificatoins.map((noti) => ({
                        ...noti,
                        isRead: true
                    }));
                });
            }
        }
    }, [checked])

    useEffect(() => {
        fetchNotifications()
    }, [])


    const closeNotification = () => {
        setChecked(false)
    }

    return (
        <Box className='flex justify-center' flex={2}
        >
            <ClickAwayListener onClickAway={closeNotification}>
                <Box
                    sx={{
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
                            <Badge badgeContent={notificationCount} color="primary">
                                Notification
                                <NotificationsNoneOutlinedIcon color={!checked ? 'disabled' : 'error'} />
                            </Badge>
                        </motion.div>
                    </Box>
                    <Collapse in={checked} className='mt-1 p-2 rounded-xl'
                    >
                        {checked && <Notifications loadingStates={notification} value={0} />}
                    </Collapse>
                </Box>
            </ClickAwayListener>
            {!checked && (
                <Box className='fixed' sx={{ marginTop: '7rem' }} >
                    <Box className='flex justify-center items-center text-blue-400 font-semibold text-lg m-3'>Online</Box>
                    <Box className="flex flex-row items-center justify-center w-full">
                        <AnimatedTooltip items={onlineUsers} />
                    </Box>
                    <Box>
                        <MeditationCard />
                    </Box>
                </Box>

            )}
        </Box>
    );
}

export default RightBar;
