import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import DynaForm from '../../../DynaForm';
import DynaSubmit from '../../../DynaForm/DynaSubmit';
import lookupMetadata from './metadata';

export default function AddEditLookup(props) {
  const {
    onSave,
    lookup = {},
    onCancel,
    error,
    disabled,
    options = {},
    showDynamicLookupOnly = false,
  } = props;
  const isEdit = !!(lookup && lookup.name);
  const handleSubmit = formVal => {
    const lookupObj = {};

    if (formVal.mode === 'static') {
      lookupObj.map = {};
      formVal.mapList.forEach(obj => {
        lookupObj.map[obj.export] = obj.import;
      });
    } else {
      lookupObj.query = formVal.query;
      lookupObj.method = formVal.method;
      lookupObj.relativeURI = formVal.relativeURI;
      lookupObj.body = formVal.body;
      lookupObj.extract = formVal.extract;
    }

    switch (formVal.failRecord) {
      case 'disallowFailure':
        lookupObj.allowFailures = false;
        delete lookupObj.default;
        break;
      case 'useEmptyString':
        lookupObj.allowFailures = true;
        lookupObj.default = '';
        break;
      case 'useNull':
        lookupObj.allowFailures = true;
        lookupObj.default = null;
        break;
      case 'default':
        lookupObj.allowFailures = true;
        lookupObj.default = formVal.default;
        break;
      default:
    }

    lookupObj.name = formVal.name;
    onSave(isEdit, lookupObj);
  };

  const { isSQLLookup, sampleData } = options;
  const fieldMeta = lookupMetadata.getLookupMetadata({
    lookup,
    showDynamicLookupOnly,
    isSQLLookup,
    sampleData,
  });

  return (
    <div>
      <DynaForm disabled={disabled} fieldMeta={fieldMeta}>
        {error && (
          <div>
            <Typography color="error" variant="h5">
              {error}
            </Typography>
          </div>
        )}
        <DynaSubmit
          disabled={disabled}
          data-test="saveLookupForm"
          onClick={handleSubmit}>
          Save
        </DynaSubmit>
        <Button
          data-test="cancelLookupForm"
          onClick={onCancel}
          variant="text"
          color="primary">
          Cancel
        </Button>
      </DynaForm>
    </div>
  );
}
