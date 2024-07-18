import React, { createContext, useContext, useState } from 'react';

const OnlineUsersContext = createContext();

export const OnlineUsersProvider = ({ children }) => {
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notificationCount,setNotificationCount]= useState(0)
    const [notification,setNotification]= useState([])

    return (
        <OnlineUsersContext.Provider value={{ onlineUsers, setOnlineUsers,notificationCount,setNotificationCount,notification,setNotification }}>
            {children}
        </OnlineUsersContext.Provider>
    );
};

export const useOnlineUsers = () => useContext(OnlineUsersContext);
