import React, { useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { selectors } from '../../../../reducers';
import SalesforceMappingAssistant from '../../SalesforceMappingAssistant';
import NetSuiteMappingAssistant from '../../NetSuiteMappingAssistant';
import actions from '../../../../actions';

const useStyles = makeStyles(theme => ({
  assistantContainer: {
    flex: '1 1 0',
    width: '0px',
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    position: 'relative',
  },
}));
export default function PreviewPanel({disabled}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    importType,
    connectionId,
    ssLinkedConnectionId,
    recordType,
    sObjectType,
    flowId,
    integrationId,
  } = useSelector(state => selectors.suiteScriptMapping(state), shallowEqual);

  const salesforceLayoutId = useSelector(state => {
    const salesforceMasterRecordTypeInfo = selectors.suiteScriptSalesforceMasterRecordTypeInfo(state, {integrationId,
      ssLinkedConnectionId,
      flowId,
    });

    return salesforceMasterRecordTypeInfo?.data?.recordTypeId;
  });
  const handleSFNSAssistantFieldClick = useCallback(
    meta => {
      if (disabled) {
        return;
      }
      let value;

      if (sObjectType) {
        value = meta.id;
      } else if (recordType) {
        value = meta.sublistName ? `${meta.sublistName}[*].${meta.id}` : meta.id;
      }
      if (value) {
        dispatch(
          actions.suiteScript.mapping.patchGenerateThroughAssistant(value)
        );
      }
    }, [disabled, dispatch, recordType, sObjectType]);

  if (disabled || !['netsuite', 'salesforce'].includes(importType)) return null;

  return (
    <>
      <div className={classes.assistantContainer}>
        {importType === 'salesforce' && (
        <SalesforceMappingAssistant
          ssLinkedConnectionId={ssLinkedConnectionId}
          connectionId={connectionId}
          sObjectType={sObjectType}
          sObjectLabel={sObjectType}
          layoutId={salesforceLayoutId}
          onFieldClick={handleSFNSAssistantFieldClick}
          data={{}}
             />
        )}
        {importType === 'netsuite' && (
        <NetSuiteMappingAssistant
          netSuiteConnectionId={ssLinkedConnectionId}
          netSuiteRecordType={recordType}
          onFieldClick={handleSFNSAssistantFieldClick}
          data={{}}
             />
        )}
      </div>
    </>
  );
}
