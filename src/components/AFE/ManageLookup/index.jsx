import React, { useState } from 'react';
import _ from 'lodash';
import ModalDialog from '../../ModalDialog';
import Lookup from './Lookup';
import LookupListing from './LookupListing';

export default function ManageLookup(props) {
  const { lookups, onUpdate, onCancel } = props;
  const [isListView, showListView] = useState(true);
  const [lookup, setLookup] = useState({});
  const handleSubmit = (isEdit, val) => {
    const lookupsTmp = [...lookups];

    if (!isEdit) {
      if (!lookupsTmp.find(ele => ele.name === val.name)) {
        lookupsTmp.push(val);
        onUpdate(lookupsTmp);
      } else {
        // to be checked if we show any alert. Currently In case of adding new Lookup,  we dont add the record if we have existing lookup with same name.
      }
    } else if (lookup) {
      const index = lookupsTmp.findIndex(ele => ele.name === lookup.name);

      lookupsTmp[index] = val;

      onUpdate(lookupsTmp);
    }

    showListView(!isListView);
  };

  const handleEdit = val => {
    setLookup(val);
    showListView(false);
  };

  const handleDelete = lookupObj => {
    if (lookupObj && lookupObj.name) {
      const modifiedLookups = _.filter(
        lookups,
        obj => obj.name !== lookupObj.name
      );

      onUpdate(modifiedLookups);
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
          onUpdate={handleEdit}
          onDelete={handleDelete}
          onCancel={onCancel}
        />
      ) : (
        <Lookup
          lookup={lookup}
          onCancel={toggleLookupMode}
          onSave={handleSubmit}
        />
      )}
    </ModalDialog>
  );
}
