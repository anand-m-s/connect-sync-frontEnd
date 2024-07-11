import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Modal } from '@mui/material';
import { useCall } from '../../../context/CallContext';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../../services/socket';
import { useDispatch, useSelector } from 'react-redux';
import { useOnlineUsers } from '../../../context/OnlineUsers';
import { toast, Toaster } from 'sonner';

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
        if (callerData) {
            socket.emit('call-declined', { roomId: callerData.roomId, userId: user.id });
        }
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

    const handleLikeNotification = ({ postId, liker, postOwnerId }) => {
        toast.info(`${liker} liked your post`);
    }
    const handleCommentNotification = ({ postId, commentedBy, postOwnerId }) => {
        console.log(commentedBy)
        toast.info(`${commentedBy} commented on your post`);
    }
    const handleFollowersNotification = ({ followedBy }) => {
        console.log(followedBy)
        toast.info(`${followedBy} started following you`);
    }
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
                // console.log(socket, "vannuuuuu")
            })
            socket.on('liked', handleLikeNotification);
            socket.on('commented', handleCommentNotification)
            socket.on('followers', handleFollowersNotification)
            socket.on('user-connected', handleUserConnected);
            socket.on('user-disconnected', handleUserDisconnected);
            socket.on('current-online-users', handleCurrentOnlineUsers);
            socket.on('call-declined', (data) => {
                console.log(`Call declined by user`);
                toast.info('call declined')
               
            });

        }
        return () => {
        
            socket?.off('video-call');
            socket?.off('webrtc-offer', handleIncomingCall);
            socket?.off('user-connected', handleUserConnected);
            socket?.off('liked', handleLikeNotification);
            socket?.off('commented', handleCommentNotification)
            socket?.off('user-disconnected', handleUserDisconnected);
            socket?.off('call-declined');
        };
    }, [socket])





    return (
        <>
            <Toaster richColors />
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
        </>
    );
};

export default SocketConn;
