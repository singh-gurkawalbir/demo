// TODO: this file is only used for HTTP assistant for now and would be removed later as part of https://celigo.atlassian.net/browse/IO-25213

import React, { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import actions from '../../../actions';
import {selectors} from '../../../reducers';
import SalesforceMappingAssistant from '../../SalesforceMappingAssistant';
import NetSuiteMappingAssistant from '../../NetSuiteMappingAssistant';
import HttpMappingAssistant from './HttpMappingAssistant_afe';

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
          importId={importId}
             />
        )}
      </div>
    </>
  );
}
