import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Modal } from '@mui/material';
import { useCall } from '../../../context/CallContext';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../../services/socket';
import { useDispatch, useSelector } from 'react-redux';
import { useOnlineUsers } from '../../../context/OnlineUsers';

const SocketConn = () => {
    const { setIncomingCall, callerData, setCallerData, incomingCall } = useCall();
    const [showModal, setShowModal] = useState(false);
    const user = useSelector((state) => state.userAuth.userInfo)
    const navigate = useNavigate();
    const { socket } = useSocket()
    const { setOnlineUsers } = useOnlineUsers()

    //===socket connection===
    useEffect(() => {
        if (user && socket) {
            socket.emit("setup", user);
        }
    }, [user, socket]);

    const handleClose = () => {
        setIncomingCall(false);
        setShowModal(false);
    };

    const handleAnswerClick = () => {
        if (callerData) {
            setShowModal(false);
            navigate(`/video-call/${callerData.roomId}`);
        }
    };

    const handleUserConnected = (data) => {
        setOnlineUsers((prevUsers) => {
            const userExists = prevUsers.some(user => user.id === data.id);
            if (!userExists) {
                return [...prevUsers, data];
            }
            return prevUsers;
        });
    };

    const handleUserDisconnected = (data) => {
        setOnlineUsers((prevUsers) => prevUsers.filter(user => user.id !== data.id));
    };

    const handleCurrentOnlineUsers = (users) => {
        setOnlineUsers((prevOnlineUsers) => {
            const newUsers = users.filter(newUser =>
                !prevOnlineUsers.some(existingUser => existingUser.id === newUser.id)
            );
            return [...prevOnlineUsers, ...newUsers];
        });
    };

    // const handleBeforeUnload = () => {
    //     if (socket && userId) {
    //         socket.emit('manual-disconnect', { id:user.id});
    //     }
    // };

    useEffect(() => {
        const handleIncomingCall = (data) => {            
            if (data.userId !== user.id) {
                console.log('Incoming call: ', data);
                console.log(data)
                // alert("Incoming")
                console.log(data)
                setCallerData(data);
                setIncomingCall(true);
                setShowModal(true);
            }
        };

        if (socket) {
            socket.on('video-call', (data) => {
                // alert(data.roomId)
                socket.emit("join video chat", data)
            })
            socket.on('webrtc-offer', handleIncomingCall);
            socket.on("connected", (data) => {
                console.log(socket, "vannuuuuu")
            })
            socket.on('user-connected', handleUserConnected);
            socket.on('user-disconnected', handleUserDisconnected);
            socket.on('current-online-users', handleCurrentOnlineUsers);



            // window.addEventListener('beforeunload', handleBeforeUnload);
        }
        return () => {
            // window.removeEventListener('beforeunload', handleBeforeUnload);
            socket?.off('video-call');
            socket?.off('webrtc-offer', handleIncomingCall);
            socket?.off('user-connected', handleUserConnected);
            socket?.off('user-disconnected', handleUserDisconnected);
        };
    }, [socket])





    return (
         <Modal open={showModal} onClose={handleClose}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                    <Typography variant="h6">Incoming Call</Typography>
                    {callerData && (
                        <Typography variant="body1">Call from: {callerData.userName}</Typography>
                    )}
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleAnswerClick}>
                            connect
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleClose} sx={{ ml: 2 }}>
                            Decline
                        </Button>
                    </Box>
                </Box>
            </Modal>        
    );
};

export default SocketConn;
