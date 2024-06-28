import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase/firebase';
import { Button, AppBar, Toolbar, IconButton, Typography, Box, Grid, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import { useCall } from '../../../context/CallContext';
import { useSocket } from '../../../services/socket';
import MinimizeIcon from '@mui/icons-material/Minimize';
import MaximizeIcon from '@mui/icons-material/Fullscreen';
import CloseIcon from '@mui/icons-material/Close';
import MicIcon from '@mui/icons-material/Mic';
import VideocamIcon from '@mui/icons-material/Videocam';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import { Link } from 'react-router-dom';
import { MovingBorderButton } from '../../../components/ui/MovingBorderButton';

const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
    iceCandidatePoolSize: 10,
};


const VideoChat = () => {
    const { roomId } = useParams();
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(new MediaStream());
    const [cameraOn, setCameraOn] = useState(false);
    const [microphoneOn, setMicrophoneOn] = useState(false);
    const webcamVideo = useRef(null);
    const remoteVideo = useRef(null);
    const pc = useRef(new RTCPeerConnection(servers));
    const { incomingCall, setIncomingCall, callerData, setCallerData } = useCall();
    const user = useSelector((state) => state.userAuth.userInfo);
    const accessRef = useRef()
    const userId = user.id;
    const { socket } = useSocket()

    useEffect(() => {
        if (socket) {
            socket.emit('join video chat', { roomId });
            pc.current.ontrack = (event) => {
                event.streams[0].getTracks().forEach((track) => {
                    remoteStream.addTrack(track);
                });
            };

            pc.current.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit('webrtc-ice-candidate', {
                        roomId,
                        userId,
                        candidate: event.candidate,
                    });
                }
            };

            if (webcamVideo.current) {
                webcamVideo.current.srcObject = localStream;
            }
            if (remoteVideo.current) {
                remoteVideo.current.srcObject = remoteStream;
            }

            socket.on('webrtc-offer', async (data) => {
                setIncomingCall(true);
                setCallerData(data);
            });

            socket.on('webrtc-answer', async (data) => {
                if (data.userId !== userId) {
                    await pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
                }
            });

            socket.on('webrtc-ice-candidate', async (data) => {
                if (data.userId !== userId) {
                    if (pc.current.remoteDescription) {
                        await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
                    } else {
                        pc.current.addEventListener('signalingstatechange', async () => {
                            if (pc.current.signalingState === 'stable') {
                                await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
                            }
                        });
                    }
                }
            });
        }

        return () => {
            socket?.off('webrtc-offer');
            socket?.off('webrtc-answer');
            socket?.off('webrtc-ice-candidate');
        };
    }, [socket, roomId, userId, localStream, remoteStream]);
    // useEffect(() => {
    //     startWebcam();
    // }, [])

    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            stream.getTracks().forEach((track) => {
                pc.current.addTrack(track, stream);
            });
            if (webcamVideo.current) {
                webcamVideo.current.srcObject = stream;
            }
            setCameraOn(true);
            setMicrophoneOn(true);
        } catch (error) {
            console.error('Error starting webcam:', error);
        }
    };

    const toggleCamera = () => {
        const videoTrack = localStream.getVideoTracks()[0];
        videoTrack.enabled = !videoTrack.enabled;
        setCameraOn(videoTrack.enabled);
    };

    const toggleMicrophone = () => {
        const audioTrack = localStream.getAudioTracks()[0];
        audioTrack.enabled = !audioTrack.enabled;
        setMicrophoneOn(audioTrack.enabled);
    };

    // const toggleCamera = async () => {
    //     try {
    //         if (!localStream || !localStream.getVideoTracks().length) {
    //             const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    //             if (localStream) {
    //                 stream.getVideoTracks().forEach(track => localStream.addTrack(track));
    //             } else {
    //                 setLocalStream(stream);
    //             }
    //             stream.getTracks().forEach((track) => {
    //                 pc.current.addTrack(track, stream);
    //             });
    //             if (webcamVideo.current) {
    //                 webcamVideo.current.srcObject = stream;
    //             }
    //             setCameraOn(true);
    //         } else {
    //             const videoTrack = localStream.getVideoTracks()[0];
    //             videoTrack.enabled = !videoTrack.enabled;
    //             setCameraOn(videoTrack.enabled);
    //         }
    //     } catch (error) {
    //         console.error('Error toggling camera:', error);
    //     }
    // };

    // const toggleMicrophone = async () => {
    //     try {
    //         if (!localStream || !localStream.getAudioTracks().length) {
    //             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    //             if (localStream) {
    //                 stream.getAudioTracks().forEach(track => localStream.addTrack(track));
    //             } else {
    //                 setLocalStream(stream);
    //             }
    //             stream.getTracks().forEach((track) => {
    //                 pc.current.addTrack(track, stream);
    //             });
    //             if (webcamVideo.current) {
    //                 webcamVideo.current.srcObject = stream;
    //             }
    //             setMicrophoneOn(true);
    //         } else {
    //             const audioTrack = localStream.getAudioTracks()[0];
    //             audioTrack.enabled = !audioTrack.enabled;
    //             setMicrophoneOn(audioTrack.enabled);
    //         }
    //     } catch (error) {
    //         console.error('Error toggling microphone:', error);
    //     }
    // };

    const endCall = () => {
        pc.current.close();
        setLocalStream(null);
        setRemoteStream(new MediaStream());
        if (webcamVideo.current) {
            webcamVideo.current.srcObject = null;
        }
        if (remoteVideo.current) {
            remoteVideo.current.srcObject = null;
        }
        socket.emit('leave chat', roomId);
        pc.current = new RTCPeerConnection(servers);
    };

    const createCall = async () => {
        const callDoc = doc(db, 'calls', roomId);
        const offerDescription = await pc.current.createOffer();
        await pc.current.setLocalDescription(offerDescription);
        const offer = {
            type: offerDescription.type,
            sdp: offerDescription.sdp,
        };
        await setDoc(callDoc, { offer });
        socket.emit('webrtc-offer', {
            roomId,
            userId,
            userName: user.userName,
            offer: offerDescription,
        });

        pc.current.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('webrtc-ice-candidate', {
                    roomId,
                    userId,
                    candidate: event.candidate,
                });
            }
        };
    };

    const answerCall = async () => {
        setIncomingCall(false)
        if (callerData) {
            await pc.current.setRemoteDescription(new RTCSessionDescription(callerData.offer));

            const answerDescription = await pc.current.createAnswer();
            await pc.current.setLocalDescription(answerDescription);

            const answer = {
                type: answerDescription.type,
                sdp: answerDescription.sdp,
            };

            const callDoc = doc(db, 'calls', roomId);
            await setDoc(callDoc, { answer }, { merge: true });

            socket.emit('webrtc-answer', {
                roomId,
                userId,
                answer: answerDescription,
                callerId: callerData.callerId,
            });
        }
    };

    return (
        <Box display="flex" flexDirection="column" height="100vh" bgcolor="grey.900" color="white">
            <AppBar position="static" sx={{ bgcolor: 'grey.800' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Video Call
                    </Typography>
                    {/* <IconButton color="inherit">
                        <MinimizeIcon />
                    </IconButton>
                    <IconButton color="inherit">
                        <MaximizeIcon />
                    </IconButton> */}
                    <IconButton color="inherit" component={Link} to={'/chat'}>
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box flex={1} p={2}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Paper sx={{ bgcolor: 'grey.800', position: 'relative', overflow: 'hidden', height: '100%' }}>
                            <Typography variant="h5" sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1 }}>
                                You
                            </Typography>
                            <video ref={webcamVideo} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}></video>
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper sx={{ bgcolor: 'grey.800', position: 'relative', overflow: 'hidden', height: '100%' }}>
                            <Typography variant="h5" sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1 }}>
                                Remote Stream
                            </Typography>
                            <video ref={remoteVideo} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'contain' }}></video>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
            <AppBar position="static" sx={{ bgcolor: 'grey.800' }}>
                <Toolbar>
                    <IconButton color="inherit" onClick={toggleMicrophone} disabled={!localStream}>
                        {microphoneOn ? <MicIcon /> : <MicOffIcon />}
                    </IconButton>
                    <IconButton color="inherit" onClick={toggleCamera} disabled={!localStream}>
                        {cameraOn ? <VideocamIcon /> : <VideocamOffIcon />}
                    </IconButton>

                    <Box sx={{ flexGrow: 1 }} />
                    <Box className='flex gap-3'>
                        <Button variant="contained" color="primary" onClick={startWebcam} >
                            Start Webcam
                        </Button>
                        <Button variant="contained" color="success" onClick={createCall} >
                            Call
                        </Button>
                        <Button variant="contained" color="error" onClick={endCall} >
                            End
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
            {incomingCall && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        // bgcolor: 'background.paper',
                        p: 2,
                        borderRadius:'1rem',
                        marginTop:'2rem'
                        // boxShadow: 24
                    }}
                >
                    {/* <Button variant="contained" color="success" onClick={answerCall}>
                        Answer
                    </Button> */}
                    <MovingBorderButton onClick={answerCall}>
                        Answer
                    </MovingBorderButton>
                </Box>
            )}
        </Box>
    );
};

export default VideoChat;
