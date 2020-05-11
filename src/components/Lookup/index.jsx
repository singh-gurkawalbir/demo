import React, { useState, useCallback } from 'react';
import { Button } from '@material-ui/core';
import { filter } from 'lodash';
import ModalDialog from '../ModalDialog';
import ManageLookup from './Manage';
import LookupListRow from './LookupListRow';

export default function Lookup(props) {
  const {
    lookups = [],
    onSave,
    onCancel,
    resourceId,
    resourceType,
    flowId,
    disabled,
    options,
  } = props;
  const [value, setValue] = useState(lookups);
  const [showListView, setShowListView] = useState(true);
  const [selectedLookup, setSelectedLookup] = useState({});
  const [error, setError] = useState();
  const handleSubmit = useCallback(
    (isEdit, val) => {
      const lookupsTmp = [...value];

      if (!isEdit) {
        if (!lookupsTmp.find(ele => ele.name === val.name)) {
          setError();
          lookupsTmp.push(val);
          onSave(lookupsTmp);
        } else {
          // showing error for duplicate name

          setError('Lookup with same name is already present!');

          return;
        }
      } else if (selectedLookup) {
        setError();
        const index = lookupsTmp.findIndex(
          ele => ele.name === selectedLookup.name
        );

        lookupsTmp[index] = val;

        onSave(lookupsTmp);
      }

      setValue(lookupsTmp);
      setShowListView(!showListView);
    },
    [onSave, selectedLookup, showListView, value]
  );
  const handleDelete = useCallback(
    lookupObj => {
      if (lookupObj && lookupObj.name) {
        const modifiedLookups = filter(
          value,
          obj => obj.name !== lookupObj.name
        );

        onSave(modifiedLookups);
      }
    },
    [onSave, value]
  );
  const handleEdit = val => {
    setSelectedLookup(val);
    setShowListView(false);
  };

  const toggleLookupMode = () => {
    setError();
    setSelectedLookup({});
    setShowListView(!showListView);
  };

  return (
    <ModalDialog
      show
      actionLabel={showListView ? 'New lookup' : 'Back to lookup'}
      actionHandler={toggleLookupMode}
      minWidth="sm"
      maxWidth="lg">
      <span>Manage lookups</span>
      {showListView ? (
        <div>
          {value.map(r => (
            <LookupListRow
              value={r}
              key={r.name}
              disabled={disabled}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
          <Button data-test="closeLookupListing" onClick={onCancel}>
            Close
          </Button>
        </div>
      ) : (
        <ManageLookup
          value={selectedLookup}
          error={error}
          onCancel={toggleLookupMode}
          options={options}
          onSave={handleSubmit}
          disabled={disabled}
          resourceId={resourceId}
          resourceType={resourceType}
          flowId={flowId}
        />
      )}
    </ModalDialog>
  );
}
