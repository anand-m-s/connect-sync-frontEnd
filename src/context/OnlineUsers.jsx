import React, { createContext, useContext, useState } from 'react';

const OnlineUsersContext = createContext();

export const OnlineUsersProvider = ({ children }) => {
    const [onlineUsers, setOnlineUsers] = useState([]);

    return (
        <OnlineUsersContext.Provider value={{ onlineUsers, setOnlineUsers }}>
            {children}
        </OnlineUsersContext.Provider>
    );
};

export const useOnlineUsers = () => useContext(OnlineUsersContext);
