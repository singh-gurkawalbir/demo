import React, { useState, useContext, useCallback} from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../reducers';

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

export default function useFormOnCancelContext(key) {
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

export function useFormOnCancel(key) {
  const {setCancelTriggered} = useFormOnCancelContext(key);

  const disabled = useSelector(state => selectors.isAsyncTaskLoading(state, key));

  return {
    setCancelTriggered,
    disabled,
  };
}
