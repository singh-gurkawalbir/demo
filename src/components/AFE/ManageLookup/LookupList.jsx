import React, { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import DynaForm from '../../DynaForm';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';

export default function LookupListing(props) {
  const { lookups, onUpdate, disabled, onDelete, onCancel } = props;
  const [key, setKey] = useState(1);
  const handleDelete = obj => {
    setKey(key + 1);
    onDelete(obj);
  };

  const handleEdit = lookupObj => {
    onUpdate(lookupObj);
  };

  const lookuplistingFieldMeta = {
    fieldMap: {
      lookup_list: {
        id: 'lookup_list',
        type: 'keywithaction',
        keyName: 'name',
        valueType: 'keywithaction',
        label: 'Lookups',
        value: lookups,
        onEditClick: handleEdit,
        onDeleteClick: handleDelete,
      },
    },
    layout: {
      fields: ['lookup_list'],
    },
  };
  const formKey = useFormInitWithPermissions({
    disabled,
    fieldsMeta: lookuplistingFieldMeta,
    remount: key,
  });

  return (
    <Fragment>
      <DynaForm formKey={formKey} fieldMeta={lookuplistingFieldMeta} />
      <Button data-test="closeLookupListing" onClick={onCancel}>
        Close
      </Button>
    </Fragment>
  );
}
