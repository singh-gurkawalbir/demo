import React, { useCallback, useMemo} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import RefreshIcon from '../../../../../components/icons/RefreshIcon';
import CancelIcon from '../../../../../components/icons/CancelIcon';
import RunFlowButton from '../../../../../components/RunFlowButton';
import IconTextButton from '../../../../../components/IconTextButton';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import useConfirmDialog from '../../../../../components/ConfirmDialog';
import { JOB_STATUS } from '../../../../../utils/constants';

const useStyles = makeStyles(theme => ({
  rightActionContainer: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    margin: theme.spacing(1),
  },
}));
export default function RunDashboardActions({ flowId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const areFlowJobsLoading = useSelector(state => {
    const {merged: flow = {}} = selectors.resourceData(state, 'flows', flowId);

    return selectors.areFlowJobsLoading(state, { integrationId: flow._integrationId || 'none', flowId });
  });

  const latestJobs = useSelector(state => selectors.latestFlowJobs(state));
  const cancellableJobIds = useMemo(() => {
    const jobIdsToCancel = latestJobs
      .filter(job => [JOB_STATUS.RUNNING, JOB_STATUS.QUEUED].includes(job.status))
      .map(job => job._id);

    return jobIdsToCancel;
  }, [latestJobs]);
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
            cancellableJobIds
              .forEach(jobId => dispatch(actions.job.cancel({ jobId })));
          },
        },
        {
          label: 'No, go back',
          color: 'secondary',
        },
      ],
    });
  }, [dispatch, confirmDialog, cancellableJobIds]);

  return (
    <div className={classes.rightActionContainer}>
      <RunFlowButton variant="iconText" flowId={flowId} label="Run" />
      <IconTextButton onClick={handleRefresh} disabled={areFlowJobsLoading}>
        <RefreshIcon /> Refresh
      </IconTextButton>
      <IconTextButton onClick={handleCancel} disabled={cancellableJobIds.length === 0}>
        <CancelIcon /> Cancel
      </IconTextButton>
    </div>
  );
}
