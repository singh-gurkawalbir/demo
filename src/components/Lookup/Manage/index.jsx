import React, { useMemo, useState, useCallback } from 'react';
import shortid from 'shortid';
import { useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import { selectors } from '../../../reducers';
import DynaForm from '../../DynaForm';
import DynaSubmit from '../../DynaForm/DynaSubmit';
import defaultMetadata from './metadata/default';
import getFormattedSampleData from '../../../utils/sampleData';
import netsuiteMetadata from './metadata/netsuite';
import salesforceMetadata from './metadata/salesforce';
import rdbmsMetadata from './metadata/rdbms';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';

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

  // to be removed after form refactor PR merges
  const [formState, setFormState] = useState({
    showFormValidationsBeforeTouch: false,
  });
  const { merged: resource = {} } = useSelectorMemo(
    selectors.makeResourceDataSelector,
    resourceType,
    resourceId
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
  const handleSubmit = useCallback(formVal => {
    let lookupObj = {};
    const lookupTmp = {};

    if (isEdit) {
      lookupTmp.name = value.name;
    } else {
      lookupTmp.name = shortid.generate();
    }

    if (['NetSuiteImport', 'NetSuiteDistributedImport'].includes(resource.adaptorType)) {
      if (formVal._mode === 'dynamic') {
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
    }
    lookupObj.name = formVal._name;
    onSave(isEdit, lookupObj);
  }, [isEdit, onSave, resource.adaptorType, value.name]);

  const fieldMeta = useMemo(() => {
    if (['NetSuiteDistributedImport', 'NetSuiteImport'].includes(resource.adaptorType)) {
      const { extractFields, staticLookupCommMetaPath } = others;

      return netsuiteMetadata.getLookupMetadata({
        lookup: value,
        connectionId,
        staticLookupCommMetaPath,
        extractFields,
      });
    } if (resource.adaptorType === 'SalesforceImport') {
      return salesforceMetadata.getLookupMetadata({
        lookup: value,
        connectionId,
        extractFields,
        picklistOptions,
      });
    } if (resource.adaptorType === 'RDBMSImport') {
      return rdbmsMetadata.getLookupMetadata({
        lookup: value,
        showDynamicLookupOnly,
        sampleData: formattedSampleData,
        connectionId,
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
  }, [connectionId, extractFields, flowId, formattedSampleData, others, picklistOptions, resource.adaptorType, resourceId, resourceType, showDynamicLookupOnly, value]);

  const formKey = useFormInitWithPermissions({
    disabled,
    fieldMeta,
    optionsHandler: fieldMeta.optionsHandler,
    ...formState,
  });
  const showCustomFormValidations = useCallback(() => {
    setFormState({
      showFormValidationsBeforeTouch: true,
    });
  }, []);

  return (
    <div data-test="lookup-form">
      <DynaForm
        formKey={formKey}
        fieldMeta={fieldMeta}
        >
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
          showCustomFormValidations={showCustomFormValidations}
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
