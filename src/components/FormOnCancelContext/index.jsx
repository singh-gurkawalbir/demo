import React, { useState, useContext, useCallback} from 'react';

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

export default function useFormOnCancel(key) {
  const {
    setCancelTriggered: onCancel,
    cancelTriggeredForAsyncKey,
  } = useContext(FormOnCancelContext);

  const setCancelTriggered = useCallback(() => {
    onCancel(key);
  }, [key, onCancel]);

  const closeCancelTriggered = useCallback(() => {
    onCancel(null);
  }, [onCancel]);

  return {
    setCancelTriggered,
    closeCancelTriggered,
    cancelTriggeredForAsyncKey,
  };
}

