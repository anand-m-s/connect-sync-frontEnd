import { createContext, useContext, useState } from "react"


const ChatContext = createContext()


const ChatProvider = ({ children }) => {

    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [sharedPost, setSharedPost] = useState([])
    return (
        <ChatContext.Provider
            value={{ selectedChat, setSelectedChat, chats, setChats, sharedPost, setSharedPost }}
        >
            {children}
        </ChatContext.Provider>
    )
}

export const ChatState = () => {
    return useContext(ChatContext);
};



export default ChatProvider