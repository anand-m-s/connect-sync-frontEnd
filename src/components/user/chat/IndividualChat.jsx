import React, { useEffect, useState } from "react"
import Avatar from "@mui/material/Avatar"
import IconButton from "@mui/material/IconButton"
import TextField from "@mui/material/TextField"
import { Send, VideoCall, Phone, MoreHoriz, Add, Search, AttachFile, InsertEmoticon } from "@mui/icons-material"
import { styled } from "@mui/system"
import { Box } from "@mui/material"
import { userAxios } from "../../../constraints/axios/userAxios"
import userApi from "../../../constraints/api/userApi"
import { ChatState } from "../../../context/ChatProvider"
import { getSenderFull } from "../../../constraints/config/chatLogic"
import { useSelector } from "react-redux"

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





    console.log(userData)

    return (
        <>
            {selectedChat ? (
             <>
             {/* {getSenderFull(user.id,selectedChat.users)} */}
                <Box className="flex flex-col">
                    <Box className="sticky top-0 flex h-16 items-center justify-between border-b  ">
                        <Box className="flex items-center gap-3">
                            <Avatar className="h-10 w-10" alt="Avatar">JD</Avatar>
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
                    <Box className="flex-1 overflow-auto p-4">
                        <Box className="grid gap-4">
                            <Box className="flex items-end gap-2">
                                <Avatar className="h-8 w-8" src="/placeholder-user.jpg" alt="Avatar">JD</Avatar>
                                <Box className="max-w-[70%] rounded-lg border p-3 text-sm ">
                                    <p>Hey, how's it going?</p>
                                    <Box className="mt-1 text-xs ">2:34 PM</Box>
                                </Box>
                            </Box>
                            <Box className="flex justify-end items-end gap-2">
                                <Box className="max-w-[70%]  bg-blue-500 rounded-lg p-3 text-sm text-white">
                                    <p>I'm doing great, thanks for asking!</p>
                                    <Box className="mt-1 text-xs text-gray-200">2:35 PM</Box>
                                </Box>
                                <Avatar className="h-8 w-8" src="/placeholder-user.jpg" alt="Avatar">JD</Avatar>
                            </Box>
                            <Box className="flex items-end gap-2">
                                <Avatar className="h-8 w-8" src="/placeholder-user.jpg" alt="Avatar">JD</Avatar>
                                <Box className="max-w-[70%] rounded-lg border p-3 text-sm ">
                                    <p>Did you see the new update?</p>
                                    <Box className="mt-1 text-xs text-gray-500 dark:text-gray-400">11:23 AM</Box>
                                </Box>
                            </Box>
                            <Box className="flex justify-end items-end gap-2">
                                <Box className="max-w-[70%] rounded-lg bg-blue-500 p-3 text-sm text-white">
                                    <p>Yes, I just checked it out. Looks great!</p>
                                    <Box className="mt-1 text-xs text-gray-200">11:25 AM</Box>
                                </Box>
                                <Avatar className="h-8 w-8" src="/placeholder-user.jpg" alt="Avatar">JD</Avatar>
                            </Box>
                        </Box>
                    </Box>
                    <Box className="sticky bottom-0 flex h-16 items-center justify-between px-4 border ">
                        <Box className="flex-1">
                            <CustomTextarea
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