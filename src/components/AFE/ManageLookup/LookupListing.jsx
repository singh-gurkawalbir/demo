import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import DynaForm from '../../DynaForm';

function optionsHandler() {
  return ['something1', 'something2'];
}

export default function LookupListing(props) {
  const { lookups, updateLookup, deleteLookup, onCancelClick } = props;
  const [key, setKey] = useState(1);
  const deleteLookupHandler = obj => {
    setKey(key + 1);
    deleteLookup(obj);
  };

  const editLookup = lookupObj => {
    updateLookup(lookupObj);
  };

  const lookuplistingFieldMeta = {
    fields: [
      {
        id: 'lookup_list',
        type: 'keywithaction',
        keyName: 'name',
        valueType: 'keywithaction',
        label: 'Lookups',
        value: lookups,
        editHandler: editLookup,
        deleteHandler: deleteLookupHandler,
      },
    ],
  };

  return (
    <DynaForm
      key={key}
      fieldMeta={lookuplistingFieldMeta}
      optionsHandler={optionsHandler}>
      <Button onClick={onCancelClick}>Close</Button>
    </DynaForm>
  );
}
