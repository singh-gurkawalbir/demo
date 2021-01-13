import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { selectors } from '../../../../reducers';
import DynaForm from '../../../DynaForm';
import defaultMetadata from '../../../Lookup/Manage/metadata/default';
import getFormattedSampleData from '../../../../utils/sampleData';
import netsuiteMetadata from '../../../Lookup/Manage/metadata/netsuite';
import salesforceMetadata from '../../../Lookup/Manage/metadata/salesforce';
import rdbmsMetadata from '../../../Lookup/Manage/metadata/rdbms';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import EditorDrawer from '../../../AFE2/Drawer';

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
  ...others
}) {
  const { extractFields, picklistOptions } = others;

  const { merged: resource = {} } = useSelectorMemo(
    selectors.makeResourceDataSelector,
    resourceType,
    resourceId
  );

  const { _connectionId: connectionId } = resource;
  const sampleData = useSelector(state =>
    selectors.getSampleDataContext(state, {
      flowId,
      resourceId,
      resourceType,
      stage: 'flowInput',
    }).data
  );
  // TODO: @aditya, check if we can get rid of getFormattedSampleData and use wrapSampleDataWithContext instead
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

  useFormInitWithPermissions({
    formKey,
    disabled,
    fieldMeta,
    optionsHandler: fieldMeta.optionsHandler,
  });

  return (
    <div data-test="lookup-form">
      <DynaForm
        formKey={formKey}
        fieldMeta={fieldMeta}
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
