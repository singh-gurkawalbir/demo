import React, { useContext } from 'react';

const DrawerContext = React.createContext();

export const DrawerProvider = ({ children, height, fullPath, onClose }) => (
  <DrawerContext.Provider
    value={{ height, fullPath, onClose }}>
    {children}
  </DrawerContext.Provider>
);

export function useDrawerContext() {
  return useContext(DrawerContext);
}

export default {
  DrawerProvider,
  useDrawerContext,
};
