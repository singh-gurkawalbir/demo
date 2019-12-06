import React, { useState } from 'react';
import _ from 'lodash';
import ModalDialog from '../../ModalDialog';
import AddEditLookup from './AddEditLookup';
import LookupList from './LookupList';

export default function ManageLookup(props) {
  const { lookups, onUpdate, onCancel, disabled, options } = props;
  const [isListView, showListView] = useState(true);
  const [lookup, setLookup] = useState({});
  const [error, setError] = useState();
  const handleSubmit = (isEdit, val) => {
    const lookupsTmp = [...lookups];

    if (!isEdit) {
      if (!lookupsTmp.find(ele => ele.name === val.name)) {
        setError();
        lookupsTmp.push(val);
        onUpdate(lookupsTmp);
      } else {
        // showing error for duplicate name

        setError('Lookup with same name is already present!');

        return;
      }
    } else if (lookup) {
      setError();
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
    setError();
    setLookup({});
    showListView(!isListView);
  };

  return (
    <ModalDialog
      show
      actionLabel={isListView ? 'New Lookup' : 'Back to Lookup'}
      actionHandler={toggleLookupMode}
      minWidth="sm"
      maxWidth="lg">
      <span>Manage Lookups</span>
      {isListView ? (
        <LookupList
          lookups={lookups}
          onUpdate={handleEdit}
          onDelete={handleDelete}
          onCancel={onCancel}
          disabled={disabled}
        />
      ) : (
        <AddEditLookup
          lookup={lookup}
          error={error}
          onCancel={toggleLookupMode}
          options={options}
          onSave={handleSubmit}
          disabled={disabled}
        />
      )}
    </ModalDialog>
  );
}
