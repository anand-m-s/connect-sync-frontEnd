import React, { useEffect, useState } from "react"
import Avatar from "@mui/material/Avatar"
import IconButton from "@mui/material/IconButton"
import TextField from "@mui/material/TextField"
import { Send, VideoCall, Phone, MoreHoriz, Add, Search, AttachFile, InsertEmoticon } from "@mui/icons-material"
import { styled } from "@mui/system"
import { Box, Tooltip, useTheme } from "@mui/material"
import ScrollableFeed from 'react-scrollable-feed'
import { userAxios } from "../../../constraints/axios/userAxios"
import userApi from "../../../constraints/api/userApi"
import { ChatState } from "../../../context/ChatProvider"
import { getSenderFull, isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../../../constraints/config/chatLogic"
import { useSelector } from "react-redux"
import { toast } from "sonner"
import ChatHeader from "./ChatHeader"
import io from 'socket.io-client'

const CustomTextarea = styled(TextField)({
    "& .MuiInputBase-root": {
        borderRadius: "9999px",
        padding: "0 1rem",
        backgroundColor: "var(--tw-bg-opacity, 1) var(--tw-bg-gray-200, #e5e7eb)",
        "&.Mui-focused": {
            backgroundColor: "var(--tw-bg-opacity, 1) var(--tw-bg-gray-200, #e5e7eb)",
        },
    },
})

const ENDPOINT = "http://localhost:3000";
let socket, selectedChatCompare;




function IndividualChat({ fetchAgain, setFetchAgain }) {


    const { selectedChat, setSelectedChat } = ChatState()
    const user = useSelector((state) => state.userAuth.userInfo)
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState()
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)


    const theme = useTheme()


    // useEffect(()=>{
    //     const loadChat = async () => {   
    //         if (!userData.id) return;
    //         try {
    //           console.log(userData);
    //           const data = { userId: userData.id };
    //           console.log(data);
    //           const res = await userAxios.post(userApi.loadChat, data);
    //           console.log(res.data);
    //         } catch (error) {
    //           if (error.response && error.response.data.error) {
    //             toast.error(error.response.data.error);
    //           } else {
    //             toast.error("An unexpected error occurred.");
    //           }
    //         }
    //       };      
    //       loadChat();
    // },[userData])

    const fetchMessages = async () => {
        if (!selectedChat) return;
        try {
            setLoading(true)
            const { data } = await userAxios.get(`${userApi.sendMessage}/${selectedChat._id}`)
            console.log(data)
            setMessages(data)
            setLoading(false)

            socket.emit('join chat', selectedChat._id);
        } catch (error) {
            if (error.response && error.response.data.error) {
                toast.error(error.response.data.error);
            }
        }
    }

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit('setup', user)
        socket.on('connected', () => setSocketConnected(true))
        socket.on('typing', () => setTyping(true))
        socket.on('stop typing', () => setIsTyping(false))


    }, [])


    useEffect(() => {
        fetchMessages()
        selectedChatCompare = selectedChat

    }, [selectedChat])


    useEffect(() => {
        socket.on('message recieved', (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                // notification
            } else {
                setMessages([...messages, newMessageRecieved])
            }
        })
    })


    const sendMessage = async (e) => {
        if (e.key === 'Enter' && newMessage) {
            try {
                socket.emit('stop typing', selectedChat._id)
                setNewMessage('')
                const { data } = await userAxios.post(userApi.sendMessage, {
                    content: newMessage,
                    chatId: selectedChat._id,
                })

                console.log(data)
                socket.emit('new message', data)
                setMessages([...messages, data])
                setFetchAgain(prev => !prev);
            } catch (error) {
                if (error.response && error.response.data.error) {
                    toast.error(error.response.data.error);
                }
            }
        }
    }



    const typingHandler = (e) => {
        setNewMessage(e.target.value)
        //    typing indicator logic
        if (!socketConnected) return
        if (!typing) {
            setTyping(true)
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingType = new Date().getTime()
        let timerLength = 3000;
        setTimeout(() => {
            let timeNow = new Date().getTime()
            let timeDiff = timeNow - lastTypingType;
            if (timeDiff >= timerLength && typing) {
                socket.emit('stop typing', selectedChat._id)
                setTyping(false)
            }
        }, timerLength)
    }
    return (
        <Box flex={3.5}>
            {selectedChat ? (
                <>
                    <Box className="flex flex-col" sx={{ height: '100vh' }}>
                        {/* chat header */}
                        <ChatHeader userId={user.id} selectedChat={selectedChat.users} />
                        <ScrollableFeed>
                            <Box className="flex-1 overflow-auto p-4">
                                {messages && messages.map((m, i) => (
                                    <Box key={m._id} className="grid gap-4 m-1">
                                        <Box className={`flex items-end gap-2 ${m.sender._id === user.id ? 'justify-end' : ''}`}>
                                            {(isSameSender(messages, m, i, user.id) || isLastMessage(messages, i, user.id)) && (
                                                <Avatar
                                                    sx={{ width: 36, height: 36 }}
                                                    src={m.sender.profilePic}
                                                    alt="Avatar"
                                                >AN</Avatar>
                                            )}
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
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                                {isTyping ? <Box className='bg-black' >Lodaing...</Box> : <></>}
                            </Box>
                        </ScrollableFeed>

                        <Box className="sticky bottom-0 flex h-16 items-center justify-between p-8 "
                            sx={{ border: `1px solid ${theme.palette.divider}` }}
                        >
                            {/* <Box className="flex-1">
                                <CustomTextarea
                                    onKeyDown={sendMessage}
                                    onChange={typingHandler}
                                    value={newMessage}
                                    className=" w-full  rounded-full  px-4 text-lg  "
                                    placeholder="Message..."
                                    variant="filled"
                                    size="medium"
                                    multiline
                                />
                            </Box> */}
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
                                <IconButton size="small">
                                    <AttachFile className="h-5 w-5" />
                                </IconButton>
                                <IconButton size="small">
                                    <InsertEmoticon className="h-5 w-5" />
                                </IconButton>
                                <IconButton size="small" onClick={sendMessage}>
                                    <Send className="h-5 w-5" />
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>
                </>
            ) : null}
            {/* todo ui */}

        </Box>
    )
}

export default IndividualChat





