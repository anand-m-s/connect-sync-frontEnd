import Avatar from "@mui/material/Avatar"
import IconButton from "@mui/material/IconButton"
import { Add, Search } from "@mui/icons-material"
import { Box, ButtonBase, Divider, Stack, useMediaQuery, useTheme, CircularProgress } from "@mui/material"
import IndividualChat from "./IndividualChat"
import { useCallback, useContext, useEffect, useState } from "react"
import userApi from "../../../constraints/api/userApi"
import { userAxios } from "../../../constraints/axios/userAxios"
import { ChatState } from "../../../context/ChatProvider";
import { useModal } from '../../../context/modalContext';
import SearchComponent from "../modal/searchModal"
import { useSelector } from "react-redux"
import { getSender, getSenderProfilePic } from "../../../constraints/config/chatLogic"
import { format, isToday, differenceInDays, isYesterday } from 'date-fns';


export default function ChatComponent() {
    const { selectedChat, setSelectedChat, chats, setChats } = ChatState();
    const user = useSelector((state) => state.userAuth.userInfo)
    const [userData, setUserData] = useState({ userName: '', profilePic: '', id: '' })
    const { handleOpen } = useModal()
    const theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))
    const [fetchAgain, setFetchAgain] = useState(false)
    const [loading, setLoading] = useState(true)
    const updateUserData = (updates) => {
        setUserData((prevState) => ({
            ...prevState,
            ...updates
        }));
    };

    // const queryParams = new URLSearchParams(location.search)
    // const userId = queryParams.get('id')
    // useEffect(() => {
    //     const fetchUserDetails = async () => {
    //         try {
    //           userAxios.get(`${userApi.getUserDetails}?id=${userId}`)
    //                 .then((res) => {
    //                   console.log(res.data)
    //                     updateUserData({
    //                         userName: res.data.userName,
    //                         profilePic: res.data.profilePic,
    //                         id:res.data.id                       
    //                     })
    //                 })

    //         } catch (error) {
    //             if (error.response && error.response.data.error) {
    //                 toast.error(error.response.data.error);
    //             }
    //         }
    //     }     
    //     if(userId)fetchUserDetails();

    // }, [])

    const fetchChats = useCallback(async () => {
        try {
            const res = await userAxios.get(userApi.loadChat)
            setChats(res.data)
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
    }, [fetchAgain,fetchChats])
 

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
  

    return (
        <Box
            flex={5}
            className=' '
        >

            {/* <Box className="grid min-h-screen w-full grid-cols-[300px_1fr] overflow-hidden "> */}
            <Box className="overflow-hidden ">
                <Stack direction='row'>
                    <Box flex={1} className="flex flex-col " sx={{
                        height: '100vh',
                        borderRight: `1px solid ${theme.palette.divider}`
                    }}>
                        <Box className="sticky top-0 flex h-16 items-center justify-end ">
                            <Box className="flex items-center gap-2">
                                Search
                            </Box>
                            <Box className="flex items-center gap-2" >
                                <IconButton size="large" onClick={() => handleOpen('search')}>
                                    <Search className="" />
                                </IconButton>
                                <IconButton size="large">
                                    <Add className="" />
                                </IconButton>
                            </Box>
                        </Box>
                        {chats.length > 0 ? (<Box className="flex-1 overflow-auto">
                            {chats.map((chat) => (
                                <Box key={chat._id} className="grid gap-2 p-3">
                                    {loading && <CircularProgress />}
                                    <ButtonBase>
                                        <Box
                                            className="flex gap-1 p-3 rounded-md border  transition-colors"
                                            sx={{ width: '15rem' }}
                                            onClick={() => setSelectedChat(chat)}
                                            style={{
                                                backgroundColor: selectedChat && selectedChat._id === chat._id ? (theme.palette.mode === 'light' ? theme.palette.selectedChat.main : theme.palette.selectedChat.main) : 'inherit',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <Avatar className="h-12 w-12" src={getSenderProfilePic(user.id, chat.users)} alt="Avatar">JD</Avatar>
                                            <Box className="flex-1">
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
                                            </Box>
                                            <Box className="text-sm opacity-65" sx={{ fontSize: '.75rem' }}>{formatDate(chat.updatedAt)}</Box>
                                        </Box>
                                    </ButtonBase>
                                </Box>
                            ))}
                        </Box>) : (
                            <Box className='className="flex justify-center items-center gap-3 p-5 transition-colors"'>No chats yet...</Box>
                        )}

                    </Box>
                    <IndividualChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                </Stack>
                <SearchComponent source="chat" />

            </Box>
        </Box>



    );
}


