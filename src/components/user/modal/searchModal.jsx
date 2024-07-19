import React, { useEffect, useState, useCallback } from "react";
import {
    Avatar,
    Box,
    IconButton,
    InputBase,
    Modal,
    Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useModal } from "../../../context/modalContext";
import { userAxios } from "../../../constraints/axios/userAxios";
import userApi from "../../../constraints/api/userApi";
import { useTheme } from "@emotion/react";
import debounce from 'lodash/debounce';
import { useNavigate } from "react-router";
import { ChatState } from "../../../context/ChatProvider";


export default function SearchComponent() {
    
    const { modals, handleClose,source } = useModal();
    const [users, setUsers] = useState([])
    const [search, setSearch] = useState('')
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const navigate = useNavigate()
    const theme = useTheme()
    const { setSelectedChat, chats, setChats } = ChatState()

    const debounceSetSearch = useCallback(
        debounce((value) => setSearch(value),600),
        []
    );

    useEffect(() => {
        const getAlluser = async () => {
            try {
                const user = await userAxios.get(userApi.getAllUsers, {
                    params: { searchTerm: search }
                })
                // console.log(user.data)
                setUsers(user.data)
            } catch (error) {
                console.error('Error fetching user datas:', error);
            }
        }
        if (isSearchOpen && search) {
            getAlluser()
        }
        return () => {
            debounceSetSearch.cancel();
        }
    }, [search, debounceSetSearch])

    const handleModalClose = () => {
        setIsSearchOpen(false);
        setSearch('');
        handleClose('search');
    };

    const filteredUsers = users.filter((user) =>
        user.userName.toLowerCase().includes(search.toLowerCase())
    );
    // const handleUserClick = (userId) => {
    //     console.log('inside handle user click',userId)   
    //     handleModalClose()
    //     navigate(`/profile?userId=${userId}`)
    // }
    const handleUserClick = async (userId) => {
        handleModalClose();
        if (source === 'navbar') {
            navigate(`/profile?userId=${userId}`);
        } else if (source === 'chat') {
            try {
                console.log('source = chat in search modal')
                const res = await userAxios.post(userApi.loadChat, { userId });
                console.log(res.data)
                const data = res.data
                if (!Array.isArray(chats)) {
                    setChats([]);
                }             
                if (!chats.find((c) => c._id === data._id)) {
                    setChats([data, ...chats]);
                }
                setSelectedChat(data)
                handleModalClose()
                navigate('/chat')
            } catch (error) {
                console.error('Error fetching chat data:', error);
            }
        }
    };

    return (
        <Modal
            open={modals.search}
            onClose={handleModalClose}
            sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 500,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="h6">Search</Typography>
                    <IconButton onClick={() => handleClose('search')} size="large">
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}
                    className="border rounded-lg "
                >
                    <InputBase
                        onClick={() => setIsSearchOpen(true)}
                        onChange={(e) => debounceSetSearch(e.target.value)}
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search for users, hashtags, and more"
                        inputProps={{ "aria-label": "search" }}
                    />
                    <IconButton sx={{ p: "10px" }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Box>
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                        <Box
                            onClick={() => handleUserClick(user._id)}
                            key={index}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                p: 1,
                                borderRadius: 1,
                                bgcolor: theme.palette.background.default,
                                '&:hover': {
                                    bgcolor: theme.palette.action.hover,
                                },
                                cursor: "pointer",
                                transition: "background-color 0.3s",
                                mb: 1,
                            }}
                        >
                            <Avatar
                                alt={user.userName}
                                src={user.profilePic}
                                sx={{ width: 48, height: 48 }}
                            />
                            <Box>
                                <Typography variant="body1" fontWeight="medium">
                                    {user.userName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {user.bio}
                                </Typography>
                            </Box>
                        </Box>
                    ))
                ) : (<Typography variant="body2" color="text.secondary">
                    No users found.
                </Typography>
                )}
            </Box>
        </Modal>
    );
}
