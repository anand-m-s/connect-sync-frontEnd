import React, { createContext, useContext, useState } from 'react';

const CallContext = createContext();

export const useCall = () => {
    return useContext(CallContext);
};

export const CallProvider = ({ children }) => {
    const [incomingCall, setIncomingCall] = useState(false);
    const [callerData, setCallerData] = useState(null);

    return (
        <CallContext.Provider value={{ incomingCall, setIncomingCall, callerData, setCallerData }}>
            {children}
        </CallContext.Provider>
    );
};

