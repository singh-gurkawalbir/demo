import React, { useCallback, useMemo, useState} from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { TextButton } from '@celigo/fuse-ui';
import RefreshIcon from '../../../../../../components/icons/RefreshIcon';
import CancelIcon from '../../../../../../components/icons/CancelIcon';
import DownloadIntegrationIcon from '../../../../../../components/icons/DownloadIntegrationIcon';
import RunFlowButton from '../../../../../../components/RunFlowButton';
import actions from '../../../../../../actions';
import { selectors } from '../../../../../../reducers';
import useConfirmDialog from '../../../../../../components/ConfirmDialog';
import { JOB_STATUS } from '../../../../../../constants';
import EllipsisActionMenu from '../../../../../../components/EllipsisActionMenu';
import JobFilesDownloadDialog from '../../../../../../components/JobDashboard/JobFilesDownloadDialog';
import { DRAGGABLE_SECTION_DIV_ID } from '../..';
import ActionGroup from '../../../../../../components/ActionGroup';
import { message } from '../../../../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  rightActionContainer: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    margin: theme.spacing(0, 1),
  },
}));
const emptySet = [];

export default function RunDashboardActions({ flowId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const [showDownloadFilesDialog, setShowDownloadFilesDialog] = useState(false);

  const {data: latestJobs = emptySet, status} = useSelector(
    state => selectors.latestFlowJobsList(state, flowId),
    shallowEqual);
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
      Icon: DownloadIntegrationIcon,
      action: 'downloadDiagnostics',
      label: 'Download diagnostics',
      disabled: !validDashboardActions.includes('downloadDiagnostics'),
    },
    ...(
      validDashboardActions.includes('downloadFiles') ? [{
        Icon: DownloadIntegrationIcon,
        action: 'downloadFiles',
        label: 'Download files',
      }] : []),
  ], [validDashboardActions]);

  const handleRefresh = useCallback(() => {
    dispatch(actions.errorManager.latestFlowJobs.request({ flowId, refresh: true }));
  }, [dispatch, flowId]);

  const handleCancel = useCallback(() => {
    confirmDialog({
      title: 'Confirm cancel run',
      message: message.CONFIRM_CANCEL_RUN,
      buttons: [
        {
          label: 'Cancel run',
          onClick: () => {
            dispatch(actions.errorManager.latestFlowJobs.cancelLatestJobs({flowId, jobIds: cancellableJobIds }));
          },
        },
        {
          label: 'No, go back',
          variant: 'text',
        },
      ],
    });
  }, [dispatch, confirmDialog, cancellableJobIds, flowId]);

  const handleDownloadDiagnostics = useCallback(() => {
    latestJobs
      .filter(job => ![JOB_STATUS.RUNNING, JOB_STATUS.QUEUED].includes(job.status))
      .map(job => dispatch(actions.job.downloadFiles({ jobId: job._id, fileType: 'diagnostics' })));
  }, [latestJobs, dispatch]);

  const handleDownloadFiles = useCallback(() => {
    const latestJob = latestJobs[0];

    // what to do incase of multiple jobs?
    if (latestJob._id) {
      if (latestJob.files.length === 1) {
        dispatch(actions.job.downloadFiles({ jobId: latestJob._id }));
      } else {
        // Incase of multiple files , show a dialog to download
        setShowDownloadFilesDialog(true);
      }
    }
  }, [dispatch, latestJobs]);

  const handleCloseDownloadFilesDialog = useCallback(() => setShowDownloadFilesDialog(false), []);

  const handleAction = useCallback(action => {
    switch (action) {
      case 'downloadDiagnostics':
        handleDownloadDiagnostics();
        break;
      case 'downloadFiles':
        handleDownloadFiles();
        break;
      default:
    }
  }, [handleDownloadDiagnostics, handleDownloadFiles]);

  return (
    <div id={DRAGGABLE_SECTION_DIV_ID} className={classes.rightActionContainer}>
      <ActionGroup>
        <RunFlowButton variant="iconText" flowId={flowId} label="Run" />
        <TextButton
          onClick={handleRefresh}
          disabled={status === 'requested'}
          startIcon={<RefreshIcon />}>
          Refresh
        </TextButton>
        <TextButton
          onClick={handleCancel}
          disabled={!validDashboardActions?.includes('cancel')}
          startIcon={<CancelIcon />}
          sx={{whiteSpace: 'nowrap'}}>
          Cancel run
        </TextButton>
        <EllipsisActionMenu actionsMenu={dashboardActionsMenu} onAction={handleAction} label="More" />
        {
        showDownloadFilesDialog && <JobFilesDownloadDialog job={latestJobs[0]} onCloseClick={handleCloseDownloadFilesDialog} />
      }
      </ActionGroup>
    </div>
  );
}
