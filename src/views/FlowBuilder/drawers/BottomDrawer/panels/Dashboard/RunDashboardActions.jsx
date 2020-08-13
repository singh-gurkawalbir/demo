import React, { useCallback, useMemo, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import RefreshIcon from '../../../../../../components/icons/RefreshIcon';
import CancelIcon from '../../../../../../components/icons/CancelIcon';
import DownloadIntegrationIcon from '../../../../../../components/icons/DownloadIntegrationIcon';
import RunFlowButton from '../../../../../../components/RunFlowButton';
import IconTextButton from '../../../../../../components/IconTextButton';
import actions from '../../../../../../actions';
import { selectors } from '../../../../../../reducers';
import useConfirmDialog from '../../../../../../components/ConfirmDialog';
import { JOB_STATUS } from '../../../../../../utils/constants';
import EllipsisActionMenu from '../../../../../../components/EllipsisActionMenu';
import JobFilesDownloadDialog from '../../../../../../components/JobDashboard/JobFilesDownloadDialog';

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
  const [showDownloadFilesDialog, setShowDownloadFilesDialog] = useState(false);
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
    // return set of actions [cancel, downloadDiagnostics, downloadFiles]
    // TODO @Raghu: Check for downloadFiles action - as it is not feasible to apply on multiple jobs
    const actions = [];

    // If there are no jobs at all, disable all actions
    if (!latestJobs.length) return actions;
    const jobsInProgress = latestJobs
      .filter(job => [JOB_STATUS.RUNNING, JOB_STATUS.QUEUED].includes(job.status));

    if (jobsInProgress.length) actions.push('cancel');
    if (!jobsInProgress.length) {
      actions.push('downloadDiagnostics');
      // Handles only for first job to downloadFile incase of Single PG flow
      // TODO @Raghu: Need to revisit once we handle multiple PG's case
      if (latestJobs[0]?.files?.length) {
        actions.push('downloadFiles');
      }
    }

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
    {
      Icon: DownloadIntegrationIcon,
      action: 'downloadFiles',
      label: 'Download files',
      disabled: !validDashboardActions.includes('downloadFiles'),
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

  const handleDownloadFiles = useCallback(() => {
    // A defensive checking for id - it should always be there
    const latestJobId = latestJobs[0]?._id;

    // what to do incase of multiple jobs?
    if (latestJobId) {
      if (latestJobs[0].files.length === 1) {
        dispatch(actions.job.downloadFiles({ jobId: latestJobs[0]._id }));
      } else {
        // Incase of multiple files , show a dialog to download
        setShowDownloadFilesDialog(true);
      }
    }
  }, [dispatch, latestJobs]);

  const handleCloseDownloadFilesDialog = useCallback(() => setShowDownloadFilesDialog(false), []);

  const handleAction = useCallback(action => {
    switch (action) {
      case 'cancel':
        handleCancel();
        break;
      case 'downloadDiagnostics':
        handleDownloadDiagnostics();
        break;
      case 'downloadFiles':
        handleDownloadFiles();
        break;
      default:
    }
  }, [handleCancel, handleDownloadDiagnostics, handleDownloadFiles]);

  return (
    <div className={classes.rightActionContainer}>
      <RunFlowButton variant="iconText" flowId={flowId} label="Run" />
      <IconTextButton onClick={handleRefresh} disabled={areFlowJobsLoading}>
        <RefreshIcon /> Refresh
      </IconTextButton>
      <EllipsisActionMenu actionsMenu={dashboardActionsMenu} onAction={handleAction} />
      {
        showDownloadFilesDialog && <JobFilesDownloadDialog job={latestJobs[0]} onCloseClick={handleCloseDownloadFilesDialog} />
      }
    </div>
  );
}
