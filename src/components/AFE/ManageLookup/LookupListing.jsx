import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import DynaForm from '../../DynaForm';

function optionsHandler() {
  return ['something1', 'something2'];
}

export default function LookupListing(props) {
  const {
    lookups,
    editLookupHandler,
    deleteLookup,
    onClose,
    onCancelClick,
  } = props;
  const editLookup = lookupObj => {
    editLookupHandler(lookupObj);
  };

  const [key, setKey] = useState(1);
  const handleDeleteLookup = obj => {
    setKey(key + 1);
    deleteLookup(obj);
  };

  const lookuplistingFieldMeta = {
    fields: [
      {
        id: 'lookup_list',
        type: 'dynakeywithaction',
        keyName: 'name',
        // valueName: 'value',
        valueType: 'dynakeywithaction',
        label: 'Lookups',
        value: lookups,
        editHandler: editLookup,
        deleteHandler: handleDeleteLookup,
      },
    ],
  };

  return (
    <DynaForm
      key={key}
      fieldMeta={lookuplistingFieldMeta}
      optionsHandler={optionsHandler}>
      <Button onClick={onCancelClick}>Cancel</Button>
      <Button onClick={onClose}>Save</Button>
    </DynaForm>
  );
}
