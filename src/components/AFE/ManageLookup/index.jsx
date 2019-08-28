import React, { useState } from 'react';
import _ from 'lodash';
import ModalDialog from '../../ModalDialog';
import Lookup from './Lookup';
import LookupListing from './LookupListing';

export default function ManageLookup(props) {
  const { lookups, updateLookups, onCancelClick } = props;
  const [isListView, showListView] = useState(true);
  const [lookup, setLookup] = useState({});
  const onSave = (isEdit, val) => {
    const lookupsTmp = Object.assign([], lookups);

    if (!isEdit) {
      if (!_.find(lookupsTmp, { name: val.name })) {
        lookupsTmp.push(val);
        updateLookups(lookupsTmp);
      } else {
        // to be checked if we show any alert. Currently In case of adding new Lookup,  we dont add the record if we have existing lookup with same name.
      }
    } else {
      const index = _.findIndex(lookupsTmp, { name: lookup && lookup.name });

      lookupsTmp[index] = val;

      updateLookups(lookupsTmp);
    }

    showListView(!isListView);
  };

  const editLookupHandler = val => {
    setLookup(val);
    showListView(false);
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
    showListView(!isListView);
  };

  return (
    <ModalDialog
      show
      actionLabel={isListView ? 'New Lookup' : 'Back to Lookup'}
      actionHandler={toggleLookupMode}>
      <span>Manage Lookups</span>
      {isListView ? (
        <LookupListing
          lookups={lookups}
          updateLookup={editLookupHandler}
          deleteLookup={deleteLookup}
          lookupUpdateHandler={onSave}
          onCancelClick={onCancelClick}
        />
      ) : (
        <Lookup
          lookup={lookup}
          onCancelClick={toggleLookupMode}
          onSave={onSave}
        />
      )}
    </ModalDialog>
  );
}
