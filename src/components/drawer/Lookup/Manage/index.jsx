import React, { useMemo } from 'react';
import Typography from '@mui/material/Typography';
import { selectors } from '../../../../reducers';
import DynaForm from '../../../DynaForm';
import defaultMetadata from '../../../Lookup/Manage/metadata/default';
import netsuiteMetadata from '../../../Lookup/Manage/metadata/netsuite';
import salesforceMetadata from '../../../Lookup/Manage/metadata/salesforce';
import rdbmsMetadata from '../../../Lookup/Manage/metadata/rdbms';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import EditorDrawer from '../../../AFE/Drawer';
import { emptyObject } from '../../../../constants';

export default function ManageLookup({
  onSave,
  formKey,
  value = {},
  onCancel,
  error,
  disabled = false,
  resourceId,
  resourceType,
  flowId,
  className,
  showDynamicLookupOnly = false,
  remountCount = 0,
  ...others
}) {
  const { extractFields, picklistOptions } = others;

  const resource = useSelectorMemo(
    selectors.makeResourceDataSelector,
    resourceType,
    resourceId
  )?.merged || emptyObject;

  const { _connectionId: connectionId } = resource;

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

  useFormInitWithPermissions({
    formKey,
    disabled,
    fieldMeta,
    optionsHandler: fieldMeta.optionsHandler,
    remount: remountCount,
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
      <EditorDrawer />
    </div>
  );
}
