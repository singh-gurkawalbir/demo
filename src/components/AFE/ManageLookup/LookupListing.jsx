import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import DynaForm from '../../DynaForm';

export default function LookupListing(props) {
  const { lookups, onUpdate, onDelete, onCancel } = props;
  const [key, setKey] = useState(1);
  const handleDelete = obj => {
    setKey(key + 1);
    onDelete(obj);
  };

  const handleEdit = lookupObj => {
    onUpdate(lookupObj);
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
        onEditClick: handleEdit,
        onDeleteClick: handleDelete,
      },
    ],
  };

  return (
    <DynaForm key={key} fieldMeta={lookuplistingFieldMeta}>
      <Button onClick={onCancel}>Close</Button>
    </DynaForm>
  );
}
