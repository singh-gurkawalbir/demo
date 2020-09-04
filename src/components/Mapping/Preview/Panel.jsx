import React, { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import actions from '../../../actions';
import {selectors} from '../../../reducers';
import SalesforceMappingAssistant from '../../SalesforceMappingAssistant';
import NetSuiteMappingAssistant from '../../NetSuiteMappingAssistant';
import HttpMappingAssistant from './HttpMappingAssistant';

const useStyles = makeStyles(theme => ({
  assistantContainer: {
    flex: '1 1 0',
    width: '0px',
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    position: 'relative',
  },
}));
export default function PreviewPanel({importId, subRecordMappingId, disabled}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const previewData = useSelector(state => selectors.mapping(state).preview?.data);
  const recordType = useSelector(state => selectors.mappingNSRecordType(state, importId, subRecordMappingId));
  const importResource = useSelector(state =>
    selectors.resource(state, 'imports', importId)
  );
  const {_connectionId: connectionId} = importResource;

  const salesforcelayoutId = useSelector(state => {
    if (importResource.adaptorType === 'SalesforceImport') {
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
  const httpAssistantPreviewObj = useSelector(state =>
    selectors.mappingHttpAssistantPreviewData(state, importId)
  );
  const lastModifiedRowKey = useSelector(state => selectors.mapping(state).lastModifiedRowKey);
  const salesforceNetsuitePreviewData = useMemo(() => {
    if (mappingPreviewType === 'salesforce') {
      return Array.isArray(previewData)
        ? previewData[0]
        : previewData;
    }
  }, [mappingPreviewType, previewData]);

  const options = useMemo(() => {
    if (importResource.adaptorType === 'SalesforceImport') {
      const {sObjectType} = importResource.salesforce;

      return {
        sObjectType,
        sObjectLabel: sObjectType,
      };
    }
    if (['NetSuiteImport', 'NetSuiteDistributedImport'].includes(importResource.adaptorType)) {
      return {
        netSuiteRecordType: recordType,
      };
    }
  }, [importResource.adaptorType, importResource.salesforce, recordType]);
  const handleSFNSAssistantFieldClick = useCallback(
    meta => {
      if (disabled) {
        return;
      }
      let value;

      if (importResource.adaptorType === 'SalesforceImport') {
        value = meta.id;
      } else if (['NetSuiteImport', 'NetSuiteDistributedImport'].includes(importResource.adaptorType)) {
        value = meta.sublistName ? `${meta.sublistName}[*].${meta.id}` : meta.id;
      }
      if (lastModifiedRowKey && value) {
        dispatch(
          actions.mapping.patchField(
            'generate',
            lastModifiedRowKey === 'new' ? undefined : lastModifiedRowKey,
            value
          )
        );
      }
    },
    [disabled, importResource.adaptorType, lastModifiedRowKey, dispatch]
  );

  if (!mappingPreviewType) return null;

  return (
    <>
      <div className={classes.assistantContainer}>
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
        {mappingPreviewType === 'http' && (
        <HttpMappingAssistant
          editorId="httpPreview"
          rule={httpAssistantPreviewObj.rule}
          data={httpAssistantPreviewObj.data}
             />
        )}
      </div>
    </>
  );
}
