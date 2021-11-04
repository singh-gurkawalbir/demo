import React, { useContext, useCallback, useState } from 'react';

const FieldPickerContext = React.createContext();

function getStartingChangeSet() {
  const sessionData = localStorage.getItem('fieldPicker');
  const startingChangeSet = sessionData ? JSON.parse(sessionData) : {};

  // console.log('startingChangeSet: ', startingChangeSet);

  return startingChangeSet;
}

export const FieldPickerProvider = ({ children }) => {
  const [changeSet, setChangeSet] = useState(() => getStartingChangeSet());

  const onChange = useCallback((fieldId, isPublic) => {
    setChangeSet(current => {
      const newSet = {...current, [fieldId]: isPublic };

      localStorage.setItem('fieldPicker', JSON.stringify(newSet));

      return newSet;
    });
  }, []);

  const initialState = {
    changeSet,
    onChange,
  };

  return (
    <FieldPickerContext.Provider
      value={initialState}>
      {children}
    </FieldPickerContext.Provider>
  );
};

export function useFieldPickerContext() {
  return useContext(FieldPickerContext);
}

export default {
  FieldPickerProvider,
  useFieldPickerContext,
};
