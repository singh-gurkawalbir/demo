import React, { createContext, useContext } from 'react';

const IsLoggableContext = createContext();

export default function IsLoggableContextProvider({children, isLoggable}) {
  return (
    <IsLoggableContext.Provider value={isLoggable}>
      {children}
    </IsLoggableContext.Provider>
  );
}

export function useIsLoggable() {
  return useContext(IsLoggableContext);
}
export const withIsLoggable = Component => ({isLoggable: isLoggableOrig, ...rest}) => {
  const isLoggable = useIsLoggable();

  // first check the interface prop is defined then check the context
  const firstDefinedProp = [isLoggableOrig, isLoggable].find(bool => typeof bool === 'boolean');
  // if neither the interface nor the context indicate the element is loggable assume it to be not loggable
  const finalIsLoggable = firstDefinedProp || false;

  return (
    // resolve isLoggable first pass the new isloggable context to the element
    <IsLoggableContextProvider isLoggable={finalIsLoggable}>
      <Component {...rest} isLoggable={finalIsLoggable} />
    </IsLoggableContextProvider>
  );
};
