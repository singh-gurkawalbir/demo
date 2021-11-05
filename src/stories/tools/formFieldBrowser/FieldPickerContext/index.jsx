import produce from 'immer';
import React, { useContext, useCallback, useState } from 'react';

const FieldPickerContext = React.createContext();
const setLocalStorage = value => {
  localStorage.setItem('fieldPicker', JSON.stringify(value));

  return value;
};

const isChangeSetCorrupt = set =>
  Object.keys(set).reduce((prev, key) => {
    if (typeof set[key] !== 'object') {
      return true;
    }

    return prev;
  }, false);

function getStartingChangeSet() {
  const sessionData = localStorage.getItem('fieldPicker');
  const startingChangeSet = sessionData ? JSON.parse(sessionData) : {};

  // The schema of the object stored in local changed. To prevent crashes,
  // we ignore the local storage if there is a schema mismatch.
  return isChangeSetCorrupt(startingChangeSet) ? {} : startingChangeSet;
}

export const FieldPickerProvider = ({ children }) => {
  const [changeSet, setChangeSet] = useState(() => getStartingChangeSet());

  const clearAllFields = useCallback(() => {
    setChangeSet(() => {
      const newSet = {};

      setLocalStorage(newSet);

      return newSet;
    });
  }, []);

  const clearField = useCallback((resourceType, fieldId) => {
    setChangeSet(current => {
      const newSet = produce(current, draft => {
        delete draft[resourceType][fieldId];
      });

      return setLocalStorage(newSet);
    });
  }, []);

  const setField = useCallback((resourceType, fieldId, isPublic) => {
    setChangeSet(current => {
      const newSet = produce(current, draft => {
        if (!draft[resourceType]) {
          draft[resourceType] = {};
        }
        draft[resourceType][fieldId] = isPublic;
      });

      return setLocalStorage(newSet);
    });
  }, []);

  const initialState = {
    changeSet,
    setField,
    clearField,
    clearAllFields,
  };

  return (
    <FieldPickerContext.Provider value={initialState}>
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
