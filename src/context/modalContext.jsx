import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();
export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
    const [modals, setModals] = useState({
        create: false,
        search: false,
    });
    const [source,setSource]=useState()

    const handleOpen = (modalName) => setModals((prev) => ({ ...prev, [modalName]: true }));
    const handleClose = (modalName) => setModals((prev) => ({ ...prev, [modalName]: false }));

    return (
        <ModalContext.Provider value={{ modals, handleOpen, handleClose,source,setSource }}>
            {children}
        </ModalContext.Provider>
    );
};

