import React, { useEffect, useState } from "react"
import Avatar from "@mui/material/Avatar"
import IconButton from "@mui/material/IconButton"
import TextField from "@mui/material/TextField"
import { Send, VideoCall, Phone, MoreHoriz, Add, Search, AttachFile, InsertEmoticon } from "@mui/icons-material"
import { styled } from "@mui/system"
import { Box, Tooltip } from "@mui/material"
import ScrollableFeed from 'react-scrollable-feed'
import { userAxios } from "../../../constraints/axios/userAxios"
import userApi from "../../../constraints/api/userApi"
import { ChatState } from "../../../context/ChatProvider"
import { getSenderFull, isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../../../constraints/config/chatLogic"
import { useSelector } from "react-redux"
import { toast } from "sonner"

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

function IndividualChat({ userData, fetchAgain, setFetchAgain }) {


    const { selectedChat, setSelectedChat } = ChatState()
    const user = useSelector((state) => state.userAuth.userInfo)
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState()


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
        } catch (error) {
            if (error.response && error.response.data.error) {
                toast.error(error.response.data.error);
            }
        }
    }


    useEffect(() => {
        fetchMessages()
    }, [selectedChat])

    const sendMessage = async (e) => {
        if (e.key === 'Enter' && newMessage) {
            try {
                setNewMessage('')
                const { data } = await userAxios.post(userApi.sendMessage, {
                    content: newMessage,
                    chatId: selectedChat._id,
                })

                console.log(data)
                setMessages([...messages, data])
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
    }
    return (
        <>
            {selectedChat ? (
                <>
                    {/* {getSenderFull(user.id,selectedChat.users)} */}
                    <Box className="flex flex-col" sx={{ height: '100vh' }}>
                        <Box className="sticky top-0 flex h-16 items-center justify-between border-b  ">
                            <Box className="flex items-center gap-3">
                                <Avatar className="h-10 w-10" alt="Avatar">{ }</Avatar>
                                <Box>
                                    <Box className="font-medium"></Box>
                                    <Box className="text-sm text-gray-500 dark:text-gray-400">Online</Box>
                                </Box>
                            </Box>
                            <Box className="flex items-center gap-2">
                                <IconButton size="small">
                                    <VideoCall className="h-5 w-5" />
                                </IconButton>
                                <IconButton size="small">
                                    <Phone className="h-5 w-5" />
                                </IconButton>
                                <IconButton size="small">
                                    <MoreHoriz className="h-5 w-5" />
                                </IconButton>
                            </Box>
                        </Box>                       
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
                                                />
                                            )}
                                            <Box
                                                className={`max-w-[70%] rounded-lg p-2 text-sm ${m.sender._id === user.id ? 'bg-blue-500 text-white border' : 'border'
                                                    } ${(isSameSender(messages, m, i, user.id) || isLastMessage(messages, i, user.id)) ? 'ml-0' : 'ml-12'}`}
                                            >
                                                <p>{m.content}</p>
                                                <Box className={`mt-1 text-xs ${m.sender._id === user.id ? 'text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>
                                                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </ScrollableFeed>

                        <Box className="sticky bottom-0 flex h-16 items-center justify-between px-4 border ">
                            <Box className="flex-1">
                                <CustomTextarea
                                    onKeyDown={sendMessage}
                                    onChange={typingHandler}
                                    value={newMessage}
                                    className=" w-full resize-none rounded-full  px-4 text-lg  "
                                    placeholder="Message..."
                                    variant="filled"
                                    size="medium"
                                    multiline
                                />
                            </Box>
                            <Box className="flex items-center gap-2">
                                <IconButton size="small">
                                    <AttachFile className="h-5 w-5" />
                                </IconButton>
                                <IconButton size="small">
                                    <InsertEmoticon className="h-5 w-5" />
                                </IconButton>
                                <IconButton size="small">
                                    <Send className="h-5 w-5" />
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>
                </>
            ) : null}
            {/* todo ui */}

        </>
    )
}

export default IndividualChat





