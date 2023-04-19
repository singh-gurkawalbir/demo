import React, {useCallback} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { JOB_STATUS } from '../../../../../constants';
import { selectors } from '../../../../../reducers';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import OfflineConnectionsIcon from '../../../../icons/OfflineConnectionsIcon';
import actions from '../../../../../actions';

const useStyles = makeStyles(theme => ({
  root: {
    // display: 'flex',
    maxWidth: 300,
    wordWrap: 'break-word',
  },
  connectionIcon: {
    '&:hover': {
      backgroundColor: theme.palette.background.paper2,
    },
  },
  offlineIcon: {
    color: theme.palette.secondary.main,
    width: 18,
  },
}));

function OfflineConnectionsIndicator({resourceType, resourceId}) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const resource = useSelectorMemo(selectors.makeResourceSelector, resourceType, resourceId);

  const isOffline = useSelector(state =>
    selectors.isConnectionOffline(state, resource?._connectionId)
  );

  const onOfflineIconClick = useCallback(
    () => {
      dispatch(actions.bottomDrawer.setActiveTab({tabType: 'connections'}));
    },
    [dispatch]);

  if (!isOffline) { return null; }

  return (
    <IconButtonWithTooltip
      className={classes.connectionIcon}
      onClick={onOfflineIconClick}
      tooltipProps={{title: 'Connection down', placement: 'bottom'}}
      buttonSize={{size: 'small'}}>
      <OfflineConnectionsIcon className={classes.offlineIcon} />
    </IconButtonWithTooltip>
  );
}

function FlowName({ job }) {
  const exportName = useSelector(state => {
    const exportObj = selectors.resource(state, 'exports', job._expOrImpId || job._exportId);

    return exportObj?.name || 'Export';
  });

  // In cases when parent job is cancelled while it is in queue, children are not yet created
  // In that case, we show that parent job with PG's name similar to Queued job
  // flowJobId exists on job if it is a child job
  const isCancelledParentJob = job.status === JOB_STATUS.CANCELED && (job._expOrImpId || job._exportId) && !job._flowJobId && !job._parentJobId;
  const isInProgressParentJob = job.status === JOB_STATUS.RUNNING && (job._expOrImpId || job._exportId) && !job._flowJobId && !job._parentJobId;

  if (job.status === JOB_STATUS.QUEUED || isCancelledParentJob || isInProgressParentJob) {
    return exportName;
  }

  // Incase of Old flows , we show Export/Import instead of names as they don't exist for old resources
  // Referred to EM 1.0 Jobs for this behaviour
  return job.name || (job.type === 'export' ? 'Export' : 'Import');
}

export default function FlowStepName({ job }) {
  const classes = useStyles();
  const resourceType = job?.type === 'export' ? 'exports' : 'imports';
  const resourceId = job?._expOrImpId || job?._exportId || job?._importId;

  return (
    <div className={classes.root}>
      <FlowName job={job} />
      <OfflineConnectionsIndicator resourceType={resourceType} resourceId={resourceId} />
    </div>
  );
}
