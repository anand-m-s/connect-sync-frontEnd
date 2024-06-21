// import { useEffect, useState } from 'react';
// import io from 'socket.io-client';


// export const useSocket = () => {
//     const [socket, setSocket] = useState(null)
//     useEffect(() => {
//         if (!socket) {
//             const newSocket = io('http://localhost:3000');
//             if (newSocket) {
//                 setSocket(newSocket)
//             }
//         }
//     }, [setSocket,socket])
//     return { socket, setSocket }
// }

import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export const useSocket = () => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!socket) {
            const newSocket = io('http://localhost:3000');
            setSocket(newSocket);
        }
    }, [socket]);

    return { socket, setSocket };
};
