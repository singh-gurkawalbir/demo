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
    value = {},
    onCancel,
    error,
    disabled = false,
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
  const { _connectionId: connectionId } = resource;
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
  const isEdit = !!value.name;
  const handleSubmit = formVal => {
    let lookupObj = {};
    const lookupTmp = {};

    if (isEdit) {
      lookupTmp.name = value.name;
    } else {
      lookupTmp.name = shortid.generate();
    }

    if (resource.adaptorType === 'NetSuiteImport') {
      if (formVal._mode === 'dynamic') {
        lookupTmp.extract = formVal._extract;
        lookupTmp.recordType = formVal._recordType;
        lookupTmp.resultField = formVal._resultField;
        lookupTmp.expression = formVal._expression;
      } else {
        lookupTmp.map = {};
        formVal._mapList.forEach(obj => {
          if (obj.import && obj.export) lookupTmp.map[obj.export] = obj.import;
        });
      }

      lookupObj = lookupTmp;
    } else if (resource.adaptorType === 'SalesforceImport') {
      if (formVal._mode === 'dynamic') {
        lookupTmp.whereClause = formVal._whereClause;
        lookupTmp.sObjectType = formVal._sObjectType;
        lookupTmp.resultField = formVal._resultField;
        lookupTmp.expression = formVal._expression;
      } else {
        lookupTmp.map = {};
        formVal._mapList.forEach(obj => {
          if (obj.import && obj.export) lookupTmp.map[obj.export] = obj.import;
        });
      }

      lookupObj = lookupTmp;
    } else {
      if (formVal._mode === 'static') {
        lookupObj.map = {};
        formVal._mapList.forEach(obj => {
          lookupObj.map[obj.export] = obj.import;
        });
      } else {
        lookupObj.query = formVal._query;
        lookupObj.method = formVal._method;
        lookupObj.relativeURI = formVal._relativeURI;
        lookupObj.body = formVal._body;
        lookupObj.extract = formVal._extract;
      }

      switch (formVal._failRecord) {
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
          lookupObj.default = formVal._default;
          break;
        default:
      }

      lookupObj.name = formVal._name;
    }

    onSave(isEdit, lookupObj);
  };

  let fieldMeta;
  const { recordType, fieldMetadata } = options;

  if (resource.adaptorType === 'NetSuiteImport') {
    fieldMeta = netsuiteMetadata.getLookupMetadata({
      lookup: value,
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
      lookup: value,
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
      lookup: value,
      showDynamicLookupOnly,
      sampleData: formattedSampleData,
      connectionId,
    });
  } else {
    fieldMeta = defaultMetadata.getLookupMetadata({
      lookup: value,
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
