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
export default function PreviewPanel(props) {
  const {resourceId, subRecordMappingId, disabled} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const previewData = useSelector(state => {
    const {preview} = selectors.mapping(state);

    return preview && preview.data;
  });
  const recordType = useSelector(state => selectors.mappingNSRecordType(state, resourceId, subRecordMappingId));
  const importRes = useSelector(state =>
    selectors.resource(state, 'imports', resourceId)
  );
  const {_connectionId: connectionId} = importRes;

  const salesforcelayoutId = useSelector(state => {
    if (importRes.adaptorType === 'SalesforceImport') {
      const salesforceMasterRecordTypeInfo = selectors.getSalesforceMasterRecordTypeInfo(state, resourceId);

      if (salesforceMasterRecordTypeInfo?.data) {
        const {recordTypeId, searchLayoutable} = salesforceMasterRecordTypeInfo.data;

        if (searchLayoutable) {
          return recordTypeId;
        }
      }
    }
  });
  const mappingPreviewType = useSelector(state =>
    selectors.mappingPreviewType(state, resourceId)
  );
  const httpAssistantPreviewObj = useSelector(state =>
    selectors.mappingHttpAssistantPreviewData(state, resourceId)
  );
  const {lastModifiedRowKey } = useSelector(state => selectors.mapping(state));
  const salesforceNetsuitePreviewData = useMemo(() => {
    if (mappingPreviewType === 'salesforce') {
      if (previewData && Array.isArray(previewData) && previewData.length) {
        const [_val] = previewData;

        return _val;
      }

      return previewData;
    }
  }, [mappingPreviewType, previewData]);

  const options = useMemo(() => {
    if (importRes.adaptorType === 'SalesforceImport') {
      const {salesforce} = importRes;
      const {sObjectType} = salesforce;

      return {
        sObjectType,
        sObjectLabel: sObjectType,
      };
    }
    if (['NetSuiteImport', 'NetSuiteDistributedImport'].includes(importRes.adaptorType)) {
      return {
        netSuiteRecordType: recordType,
      };
    }
  }, [importRes]);
  const handleSFNSAssistantFieldClick = useCallback(
    meta => {
      if (disabled) {
        return;
      }
      let value;

      if (importRes.adaptorType === 'SalesforceImport') {
        value = meta.id;
      } else if (['NetSuiteImport', 'NetSuiteDistributedImport'].includes(importRes.adaptorType)) {
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
    [disabled, importRes.adaptorType, lastModifiedRowKey, dispatch]
  );

  return (
    <>
      {mappingPreviewType && (
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
      )}
    </>
  );
}
