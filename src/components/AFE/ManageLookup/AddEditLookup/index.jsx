import React from 'react';
import shortid from 'shortid';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import DynaForm from '../../../DynaForm';
import DynaSubmit from '../../../DynaForm/DynaSubmit';
import lookupMetadata from './metadata';
import netsuiteMetadata from './DynamicLookup/netsuiteMetadata';
import salesforceMetadata from './DynamicLookup/salesforceMetadata';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';

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
  const {
    isSQLLookup,
    sampleData,
    connectionId,
    resourceId,
    resourceType,
    flowId,
    resourceName,
    importType,
    fieldMetadata,
    fieldId,
    recordType,
    extractFields,
  } = options;
  const isEdit = !!(lookup && lookup.name);
  const handleSubmit = formVal => {
    let lookupObj = {};
    const lookupTmp = {};

    if (importType === 'netsuite') {
      if (isEdit) {
        lookupTmp.name = lookup.name;
      } else {
        lookupTmp.name = shortid.generate();
      }

      if (formVal._mode === 'dynamic') {
        lookupTmp.extract = formVal._extract;
        lookupTmp.recordType = formVal.recordType;
        lookupTmp.resultField = formVal.resultField;
        lookupTmp.expression = formVal.lookupExpression;
      } else {
        lookupTmp.map = {};
        formVal._mapList.forEach(obj => {
          if (obj.import && obj.export) lookupTmp.map[obj.export] = obj.import;
        });
      }

      lookupObj = lookupTmp;
    } else if (importType === 'salesforce') {
      if (isEdit) {
        lookupTmp.name = lookup.name;
      } else {
        lookupTmp.name = shortid.generate();
      }

      if (formVal._mode === 'dynamic') {
        lookupTmp.whereClause = formVal.whereClause;
        lookupTmp.sObjectType = formVal.sObjectType;
        lookupTmp.resultField = formVal.resultField;
        lookupTmp.expression = formVal.lookupExpression;
      } else {
        lookupTmp.map = {};
        formVal._mapList.forEach(obj => {
          if (obj.import && obj.export) lookupTmp.map[obj.export] = obj.import;
        });
      }

      lookupObj = lookupTmp;
    } else {
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
    }

    onSave(isEdit, lookupObj);
  };

  let fieldMeta;

  if (importType === 'netsuite') {
    fieldMeta = netsuiteMetadata.getLookupMetadata({
      lookup,
      showDynamicLookupOnly,
      sampleData,
      connectionId,
      resourceId,
      resourceType,
      flowId,
      resourceName,
      fieldMetadata,
      fieldId,
      recordType,
      extractFields,
    });
  } else if (importType === 'salesforce') {
    fieldMeta = salesforceMetadata.getLookupMetadata({
      lookup,
      showDynamicLookupOnly,
      sampleData,
      connectionId,
      resourceId,
      resourceType,
      flowId,
      resourceName,
      fieldMetadata,
      fieldId,
      recordType,
      extractFields,
    });
  } else {
    fieldMeta = lookupMetadata.getLookupMetadata({
      lookup,
      showDynamicLookupOnly,
      isSQLLookup,
      sampleData,
      connectionId,
      resourceId,
      resourceType,
      flowId,
      resourceName,
    });
  }

  const formKey = useFormInitWithPermissions({
    disabled,
    fieldsMeta: fieldMeta,
    optionsHandler: fieldMeta.optionsHandler,
  });

  return (
    <div data-test="lookup-form">
      <DynaForm formKey={formKey} fieldMeta={fieldMeta} />
      {error && (
        <div>
          <Typography color="error" variant="h5">
            {error}
          </Typography>
        </div>
      )}
      <DynaSubmit
        formKey={formKey}
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
    </div>
  );
}
