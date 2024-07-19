import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export const useSocket = () => {
    const [socket, setSocket] = useState(null);
    useEffect(() => {
        if (!socket) {
            const newSocket = io(import.meta.env.VITE_USER_SOCKETCONNECTION);
            setSocket(newSocket);
        }
    }, [socket]);

    return { socket, setSocket };
};
