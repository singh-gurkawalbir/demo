import React, { useCallback} from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import RefreshIcon from '../../../../../../../components/icons/RefreshIcon';
import CancelIcon from '../../../../../../../components/icons/CancelIcon';
import RunFlowButton from '../../../../../../../components/RunFlowButton';
import IconTextButton from '../../../../../../../components/IconTextButton';
import actions from '../../../../../../../actions';
import useConfirmDialog from '../../../../../../../components/ConfirmDialog';

const useStyles = makeStyles(theme => ({
  rightActionContainer: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    alignContent: 'center',
    margin: theme.spacing(1),
  },
}));
export default function LatestJobActions({ flowId, jobId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const handleRefresh = useCallback(() => {
    dispatch(actions.job.clear());
  }, [dispatch]);

  const handleCancel = useCallback(() => {
    confirmDialog({
      title: 'Confirm cancel',
      message:
          'Are you sure you want to cancel? You have unsaved changes that will be lost if you proceed. Please note that canceling this job will delete all associated data currently queued for processing.',
      buttons: [
        {
          label: 'Yes, cancel',
          onClick: () => {
            // TODO: check for cases to handle
            dispatch(actions.job.cancel({ jobId }));
          },
        },
        {
          label: 'No, go back',
          color: 'secondary',
        },
      ],
    });
  }, [jobId, dispatch, confirmDialog]);

  return (
    <div className={classes.rightActionContainer}>
      <RunFlowButton variant="iconText" flowId={flowId} label="Run" />
      <IconTextButton onClick={handleRefresh}>
        <RefreshIcon /> Refresh
      </IconTextButton>
      {/* disable when not eligible to cancel */}
      <IconTextButton onClick={handleCancel}>
        <CancelIcon /> Cancel
      </IconTextButton>
    </div>
  );
}
