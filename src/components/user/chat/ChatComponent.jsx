import Avatar from "@mui/material/Avatar"
import IconButton from "@mui/material/IconButton"
import { Add, Search } from "@mui/icons-material"
import { Box, useTheme } from "@mui/material"
import IndividualChat from "./IndividualChat"
import { useContext, useEffect, useState } from "react"
import userApi from "../../../constraints/api/userApi"
import { userAxios } from "../../../constraints/axios/userAxios"
import { ChatState } from "../../../context/ChatProvider";
import { useModal } from '../../../context/modalContext';
import SearchComponent from "../modal/searchModal"
import { useSelector } from "react-redux"
import { getSender } from "../../../constraints/config/chatLogic"
import ColorModeContext from "../../../context/colorModeContext"


export default function ChatComponent() {
    const { selectedChat, setSelectedChat, chats, setChats } = ChatState();
    const user = useSelector((state) => state.userAuth.userInfo)
    const [userData, setUserData] = useState({
        userName: '',
        profilePic: '',
        id: ''
    })
    const { handleOpen } = useModal()
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    const [fetchAgain,setFetchAgain]= useState(false)

    const updateUserData = (updates) => {
        setUserData((prevState) => ({
            ...prevState,
            ...updates
        }));
    };
    console.log(selectedChat)

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

    const fetchChats = async () => {
        try {
            const res = await userAxios.get(userApi.loadChat)
            console.log(res)
            const data = res.data
            setChats(data)
        } catch (error) {
            if (error.response && error.response.data.error) {
                toast.error(error.response.data.error);
            }
        }
    }
    useEffect(() => {
        fetchChats()
    }, [])


    return (
        <Box
            flex={5}
        >
            <Box className="grid min-h-screen w-full grid-cols-[300px_1fr] overflow-hidden">
                <Box className="flex flex-col border-r ">
                    <Box className="sticky top-0 flex h-16 items-center justify-end border-b">
                        {/* <Box className="flex items-center gap-2">
                            <Avatar className="h-8 w-8" src="/placeholder-user.jpg" alt="Avatar">JD</Avatar>
                            <span className="font-medium">search</span>
                        </Box> */}
                        <Box className="flex items-center gap-2" onClick={() => handleOpen('search')}>
                            <IconButton size="large">
                                <Search className="h-5 w-5" />
                            </IconButton>
                            <IconButton size="large">
                                <Add className="h-5 w-5" />
                            </IconButton>
                        </Box>
                    </Box>
                    {chats ? (<Box className="flex-1 overflow-auto">
                        {chats.map((chat) => (<Box className="grid gap-2 p-4">
                            {/* <Box className="flex items-center gap-3 rounded-md border p-2 transition-colors "
                                onClick={() => setSelectedChat(chat)}
                                bgcolor={selectedChat === chat ? '' : ''}
                                key={chat._id}
                            > */}
                            <Box
                                className="flex items-center gap-3 rounded-md border p-2 transition-colors"
                                onClick={() => setSelectedChat(chat)}
                                style={{
                                    backgroundColor: selectedChat === chat ? (theme.palette.mode === 'light' ? theme.palette.primary.light : theme.palette.primary.dark) : 'inherit'
                                }}
                            >
                                <Avatar className="h-10 w-10" src="/placeholder-user.jpg" alt="Avatar">JD</Avatar>
                                <Box className="flex-1">
                                    <Box className="font-medium">
                                        {!chat.isGroupChat ? getSender(user.id, chat.users) : chat.chatName}
                                    </Box>
                                    <Box className="text-sm  ">Hey, how's it going?</Box>
                                </Box>
                                <Box className="text-sm">2:34 PM</Box>
                            </Box>
                        </Box>
                        ))}

                    </Box>) : (
                        <h1 >No chats yet</h1>
                    )}

                </Box>
                <IndividualChat userData={userData} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                <SearchComponent source="chat" />

            </Box>
        </Box>
    )
}

