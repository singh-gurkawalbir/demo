import React, { useMemo } from 'react';
import shortid from 'shortid';
import { useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import * as selectors from '../../../reducers';
import DynaForm from '../../DynaForm';
import DynaSubmit from '../../DynaForm/DynaSubmit';
import defaultMetadata from './metadata/default';
import getFormattedSampleData from '../../../utils/sampleData';
import netsuiteMetadata from './metadata/netsuite';
import salesforceMetadata from './metadata/salesforce';
import rdbmsMetadata from './metadata/rdbms';

export default function ManageLookup(props) {
  const {
    onSave,
    lookup = {},
    onCancel,
    error,
    disabled,
    connectionId,
    resourceId,
    resourceType,
    flowId,
    fieldId,
    showDynamicLookupOnly = false,
    options = {},
  } = props;
  const { merged: resource = {} } = useSelector(state =>
    selectors.resourceData(state, resourceType, resourceId)
  );
  const sampleData = useSelector(state =>
    selectors.getSampleData(state, {
      flowId,
      resourceId,
      resourceType,
      stage: 'flowInput',
    })
  );
  const formattedSampleData = useMemo(
    () =>
      JSON.stringify(
        getFormattedSampleData({
          sampleData,
          resourceType,
        }),
        null,
        2
      ),
    [resourceType, sampleData]
  );
  const isEdit = !!lookup.name;
  const handleSubmit = formVal => {
    let lookupObj = {};
    const lookupTmp = {};

    if (resource.adaptorType === 'NetSuiteImport') {
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
    } else if (resource.adaptorType === 'SalesforceImport') {
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
  const { recordType, fieldMetadata } = options;

  if (resource.adaptorType === 'NetSuiteImport') {
    fieldMeta = netsuiteMetadata.getLookupMetadata({
      lookup,
      connectionId,
      resourceId,
      resourceType,
      flowId,
      fieldMetadata,
      fieldId,
      recordType,
    });
  } else if (resource.adaptorType === 'SalesforceImport') {
    fieldMeta = salesforceMetadata.getLookupMetadata({
      lookup,
      showDynamicLookupOnly,
      connectionId,
      resourceId,
      resourceType,
      flowId,
      fieldMetadata,
      fieldId,
      recordType,
    });
  } else if (resource.adaptorType === 'RDBMSImport') {
    fieldMeta = rdbmsMetadata.getLookupMetadata({
      lookup,
      showDynamicLookupOnly,
      sampleData: formattedSampleData,
      connectionId,
    });
  } else {
    fieldMeta = defaultMetadata.getLookupMetadata({
      lookup,
      showDynamicLookupOnly,
      connectionId,
      resourceId,
      resourceType,
      flowId,
    });
  }

  return (
    <div data-test="lookup-form">
      <DynaForm
        disabled={disabled}
        fieldMeta={fieldMeta}
        optionsHandler={fieldMeta.optionsHandler}>
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
