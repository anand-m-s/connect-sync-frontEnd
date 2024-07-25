import IconButton from "@mui/material/IconButton"
import { Add, Search } from "@mui/icons-material"
import { Box, ButtonBase, Divider, Stack, useMediaQuery, useTheme, CircularProgress, Badge, Collapse } from "@mui/material"
import IndividualChat from "./IndividualChat"
import { useCallback, useEffect, useState } from "react"
import userApi from "../../../constraints/api/userApi"
import { userAxios } from "../../../constraints/axios/userAxios"
import { ChatState } from "../../../context/ChatProvider";
import { useModal } from '../../../context/modalContext';
import SearchComponent from "../modal/searchModal"
import { useSelector } from "react-redux"
import { getSender } from "../../../constraints/config/chatLogic"
import { format, isToday, differenceInDays, isYesterday } from 'date-fns';
import { useOnlineUsers } from "../../../context/OnlineUsers"
import ChatAvatar from "../../ui/miniComponents/ChatAvatar"
import Skeleton from '@mui/material/Skeleton';
import Navbar from "../Navbar/Navbar"
import Notifications from "../notification/Notification"
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';


export default function ChatComponent() {
    const { selectedChat, setSelectedChat, chats, setChats } = ChatState();
    const user = useSelector((state) => state.userAuth.userInfo)
    const { handleOpen, setSource } = useModal()
    const theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [fetchAgain, setFetchAgain] = useState(false)
    const [loading, setLoading] = useState(true)
    const [checked, setChecked] = useState(false)
    const { notificationCount, notification, onlineUsers } = useOnlineUsers()




    const fetchChats = useCallback(async () => {
        try {
            const res = await userAxios.get(userApi.loadChat)
            console.log(res.data)
            const filteredChats = res.data.filter(chat => !chat.isBlocked)
            setChats(filteredChats)
        } catch (error) {
            if (error.response && error.response.data.error) {
                toast.error(error.response.data.error)
            }
        } finally {
            setLoading(false)
        }
    }, [setChats])


    useEffect(() => {
        fetchChats()
    }, [fetchAgain, fetchChats])


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isToday(date)) {
            return format(date, 'HH:mm');
        }
        if (isYesterday(date)) {
            return 'yesterday'
        }
        const daysAgo = differenceInDays(new Date(), date);
        return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
    };

    const handleSearchClick = () => {
        handleOpen('search')
        setSource('chat')

    }

    return (
        <Box
            flex={5}

        >


            <Box className="overflow-hidden">

                <Stack direction='row'>

                    <Box flex={1} className="flex flex-col" sx={{
                        height: '100vh',
                        borderRight: `1px solid ${theme.palette.divider}`
                    }}>
                        {
                            isSmallScreen &&
                            <>
                                <Box
                                    className='flex justify-between sticky top-0 z-20 w-full'
                                    sx={{
                                        backdropFilter: 'blur(77px)',
                                        // backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: adjust opacity as needed
                                    }}>
                                    <Navbar />
                                    {/* <Box className='p-5'>
                                        <Badge badgeContent={notificationCount} color="primary">
                                            <NotificationsNoneIcon fontSize='medium' color={!checked ? 'disabled' : 'error'} onClick={() => setChecked(prev => !prev)} />
                                        </Badge>
                                    </Box> */}
                                </Box>
                                <Collapse in={checked} className='mt-1 p-2 rounded-xl'
                                >
                                    {checked && <Notifications loadingStates={notification} value={0} />}
                                </Collapse>
                            </>
                        }
                        <Box className="sticky top-0 flex h-16 items-center justify-end ">
                            {!isSmallScreen && <Box className="flex items-center gap-2">
                                search
                            </Box>}
                            <Box className="flex items-center gap-2" >
                               
                                <IconButton size="large" onClick={handleSearchClick}>
                                    <Search className="" />
                                </IconButton>
                              
                            </Box>
                        </Box>
                        {chats.length > 0 ? (<Box className="flex-1 overflow-auto">
                            {chats.map((chat) => (
                                <Box key={chat._id} className="grid gap-2 p-3">
                                    {loading && <Box className>
                                        <Skeleton animation='wave' className="p-8" />
                                    </Box>
                                    }
                                    <ButtonBase>
                                        <Box
                                            className={`flex gap-1 p-3 ${isSmallScreen ? 'rounded-3xl' : 'rounded-md'} border transition-colors`} sx={{ width: isSmallScreen ? '4.1rem' : '15rem' }}
                                            onClick={() => setSelectedChat(chat)}
                                            style={{
                                                backgroundColor: selectedChat && selectedChat._id === chat._id ? (theme.palette.mode === 'light' ? theme.palette.selectedChat.main : theme.palette.selectedChat.main) : 'inherit',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <ChatAvatar onlineUsers={onlineUsers} user={user} chat={chat} />
                                            {!isSmallScreen && <Box className="flex-1">
                                                <Box className="font-medium flex ml-1">
                                                    {!chat.isGroupChat ? getSender(user.id, chat.users) : chat.chatName}
                                                </Box>
                                                <Box className="flex text-sm ml-3">
                                                    {/* {chat.latestMessage.content.length >10? `${chat.latestMessage.content.slice(0,10)}...` : chat.latestMessage.content} */}
                                                    {chat.latestMessage && chat.latestMessage.content ? (
                                                        chat.latestMessage.content.length > 10
                                                            ? `${chat.latestMessage.content.slice(0, 10)}...`
                                                            : chat.latestMessage.content
                                                    ) : (
                                                        ''
                                                    )}
                                                </Box>
                                            </Box>}
                                            {!isSmallScreen && <Box className="text-sm opacity-65" sx={{ fontSize: '.75rem' }}>{formatDate(chat.updatedAt)}</Box>}
                                        </Box>
                                    </ButtonBase>
                                </Box>
                            ))}
                        </Box>) : (
                            <Box className='text-center p-4 font-medium text-lg border rounded-2xl'>No chats yet...</Box>
                        )}

                    </Box>
                    <Box flex={4}>

                        <IndividualChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                    </Box>

                </Stack>
                <SearchComponent source="chat" />

            </Box>
        </Box>



    );
}


