import React, { useState } from 'react';
import _ from 'lodash';
import ModalDialog from '../../ModalDialog';
import Lookup from './Lookup';
import LookupListing from './LookupListing';

export default function ManageLookup(props) {
  const { lookups, updateLookups, onCancelClick } = props;
  const [isNewLookup, setIsNewLookup] = useState(false);
  const [lookup, setLookup] = useState({});
  const onSave = (isEdit, val) => {
    if (!isEdit) {
      if (!_.find(lookups, { name: val.name })) {
        lookups.push(val);
        updateLookups(lookups);
      } else {
        // to be checked if we show any alert. Currently In case of adding new Lookup,  we dont add the record if we have existing lookup with same name.
      }
    } else {
      const obj = _.find(lookups, { name: lookup && lookup.name });

      Object.assign(obj, val);
      updateLookups(lookups);
    }

    setIsNewLookup(!isNewLookup);
  };

  const editLookupHandler = val => {
    setLookup(val);
    setIsNewLookup(true);
  };

  const deleteLookup = lookupObj => {
    if (lookupObj && lookupObj.name) {
      const modifiedLookups = _.filter(
        lookups,
        obj => obj.name !== lookupObj.name
      );

      updateLookups(modifiedLookups);
    }
  };

  const toggleLookupMode = () => {
    setLookup({});
    setIsNewLookup(!isNewLookup);
  };

  return (
    <ModalDialog
      show
      actionLabel={isNewLookup ? 'Back to Lookup' : 'New Lookup'}
      actionHandler={toggleLookupMode}>
      <span>Manage Lookups</span>
      {isNewLookup ? (
        <Lookup
          lookupObj={lookup}
          onCancelClick={() => {
            setIsNewLookup(false);
          }}
          onSave={onSave}
        />
      ) : (
        <LookupListing
          lookups={lookups}
          updateLookup={editLookupHandler}
          deleteLookup={deleteLookup}
          lookupUpdateHandler={onSave}
          onCancelClick={onCancelClick}
        />
      )}
    </ModalDialog>
  );
}
