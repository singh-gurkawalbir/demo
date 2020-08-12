import React, { useCallback, useMemo} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import RefreshIcon from '../../../../../components/icons/RefreshIcon';
import CancelIcon from '../../../../../components/icons/CancelIcon';
import DownloadIntegrationIcon from '../../../../../components/icons/DownloadIntegrationIcon';
import RunFlowButton from '../../../../../components/RunFlowButton';
import IconTextButton from '../../../../../components/IconTextButton';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import useConfirmDialog from '../../../../../components/ConfirmDialog';
import { JOB_STATUS } from '../../../../../utils/constants';
import EllipsisActionMenu from '../../../../../components/EllipsisActionMenu';

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

  const validDashboardActions = useMemo(() => {
    // return set of actions [cancel, downloadDiagnostics]
    const actions = [];

    if (!latestJobs.length) return actions;
    const jobsInProgress = latestJobs
      .filter(job => [JOB_STATUS.RUNNING, JOB_STATUS.QUEUED].includes(job.status));

    if (jobsInProgress.length) actions.push('cancel');
    if (!jobsInProgress.length) actions.push('downloadDiagnostics');

    return actions;
  }, [latestJobs]);

  const dashboardActionsMenu = useMemo(() => [
    {
      Icon: CancelIcon,
      action: 'cancel',
      label: 'Cancel',
      disabled: !validDashboardActions.includes('cancel'),
    },
    {
      Icon: DownloadIntegrationIcon,
      action: 'downloadDiagnostics',
      label: 'Download diagnostics',
      disabled: !validDashboardActions.includes('downloadDiagnostics'),
    },
  ], [validDashboardActions]);

  const handleRefresh = useCallback(() => {
    dispatch(actions.job.clear());
  }, [dispatch]);

  const handleCancel = useCallback(() => {
    confirmDialog({
      title: 'Are you sure you want to cancel?',
      message:
          'You have unsaved changes that will be lost if you continue. Canceling this job will delete all associated data currently queued for processing.',
      buttons: [
        {
          label: 'Cancel run',
          onClick: () => {
            // TODO: check for cases to handle
            cancellableJobIds
              .forEach(jobId => dispatch(actions.job.cancel({ jobId })));
          },
        },
        {
          label: 'Close',
          color: 'secondary',
        },
      ],
    });
  }, [dispatch, confirmDialog, cancellableJobIds]);

  const handleDownloadDiagnostics = useCallback(() => {
    latestJobs
      .filter(job => ![JOB_STATUS.RUNNING, JOB_STATUS.QUEUED].includes(job.status))
      .map(job => dispatch(actions.job.downloadFiles({ jobId: job._id, fileType: 'diagnostics' })));
  }, [latestJobs, dispatch]);

  const handleAction = useCallback(action => {
    switch (action) {
      case 'cancel': handleCancel();
        break;
      case 'downloadDiagnostics': {
        handleDownloadDiagnostics();
        break;
      }
      default:
    }
  }, [handleCancel, handleDownloadDiagnostics]);

  return (
    <div className={classes.rightActionContainer}>
      <RunFlowButton variant="iconText" flowId={flowId} label="Run" />
      <IconTextButton onClick={handleRefresh} disabled={areFlowJobsLoading}>
        <RefreshIcon /> Refresh
      </IconTextButton>
      <EllipsisActionMenu actionsMenu={dashboardActionsMenu} onAction={handleAction} />
    </div>
  );
}
