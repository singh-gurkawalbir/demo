import React, { useMemo, useCallback } from 'react';
// import shortid from 'shortid';
import Typography from '@mui/material/Typography';
import { TextButton } from '@celigo/fuse-ui';
import { selectors } from '../../../reducers';
import DynaForm from '../../DynaForm';
import DynaSubmit from '../../DynaForm/DynaSubmit';
import defaultMetadata from './metadata/default';
import netsuiteMetadata from './metadata/netsuite';
import salesforceMetadata from './metadata/salesforce';
import rdbmsMetadata from './metadata/rdbms';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { emptyObject } from '../../../constants';

export default function ManageLookup({
  onSave,
  value = {},
  onCancel,
  error,
  disabled = false,
  resourceId,
  resourceType,
  flowId,
  className,
  showDynamicLookupOnly = false,
  ...others
}) {
  const { extractFields, picklistOptions } = others;

  const resource = useSelectorMemo(
    selectors.makeResourceDataSelector,
    resourceType,
    resourceId
  )?.merged || emptyObject;

  const { _connectionId: connectionId } = resource;
  const isEdit = !!value.name;
  const handleSubmit = useCallback(formVal => {
    let lookupObj = {};
    const lookupTmp = {};

    if (formVal._mode === 'static') {
      lookupObj.map = {};
      (formVal._mapList || []).forEach(obj => {
        if (obj.import && obj.export) lookupObj.map[obj.export] = obj.import;
      });
    }

    if (['NetSuiteImport', 'NetSuiteDistributedImport'].includes(resource.adaptorType)) {
      if (formVal._mode === 'dynamic') {
        lookupTmp.recordType = formVal._recordType;
        lookupTmp.resultField = formVal._resultField;
        lookupTmp.expression = formVal._expression;
        lookupObj = lookupTmp;
      }
    } else if (resource.adaptorType === 'SalesforceImport') {
      if (formVal._mode === 'dynamic') {
        lookupTmp.whereClause = formVal._whereClause;
        lookupTmp.sObjectType = formVal._sObjectType;
        lookupTmp.resultField = formVal._resultField;
        lookupTmp.expression = formVal._expression;
        lookupObj = lookupTmp;
      }
    } else {
      if (formVal._mode !== 'static') {
        lookupObj.query = formVal._query;
        lookupObj.method = formVal._method;
        lookupObj.relativeURI = formVal._relativeURI;
        lookupObj.body = formVal._body;
        lookupObj.postBody = formVal._body;
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
    }
    lookupObj.name = formVal._name;
    onSave(isEdit, lookupObj);
  }, [isEdit, onSave, resource.adaptorType]);

  const fieldMeta = useMemo(() => {
    if (['NetSuiteDistributedImport', 'NetSuiteImport'].includes(resource.adaptorType)) {
      const { extractFields, staticLookupCommMetaPath } = others;

      return netsuiteMetadata.getLookupMetadata({
        lookup: value,
        connectionId,
        staticLookupCommMetaPath,
        extractFields,
        resourceId,
        resourceType,
        flowId,
      });
    } if (resource.adaptorType === 'SalesforceImport') {
      return salesforceMetadata.getLookupMetadata({
        lookup: value,
        connectionId,
        extractFields,
        picklistOptions,
        resourceId,
        resourceType,
        flowId,
      });
    } if (resource.adaptorType === 'RDBMSImport') {
      return rdbmsMetadata.getLookupMetadata({
        lookup: value,
        showDynamicLookupOnly,
        connectionId,
        resourceId,
        resourceType,
        flowId,
      });
    }

    return defaultMetadata.getLookupMetadata({
      lookup: value,
      showDynamicLookupOnly,
      connectionId,
      resourceId,
      resourceType,
      flowId,
    });
  }, [connectionId, extractFields, flowId, others, picklistOptions, resource.adaptorType, resourceId, resourceType, showDynamicLookupOnly, value]);

  const formKey = useFormInitWithPermissions({
    disabled,
    fieldMeta,
    optionsHandler: fieldMeta.optionsHandler,
  });

  return (
    <div data-test="lookup-form">
      <DynaForm
        formKey={formKey}
        />
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
        variant="contained"
        color="primary"
        onClick={handleSubmit}>
        Save
      </DynaSubmit>
      <TextButton
        data-test="cancelLookupForm"
        onClick={onCancel}>
        Cancel
      </TextButton>
    </div>
  );
}
