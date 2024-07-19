import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }) => {
  const [selected, setSelected] = useState('');

  return (
    <SidebarContext.Provider value={{ selected, setSelected }}>
      {children}
    </SidebarContext.Provider>
  );
};
