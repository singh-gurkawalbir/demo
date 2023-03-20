import React, { useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch, Link } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { Typography } from '@mui/material';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import { selectors } from '../../../../reducers';
import SubRecordDrawer from './SubRecordDrawer';
import actions from '../../../../actions';
import EditIcon from '../../../icons/EditIcon';
import DeleteIcon from '../../../icons/TrashIcon';
import useConfirmDialog from '../../../ConfirmDialog';
import {
  getNetSuiteSubrecordLabel,
  getNetSuiteSubrecordImports,
} from '../../../../utils/resource';
import AddIcon from '../../../icons/AddIcon';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import ActionGroup from '../../../ActionGroup';
import { drawerPaths, buildDrawerUrl } from '../../../../utils/rightDrawer';
import ActionButton from '../../../ActionButton';

export const UseDynaNetsuiteSubRecordsStyles = makeStyles(theme => ({
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
}));

export default function DynaNetSuiteSubRecords(props) {
  const {
    resourceContext,
    connectionId,
    formKey,
    options = {},
    recordTypeFieldId = 'netsuite_da.recordType',
    onFieldChange,
    id,
    defaultValue,
    value,
    flowId,
  } = props;
  const classes = UseDynaNetsuiteSubRecordsStyles();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const { confirmDialog } = useConfirmDialog();
  const { resourceId } = resourceContext;
  const recordType = useSelector(state => {
    // We still support options incase IA uses this field and feeds recordType through options
    if (options?.recordType) return options.recordType;

    return selectors.formState(state, formKey)?.fields?.[recordTypeFieldId]?.value;
  });

  const {hasSubrecord, status} = useSelector(state => {
    const {data: recordTypes, status} = selectors.metadataOptionsAndResources(state, {
      connectionId,
      commMetaPath: `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes`,
      filterKey: 'suitescript-recordTypes',
    });
    let hasSubrecord;

    if (recordTypes) {
      const rec = recordTypes.find(record => record.value === recordType);

      hasSubrecord = rec && rec.hasSubRecord;
    }

    return {hasSubrecord, status};
  }, shallowEqual);
  const { merged: importDoc } = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'imports',
    resourceId
  );

  const { subrecords, subrecordsFromMappings, hasNetsuiteDa } = useMemo(() => {
    let subrecords;
    let subrecordsFromMappings = [];
    let hasNetsuiteDa = false;

    if (importDoc && importDoc.netsuite_da) {
      hasNetsuiteDa = true;
      ({ subrecords } = importDoc.netsuite_da);

      // only if the patched record type matches the one user has selected,
      // then get the subrecords from the importDoc
      if (!subrecords && importDoc.netsuite_da.mapping && recordType === importDoc.netsuite_da.recordType) {
        subrecordsFromMappings = getNetSuiteSubrecordImports(importDoc);
      }
    }

    return { hasNetsuiteDa, subrecords, subrecordsFromMappings };
  }, [importDoc, recordType]);

  useEffect(() => {
    if (!subrecords && subrecordsFromMappings) {
      const patchSet = [];

      if (!hasNetsuiteDa) {
        patchSet.push({
          op: 'add',
          path: '/netsuite_da',
          value: {},
        });
      }

      patchSet.push({
        op: 'add',
        path: '/netsuite_da/subrecords',
        value: subrecordsFromMappings,
      });

      dispatch(
        actions.resource.patchStaged(resourceId, patchSet)
      );
    }
  }, [dispatch, hasNetsuiteDa, resourceId, subrecords, subrecordsFromMappings]);

  useEffect(() => {
    if (status === 'received' && !hasSubrecord) {
      if (Array.isArray(value) && value.length) { onFieldChange(id, []); }

      return;
    }
    if (subrecords && JSON.stringify(subrecords) !== JSON.stringify(value)) {
      if (value === '') {
        // shallow update. Form not to be treated as touched
        onFieldChange(id, subrecords, true);
      } else onFieldChange(id, subrecords);
    }
  }, [defaultValue, hasSubrecord, id, onFieldChange, status, subrecords, value]);

  const handleDeleteClick = useCallback(
    fieldId => {
      confirmDialog({
        title: 'Confirm remove',
        message: 'Are you sure you want to remove this subrecord import?',
        buttons: [
          {
            label: 'Remove',
            onClick: () => {
              const updatedSubrecords = subrecords.filter(
                sr => sr.fieldId !== fieldId
              );

              dispatch(
                actions.resource.patchStaged(
                  resourceId,
                  [
                    {
                      op: 'replace',
                      path: '/netsuite_da/subrecords',
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
    [confirmDialog, dispatch, resourceId, subrecords]
  );

  if (!hasSubrecord) {
    return null;
  }

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
          <Link
            to={buildDrawerUrl({ path: drawerPaths.NS_SUB_RECORD.ADD, baseUrl: match.url })}
            className={classes.link}>
            <AddIcon />
            Add subrecord
          </Link>
        </div>

        {subrecords &&
          subrecords.map(sr => (
            <div key={sr.fieldId} className={classes.actionItems}>
              <Typography component="span">
                {getNetSuiteSubrecordLabel(sr.fieldId, sr.recordType)}
              </Typography>
              <ActionGroup>
                <ActionButton
                  tooltip="Edit subrecord"
                  data-test="edit-subrecord"
                  component={Link}
                  to={buildDrawerUrl({
                    path: drawerPaths.NS_SUB_RECORD.EDIT,
                    baseUrl: match.url,
                    params: { fieldId: sr.fieldId },
                  })}>
                  <EditIcon />
                </ActionButton>
                <ActionButton
                  tooltip="Delete subrecord"
                  data-test="delete-subrecord"
                  onClick={() => handleDeleteClick(sr.fieldId)}>
                  <DeleteIcon />
                </ActionButton>
              </ActionGroup>
            </div>
          ))}
      </div>
    </>
  );
}
