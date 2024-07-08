import React, { useEffect, useState } from "react"
import Avatar from "@mui/material/Avatar"
import IconButton from "@mui/material/IconButton"
import TextField from "@mui/material/TextField"
import { Send, AttachFile, InsertEmoticon, Clear } from "@mui/icons-material"
import { Box, Card, CardContent, CardHeader, CardMedia, ClickAwayListener, Dialog, DialogContent, DialogTitle, Typography, useTheme } from "@mui/material"
import ScrollableFeed from 'react-scrollable-feed'
import { userAxios } from "../../../constraints/axios/userAxios"
import userApi from "../../../constraints/api/userApi"
import { ChatState } from "../../../context/ChatProvider"
import { isLastMessage, isSameSender } from "../../../constraints/config/chatLogic"
import { useSelector } from "react-redux"
import { toast, Toaster } from "sonner"
import ChatHeader from "./ChatHeader"
import { format, isToday, isYesterday, isSameDay, isSameWeek } from 'date-fns';
import TypingIndicator from "./TypingIndicator"
import { useSocket } from "../../../services/socket"
import DragNdrop from "../../common/DragAndDrop/DragAndDrop"
import SharedFiles from "./Files"
import RecorderJSDemo from "./RecorderJs"
import { useOnlineUsers } from "../../../context/OnlineUsers"
import { Link } from "react-router-dom"
import { MovingBorderButton } from "../../ui/MovingBorderButton"

// const ENDPOINT = "http://localhost:3000";
let selectedChatCompare;

