import React, { useState } from 'react';
import _ from 'lodash';
import ModalDialog from '../../ModalDialog';
import NewLookup from './NewLookup';
import LookupListing from './LookupListing';

export default function ManageLookup(props) {
  const { lookups, onUpdate, onAdd, onClose, onCancelClick } = props;
  const [isNewLookup, setIsNewLookup] = useState(false);
  const [mode, setMode] = useState('create');
  const [lookupObj, setLookupObj] = useState({});
  const addNewLookup = val => {
    onAdd(val);
    setIsNewLookup(!isNewLookup);
  };

  const cancelHandler = () => {
    if (isNewLookup) {
      setIsNewLookup(false);
    } else {
      onCancelClick();
    }
  };

  const editLookupHandler = val => {
    setLookupObj(val);
    setMode('edit');
    setIsNewLookup(true);
  };

  const deleteLookup = lookupObj => {
    if (lookupObj && lookupObj.name) {
      const modifiedLookups = _.filter(
        lookups,
        obj => obj.name !== lookupObj.name
      );

      onUpdate(modifiedLookups);
    }
  };

  return (
    <ModalDialog
      show
      actionLabel={isNewLookup ? 'Back to Lookup' : 'New Lookup'}
      actionHandler={() => {
        setIsNewLookup(!isNewLookup);
      }}>
      <span>Manage Lookups</span>
      {isNewLookup ? (
        <NewLookup
          mode={mode}
          lookupObj={lookupObj}
          onCancelClick={cancelHandler}
          onSubmit={addNewLookup}
        />
      ) : (
        <LookupListing
          lookups={lookups}
          editLookupHandler={editLookupHandler}
          deleteLookup={deleteLookup}
          lookupUpdateHandler={onUpdate}
          onCancelClick={cancelHandler}
          onClose={onClose}
        />
      )}
    </ModalDialog>
  );
}
