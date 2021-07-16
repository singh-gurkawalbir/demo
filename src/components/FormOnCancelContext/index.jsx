import React, { useState, useContext} from 'react';

const FormOnCancelContext = React.createContext({
  setCancelTriggered: () => {},
  isCancelTriggered: false,
});

export const FormOnCancelProvider = ({ children }) => {
  const [cancelTriggeredForAsyncKey, setCancelTriggered] = useState();

  return (
    <FormOnCancelContext.Provider
      value={{ cancelTriggeredForAsyncKey, setCancelTriggered }}>
      {children}
    </FormOnCancelContext.Provider>
  );
};

export default function useFormOnCancel() {
  const {
    setCancelTriggered,
    cancelTriggeredForAsyncKey,
  } = useContext(FormOnCancelContext);

  return {
    setCancelTriggered,
    cancelTriggeredForAsyncKey,
  };
}