function IndividualChat({ fetchAgain, setFetchAgain }) {
    const { selectedChat, setSelectedChat, sharedPost, setSharedPost } = ChatState()
    const user = useSelector((state) => state.userAuth.userInfo)
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState()
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const { socket } = useSocket()
    const [showDragNdrop, setShowDragNdrop] = useState(false);
    const [upload, setUpload] = useState(false)

    // console.log(sharedPost)

    const handleFilesSelected = async (files) => {
        console.log('Files selected:', files);
        setUpload(true)
        await new Promise(res => setTimeout(() => { res() }, 1500))
        // handleClose()
        // toast.success('File send')
    };

    const toggleDragNdrop = () => {
        setShowDragNdrop((prev) => !prev);
    };

    const handleClose = () => {
        setShowDragNdrop(false);
    };

    const theme = useTheme()
    // console.log(messages)

    const fetchMessages = async () => {
        if (!selectedChat) return;
        try {
            setLoading(true)
            const { data } = await userAxios.get(`${userApi.sendMessage}/${selectedChat._id}`)
            setMessages(data)
            setUpload(false)
            setLoading(false)

            socket.emit('join chat', selectedChat._id);
        } catch (error) {
            if (error.response && error.response.data.error) {
                toast.error(error.response.data.error);
            }
        }
    }

    useEffect(() => {
        if (socket) {
            socket.emit('setup', user)
            socket.on('connected', () => setSocketConnected(true))
            socket.on('typing', () => setIsTyping(true))
            socket.on('stop typing', () => setIsTyping(false))
        }
        socket?.on('message recieved', (newMessageRecieved) => {
            console.log(newMessageRecieved)
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                // notification
            } else {
                setMessages((prev) => [...prev, newMessageRecieved])
            }
        })
    }, [socket, user])
    // console.log(messages)

    useEffect(() => {
        fetchMessages()
        selectedChatCompare = selectedChat
    }, [selectedChat, upload])

    // const fetchSharedPost = async () => {
    //     try {
    //         const res = await userAxios.get(`${userApi.getSharedPost}?postId=${sharedPost}`)
    //         console.log(res.data)
    //     } catch (error) {
    //         if (error.response && error.response.data.error) {
    //             toast.error(error.response.data.error);
    //         }
    //     }
    // }

    // useEffect(() => {
    //     console.log('inside shared post')
    //     if (sharedPost !== null) {
    //         fetchSharedPost()
    //     }
    // }, [sharedPost])

    const sendMessage = async (e) => {
        if (e.key === 'Enter' && newMessage) {
            try {
                socket?.emit('stop typing', selectedChat._id)
                setNewMessage('')
                const { data } = await userAxios.post(userApi.sendMessage, {
                    content: newMessage,
                    chatId: selectedChat._id,
                })
                console.log(data)
                socket?.emit('new message', data)
                setMessages([...messages, data])
                setFetchAgain(prev => !prev);
            } catch (error) {
                if (error.response && error.response.data.error) {
                    toast.error(error.response.data.error);
                }
            }
        }
        // if (e.key === 'Enter' && sharedPost) {

        // }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value)
        if (!socket) return
        if (!typing) {
            setTyping(true)
            console.log('typing now')
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingType = new Date().getTime()
        let timerLength = 1500;
        setTimeout(() => {
            let timeNow = new Date().getTime()
            let timeDiff = timeNow - lastTypingType;
            if (timeDiff >= timerLength && typing) {
                socket.emit('stop typing', selectedChat._id)
                setTyping(false)
            }
        }, timerLength)
    }

    // console.log(sharedPost)

    const handleSharePost = async () => {
        try {
            socket?.emit('stop typing', selectedChat._id)
            setNewMessage('')
            const res = await userAxios.post(userApi.sharedPost, {
                sharedPost: sharedPost[0],
                chatId: selectedChat._id,
            })
            console.log(res)
            console.log(res.data[0])
            setSharedPost([])
            socket?.emit('new message', res.data[0])
            setMessages([...messages, res.data[0]])
            setFetchAgain(prev => !prev);
        } catch (error) {
            if (error.response && error.response.data.error) {
                toast.error(error.response.data.error);
            }
        }
    }

    return (
        <Box flex={3.5}>
            <Toaster richColors position="top-center" />
            {selectedChat ? (
                <>
                    <ClickAwayListener onClickAway={() => setSharedPost([])}>
                        <Box className="flex flex-col" sx={{ height: '100vh' }}>
                            {/* chat header */}
                            <ChatHeader userId={user.id} selectedChat={selectedChat.users} />
                            <ScrollableFeed>
                                <Box className="flex-1 overflow-auto p-4">
                                    {messages && messages.map((m, i) => (
                                        <Box key={m._id} className="grid gap-4 m-1">
                                            {(i === 0 || !isSameDay(new Date(m.createdAt), new Date(messages[i - 1].createdAt))) && (
                                                <Box className='flex justify-center my-2 opacity-50 text-sm'>
                                                    {isToday(new Date(m.createdAt))
                                                        ? 'Today'
                                                        : isYesterday(new Date(m.createdAt))
                                                            ? 'Yesterday'
                                                            : isSameWeek(new Date(m.createdAt), new Date())
                                                                ? format(new Date(m.createdAt), 'EEEE') // Day of the week
                                                                : format(new Date(m.createdAt), 'dd/MM/yyyy')  // Day/Month/Year
                                                    }
                                                </Box>
                                            )}
                                            <Box className={`flex items-end gap-2 ${m.sender._id === user.id ? 'justify-end' : ''}`}>
                                                {(isSameSender(messages, m, i, user.id) || isLastMessage(messages, i, user.id)) && (
                                                    <Avatar
                                                        sx={{ width: 36, height: 36 }}
                                                        src={m.sender.profilePic}
                                                        alt="Avatar"
                                                    >AN</Avatar>
                                                )}
                                                {m.files.length == 0 && !m.sharedPost &&
                                                    <Box
                                                        // className={`max-w-[70%] rounded-lg p-2 text-sm ${m.sender._id === user.id ?  `text-white bg=${theme.palette.selectedChat.main}` : 'border'
                                                        className={`max-w-[70%] rounded-lg p-2 text-sm ${m.sender._id === user.id ? 'bg-blue-500 text-white' : ''
                                                            } ${(isSameSender(messages, m, i, user.id) || isLastMessage(messages, i, user.id)) ? 'ml-0' : 'ml-11'}`}
                                                        style={{
                                                            backgroundColor: m.sender._id !== user.id ? theme.palette.selectedChat.main : '',
                                                        }}
                                                    >
                                                        <p>{m.content}</p>
                                                        <Box className={`mt-1 text-xs ${m.sender._id === user.id ? 'text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>
                                                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </Box>

                                                    </Box>}
                                                {m.files.length > 0 &&
                                                    <>
                                                        {/* <div className={`text-xs ${m.sender._id === user.id ? 'text-gray-200' : 'text-gray-500 dark:text-gray-400'}${(isSameSender(messages, m, i, user.id) || isLastMessage(messages, i, user.id)) ? 'ml-0' : 'ml-11'}`}>
                                                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div> */}
                                                        <div className={`${(isSameSender(messages, m, i, user.id) || isLastMessage(messages, i, user.id)) ? 'ml-0' : 'ml-11'}`}>
                                                            <SharedFiles files={m.files} sender={m.sender._id} t={m.createdAt} />
                                                        </div>
                                                    </>
                                                }
                                                {m.sharedPost &&
                                                    <Box className='h-48 w-48 mb-24'>
                                                        <Card
                                                            sx={{ borderRadius: '.5rem', width: { xs: '70%', sm: '80%', md: '90%' } }} elevation={0}
                                                        >
                                                            <CardHeader
                                                                style={{
                                                                    backgroundColor: theme.palette.mode === 'light' ? theme.palette.selectedChat.main : theme.palette.selectedChat.main,
                                                                }}
                                                                avatar={
                                                                    <Avatar src={m.sharedPost.userId.profilePic} sx={{ bgcolor: "skyblue", cursor: 'pointer' }} aria-label="recipe">
                                                                        {m.sharedPost.userId.userName.charAt(0)}
                                                                    </Avatar>
                                                                }

                                                                title={<Box sx={{ cursor: 'pointer' }} component={Link} to={`/profile?userId=${m.sharedPost.userId._id}`}>{m.sharedPost.userId.userName}</Box>}
                                                            // subheader={location}
                                                            />
                                                            <Box
                                                            // sx={{
                                                            //     display: 'flex',
                                                            //     justifyContent: 'center',
                                                            //     alignItems: 'center',
                                                            //     width: '100%',
                                                            //     padding: '10px',
                                                            //     height: { xs: '200px', sm: '250px', md: '400px' },
                                                            //     overflow: 'hidden',
                                                            // }}
                                                            >
                                                                <CardMedia
                                                                    component="img"
                                                                    image={m.sharedPost.imageUrl[0]}
                                                                    alt="Post image"
                                                                // sx={{
                                                                //     width: '100%',
                                                                //     height: '100%',
                                                                //     objectFit: 'contain',
                                                                // }}
                                                                />
                                                            </Box>
                                                            <Box
                                                                style={{
                                                                    backgroundColor: theme.palette.mode === 'light' ? theme.palette.selectedChat.main : theme.palette.selectedChat.main,
                                                                    cursor: 'pointer',
                                                                }}
                                                            >
                                                                <CardContent sx={{ padding: '0' }}>
                                                                    <Box
                                                                        sx={{
                                                                            padding: '1px',
                                                                            //  margin: '5px 6px 0 0'
                                                                        }}
                                                                    >
                                                                        {/* <Typography>{m.sharedPost.userId.userName}</Typography> */}
                                                                        {/* <Typography variant="body2" color="text.secondary">{description}</Typography> */}

                                                                    </Box>
                                                                </CardContent>
                                                                <Box
                                                                    //  className={`mt-1 text-xs ${m.sender._id === user.id ? 'text-gray-200' : 'text-gray-200 dark:text-gray-400'}`}
                                                                    className='text-xs mt-1 flex justify-end mr-2 p-1'
                                                                >

                                                                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </Box>

                                                            </Box>
                                                        </Card>

                                                    </Box>
                                                }
                                            </Box>
                                        </Box>
                                    ))}
                                    {isTyping ? <Box className='mt-10'><TypingIndicator /></Box> : <></>}
                                    {sharedPost.length !== 0 && <Box className='flex justify-center'>
                                        <MovingBorderButton className="p-5" onClick={handleSharePost}>
                                            <p className="font-medium"> Click here to share the post</p>
                                        </MovingBorderButton>
                                    </Box>}
                                </Box>
                            </ScrollableFeed>


                            <Box className="sticky bottom-0 flex h-16 items-center justify-between p-8 "
                                sx={{ border: `1px solid ${theme.palette.divider}` }}
                            >
                                <Box className="flex-1">

                                    <TextField
                                        onKeyDown={sendMessage}
                                        onChange={typingHandler}
                                        value={newMessage}
                                        variant="outlined"
                                        placeholder="Message..."
                                        fullWidth
                                        multiline
                                        maxRows={2}
                                        InputProps={{
                                            sx: {
                                                borderRadius: '50px',
                                                padding: '10px 15px',
                                                backgroundColor: theme.palette.background.paper,
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    border: `1px solid ${theme.palette.divider}`,
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: theme.palette.primary.main,
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: theme.palette.primary.main,
                                                },
                                            },
                                            style: {
                                                fontSize: '1rem',
                                            },
                                        }}
                                        InputLabelProps={{
                                            sx: {
                                                paddingLeft: '15px',
                                            },
                                        }}
                                    />
                                </Box>
                                <Box className="flex items-center gap-2">
                                    <IconButton size="small" onClick={toggleDragNdrop}>
                                        <AttachFile className="h-5 w-5" />
                                    </IconButton>
                                    {/* <IconButton size="small">
                                    <InsertEmoticon className="h-5 w-5" />
                                </IconButton> */}
                                    {/* <RecorderJSDemo/> */}
                                    <IconButton size="small" onClick={sendMessage}>
                                        <Send className="h-5 w-5" />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Box>
                    </ClickAwayListener>
                </>
            ) : null}
            {/* todo ui */}
            {/* drag and drop */}
            <Dialog open={showDragNdrop} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    Upload Files
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <Clear />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <DragNdrop onFilesSelected={handleFilesSelected} setMessages={setMessages} messages={messages} />
                </DialogContent>
            </Dialog>
        </Box>
    )
}

export default IndividualChat
