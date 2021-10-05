import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { selectors } from '../../../../../reducers';
import SubRecordDrawer from './SubRecordDrawer';
import actions from '../../../../../actions';
import { SCOPES } from '../../../../../sagas/resourceForm';
import EditIcon from '../../../../icons/EditIcon';
import DeleteIcon from '../../../../icons/TrashIcon';
import ActionButton from '../../../../ActionButton';
import useConfirmDialog from '../../../../ConfirmDialog';
import { getNetSuiteSubrecordLabel } from './SubRecordDrawer/util';
import AddIcon from '../../../../icons/AddIcon';

const useStyles = makeStyles(theme => ({
  subrecords: {
    padding: theme.spacing(2),
    background: theme.palette.background.default,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    position: 'relative',
    marginLeft: 12,
    marginRight: theme.spacing(4),
    '&:before': {
      position: 'absolute',
      content: '""',
      left: theme.spacing(-1),
      top: 0,
      width: 1,
      height: '100%',
      background: theme.palette.secondary.lightest,
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  link: {
    display: 'flex',
    color: theme.palette.secondary.light,
    alignItems: 'center',
    marginTop: -5,
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  actionItems: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  actionBtns: {
    display: 'flex',
  },
}));

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
  const classes = useStyles();
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
                  SCOPES.VALUE
                )
              );
            },
          },
          {
            label: 'Cancel',
            color: 'secondary',
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
            <div className={classes.actionBtns}>
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
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
