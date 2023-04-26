import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch, Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import { selectors } from '../../../../../reducers';
import SubRecordDrawer from './SubRecordDrawer';
import actions from '../../../../../actions';
import EditIcon from '../../../../icons/EditIcon';
import DeleteIcon from '../../../../icons/TrashIcon';
import ActionButton from '../../../../ActionButton';
import useConfirmDialog from '../../../../ConfirmDialog';
import { getNetSuiteSubrecordLabel } from './SubRecordDrawer/util';
import AddIcon from '../../../../icons/AddIcon';
import { UseDynaNetsuiteSubRecordsStyles } from '../../DynaNetSuiteSubRecords';
import ActionGroup from '../../../../ActionGroup';

export default function DynaNetSuiteSubRecords(props) {
  const {
    resourceContext,
    connectionId,
    options = {},
    onFieldChange,
    id,
    defaultValue,
    value,
    flowId,
  } = props;
  const classes = UseDynaNetsuiteSubRecordsStyles();
  const { resourceId } = resourceContext;
  const { recordType } = options;
  const dispatch = useDispatch();
  const referenceFields = useSelector(state =>
    selectors
      .metadataOptionsAndResources(state, {
        connectionId,
        commMetaPath: `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/${recordType}`,
        filterKey: 'suitescript-subrecord-referenceFields',
      }).data
  );

  useEffect(() => {
    if (!referenceFields || referenceFields.length === 0) {
      dispatch(actions.metadata.request(connectionId, `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/${recordType}`));
    }
  }, [connectionId, dispatch, recordType, referenceFields]);
  const { merged: flow } = useSelector(state =>
    selectors.suiteScriptResourceData(state,
      {
        resourceType: 'flows',
        id: resourceId,
        ssLinkedConnectionId: connectionId,
      }
    )
  );
  const subRecordImports = flow?.import?.netsuite?.subRecordImports;

  const { confirmDialog } = useConfirmDialog();

  useEffect(() => {
    if (subRecordImports && JSON.stringify(subRecordImports) !== JSON.stringify(value)) {
      if (value === '') {
        // shallow update. Form not to be treated as touched
        onFieldChange(id, subRecordImports, true);
      } else onFieldChange(id, subRecordImports);
    }
  }, [defaultValue, id, onFieldChange, subRecordImports, value]);
  const match = useRouteMatch();
  const handleDeleteClick = useCallback(
    fieldId => {
      confirmDialog({
        title: 'Confirm remove',
        message: 'Are you sure you want to remove this subrecord import?',
        buttons: [
          {
            label: 'Remove',
            onClick: () => {
              const updatedSubrecords = subRecordImports.filter(
                sr => sr.referenceFieldId !== fieldId
              );

              dispatch(
                actions.suiteScript.resource.patchStaged(
                  connectionId,
                  'flows',
                  resourceId,
                  [
                    {
                      op: 'replace',
                      path: '/import/netsuite/subRecordImports',
                      value: updatedSubrecords,
                    },
                  ],
                )
              );
            },
          },
          {
            label: 'Cancel',
            variant: 'text',
          },
        ],
      });
    },
    [confirmDialog, connectionId, dispatch, resourceId, subRecordImports]
  );

  return (
    <>
      <SubRecordDrawer
        resourceContext={resourceContext}
        flowId={flowId}
        importId={resourceId}
        connectionId={connectionId}
        recordType={recordType}
      />
      <div className={classes.subrecords}>
        <div className={classes.header}>
          <Typography variant="body2">Subrecord imports</Typography>
          <Link to={`${match.url}/subrecords`} className={classes.link}>
            <AddIcon />
            Add subrecord
          </Link>
        </div>

        {subRecordImports && subRecordImports.map(sr => (
          <div key={sr.referenceFieldId} className={classes.actionItems}>
            <Typography component="span">
              {getNetSuiteSubrecordLabel(sr.referenceFieldId, referenceFields ?? [])}
            </Typography>
            <ActionGroup>
              <ActionButton
                fontSize="small"
                data-test="edit-subrecord"
                component={Link}
                to={`${match.url}/subrecords/${sr.referenceFieldId}`}>
                <EditIcon />
              </ActionButton>
              <ActionButton
                fontSize="small"
                data-test="delete-subrecord"
                onClick={() => handleDeleteClick(sr.referenceFieldId)}>
                <DeleteIcon />
              </ActionButton>
            </ActionGroup>
          </div>
        ))}
      </div>
    </>
  );
}
