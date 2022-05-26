import React, { useCallback } from 'react';
// import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { IconButton } from '@material-ui/core';
import Help from '../../../../Help';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
// import ActionGroup from '../../../../ActionGroup';
import RefreshIcon from '../../../../icons/RefreshIcon';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  helpButton: {
    padding: 0,
    margin: 2,
  },
  refreshicon: {
    position: 'absolute',
    right: '30px',
    justifyContent: 'flex-end',
  },
});

export default function MappingAssistantTitle({editorId}) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const {mappingPreviewType, resourceId} = useSelector(state => {
    const e = selectors.editor(state, editorId);

    return {
      mappingPreviewType: e.mappingPreviewType,
      resourceId: e.resourceId,
    };
  }, shallowEqual);

  const helpKey = `${mappingPreviewType === 'netsuite' ? 'afe.mappings.netsuite.assistant' : 'afe.mappings.salesforce.assistant'}`;
  const title = `${mappingPreviewType === 'netsuite' ? 'NetSuite' : 'Salesforce'} mapping assistant`;

  const {adaptorType, _connectionId: connectionId, salesforce} = useSelector(state =>
    selectors.resource(state, 'imports', resourceId)
  ) || {};

  const {sObjectType} = salesforce || {};

  const salesforcelayoutId = useSelector(state => {
    if (adaptorType === 'SalesforceImport') {
      const salesforceMasterRecordTypeInfo = selectors.getSalesforceMasterRecordTypeInfo(state, resourceId);

      if (salesforceMasterRecordTypeInfo?.data) {
        const {recordTypeId, searchLayoutable} = salesforceMasterRecordTypeInfo.data;

        if (searchLayoutable) {
          return recordTypeId;
        }
      }
    }
  });

  const commMetaPath = `salesforce/metadata/connections/${connectionId}/sObjectTypes/${sObjectType}/layouts?recordTypeId=${salesforcelayoutId}`;

  const showRefreshIconForSalesforce = mappingPreviewType === 'salesforce' && connectionId && sObjectType && salesforcelayoutId;
  const handleRefreshClick = useCallback(() => {
    if (showRefreshIconForSalesforce) {
      dispatch(
        actions.metadata.request(
          connectionId,
          commMetaPath,
          {refreshCache: true}
        )
      );
    }
  }, [commMetaPath, connectionId, dispatch, showRefreshIconForSalesforce]);

  return (
    <div className={classes.wrapper}>
      {title}
      {helpKey && (
        <Help
          title={title}
          className={classes.helpButton}
          helpKey={helpKey}
        />
      )}
      {showRefreshIconForSalesforce && (
        <IconButton
          variant="contained"
          color="secondary"
          className={classes.refreshicon}
          onClick={handleRefreshClick}>
          <RefreshIcon />
        </IconButton>
      )}
    </div>
  );
}
