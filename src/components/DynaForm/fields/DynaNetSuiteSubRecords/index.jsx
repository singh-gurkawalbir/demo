import { Fragment, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import * as selectors from '../../../../reducers';
import SubRecordDrawer from './SubRecordDrawer';
import actions from '../../../../actions';
import { SCOPES } from '../../../../sagas/resourceForm';
import EditIcon from '../../../icons/EditIcon';
import DeleteIcon from '../../../icons/TrashIcon';
import ActionButton from '../../../../components/ActionButton';
import useConfirmDialog from '../../../../components/ConfirmDialog';
import {
  getNetSuiteSubrecordLabel,
  getNetSuiteSubrecordImports,
} from '../../../../utils/resource';
import AddIcon from '../../../../components/icons/AddIcon';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';

const useStyles = makeStyles(theme => ({
  subrecords: {
    padding: theme.spacing(2),
    background: theme.palette.background.default,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    position: 'relative',
    marginLeft: 12,
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
  const hasSubrecord = useSelector(state => {
    const recordTypes = selectors.metadataOptionsAndResources({
      state,
      connectionId,
      commMetaPath: `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes`,
      filterKey: 'suitescript-recordTypes',
    }).data;

    if (recordTypes) {
      const rec = recordTypes.find(record => record.value === recordType);

      return rec && rec.hasSubRecord;
    }
  });
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

      if (!subrecords && importDoc.netsuite_da.mapping) {
        subrecordsFromMappings = getNetSuiteSubrecordImports(importDoc);
      }
    }

    return { hasNetsuiteDa, subrecords, subrecordsFromMappings };
  }, [importDoc]);
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();

  useEffect(() => {
    if (!subrecords && subrecordsFromMappings) {
      const patchSet = [];

      if (!hasNetsuiteDa) {
        patchSet.push({
          op: 'add',
          path: `/netsuite_da`,
          value: {},
        });
      }

      patchSet.push({
        op: 'add',
        path: `/netsuite_da/subrecords`,
        value: subrecordsFromMappings,
      });

      dispatch(
        actions.resource.patchStaged(resourceId, patchSet, SCOPES.VALUE)
      );
    }
  }, [dispatch, hasNetsuiteDa, resourceId, subrecords, subrecordsFromMappings]);

  useEffect(() => {
    if (subrecords && JSON.stringify(subrecords) !== JSON.stringify(value)) {
      if (value === '') {
        // shallow update. Form not to be treated as touched
        onFieldChange(id, subrecords, true);
      } else onFieldChange(id, subrecords);
    }
  }, [defaultValue, id, onFieldChange, subrecords, value]);
  const match = useRouteMatch();
  const handleDeleteClick = useCallback(
    fieldId => {
      confirmDialog({
        title: 'Confirm',
        message: 'Are you sure you want to remove this subrecord import?',
        buttons: [
          {
            label: 'Cancel',
          },
          {
            label: 'Yes',
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
                      path: `/netsuite_da/subrecords`,
                      value: updatedSubrecords,
                    },
                  ],
                  SCOPES.VALUE
                )
              );
            },
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
    <Fragment>
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

        {subrecords &&
          subrecords.map(sr => (
            <div key={sr.fieldId} className={classes.actionItems}>
              <Typography component="span">
                {getNetSuiteSubrecordLabel(sr.fieldId, sr.recordType)}
              </Typography>
              <div className={classes.actionBtns}>
                <ActionButton
                  fontSize="small"
                  data-test="edit-subrecord"
                  component={Link}
                  to={`${match.url}/subrecords/${sr.fieldId}`}>
                  <EditIcon />
                </ActionButton>
                <ActionButton
                  fontSize="small"
                  data-test="delete-subrecord"
                  onClick={() => handleDeleteClick(sr.fieldId)}>
                  <DeleteIcon />
                </ActionButton>
              </div>
            </div>
          ))}
      </div>
    </Fragment>
  );
}
