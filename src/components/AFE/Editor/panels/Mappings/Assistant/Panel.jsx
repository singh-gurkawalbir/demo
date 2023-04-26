import React, { useMemo, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Typography } from '@mui/material';
import { Spinner } from '@celigo/fuse-ui';
import actions from '../../../../../../actions';
import {selectors} from '../../../../../../reducers';
import SalesforceMappingAssistant from '../../../../../SalesforceMappingAssistant';
import NetSuiteMappingAssistant from '../../../../../NetSuiteMappingAssistant';
import { message } from '../../../../../../utils/messageStore';

function PreviewPanel({importId, subRecordMappingId, disabled}) {
  const dispatch = useDispatch();
  const previewData = useSelector(state => selectors.mapping(state).preview?.data);
  const recordType = useSelector(state => selectors.mappingNSRecordType(state, importId, subRecordMappingId));
  const {adaptorType, _connectionId: connectionId, salesforce} = useSelector(state =>
    selectors.resource(state, 'imports', importId)
  );

  const salesforcelayoutId = useSelector(state => {
    if (adaptorType === 'SalesforceImport') {
      const salesforceMasterRecordTypeInfo = selectors.getSalesforceMasterRecordTypeInfo(state, importId);

      if (salesforceMasterRecordTypeInfo?.data) {
        const {recordTypeId, searchLayoutable} = salesforceMasterRecordTypeInfo.data;

        if (searchLayoutable) {
          return recordTypeId;
        }
      }
    }
  });
  const mappingPreviewType = useSelector(state =>
    selectors.mappingPreviewType(state, importId)
  );
  const salesforceNetsuitePreviewData = useMemo(() => {
    if (['salesforce', 'netsuite'].includes(mappingPreviewType)) {
      return Array.isArray(previewData)
        ? previewData[0]
        : previewData;
    }
  }, [mappingPreviewType, previewData]);

  const options = useMemo(() => {
    if (adaptorType === 'SalesforceImport') {
      const {sObjectType} = salesforce;

      return {
        sObjectType,
        sObjectLabel: sObjectType,
      };
    }
    if (['NetSuiteImport', 'NetSuiteDistributedImport'].includes(adaptorType)) {
      return {
        netSuiteRecordType: recordType,
      };
    }
  }, [adaptorType, salesforce, recordType]);
  const handleSFNSAssistantFieldClick = useCallback(
    meta => {
      if (disabled) {
        return;
      }
      let value;

      if (adaptorType === 'SalesforceImport') {
        value = meta.id;
      } else if (['NetSuiteImport', 'NetSuiteDistributedImport'].includes(adaptorType)) {
        value = meta.sublistName ? `${meta.sublistName}[*].${meta.id}` : meta.id;
      }
      if (value) {
        dispatch(
          actions.mapping.patchGenerateThroughAssistant(value)
        );
      }
    },
    [disabled, adaptorType, dispatch]
  );

  if (!mappingPreviewType) return null;

  return (
    <>
      {mappingPreviewType === 'salesforce' && (
        <SalesforceMappingAssistant
          connectionId={connectionId}
          layoutId={salesforcelayoutId}
          onFieldClick={handleSFNSAssistantFieldClick}
          data={salesforceNetsuitePreviewData}
          {...options}
             />
      )}
      {mappingPreviewType === 'netsuite' && (
        <NetSuiteMappingAssistant
          netSuiteConnectionId={connectionId}
          onFieldClick={handleSFNSAssistantFieldClick}
          data={salesforceNetsuitePreviewData}
          {...options}
             />
      )}
    </>
  );
}

export default function PreviewPanelWrapper({editorId}) {
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const {flowId,
    importId,
    subRecordMappingId} = useSelector(state => {
    const e = selectors.editor(state, editorId);

    return {
      flowId: e.flowId,
      importId: e.resourceId,
      subRecordMappingId: e.subRecordMappingId,
    };
  }, shallowEqual);
  const mappingStatus = useSelector(state => selectors.mapping(state, flowId, importId, subRecordMappingId).status);

  if (mappingStatus === 'error') {
    return (<Typography>{message.MAPPER2.FAILED_TO_LOAD_MAPPING}</Typography>);
  }
  if (mappingStatus !== 'received') {
    return (
      <Spinner center="screen" />
    );
  }

  return (
    <PreviewPanel
      importId={importId}
      disabled={disabled}
      subRecordMappingId={subRecordMappingId} />
  );
}
