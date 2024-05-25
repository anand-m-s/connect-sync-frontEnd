import React, { createContext, useContext, useState } from 'react'

const ModalContext = createContext()
export const useModal = () => useContext(ModalContext)

export const ModalProvider = ({ children }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    return (
        <ModalContext.Provider value={{open,handleOpen,handleClose}}>
            {children}
        </ModalContext.Provider>
    )
}


