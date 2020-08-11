import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { selectors } from '../../../reducers';
import { JOB_STATUS } from '../../../utils/constants';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import DateTimeDisplay from '../../../components/DateTimeDisplay';
import actions from '../../../actions';
import RefreshIcon from '../../../components/icons/RefreshIcon';

const useStyles = makeStyles(theme => ({
  divider: {
    width: 1,
    height: 25,
    borderLeft: `1px solid ${theme.palette.secondary.lightest}`,
    margin: theme.spacing(0, 1, 0, 1),
  },
  flexContainer: {
    display: 'flex',
  },
  icon: {
    height: theme.spacing(2),
    width: theme.spacing(2),
    marginRight: theme.spacing(0.5),
  },
}));
export default function LastRun({ flowId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const flow = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'flows',
    flowId
  ).merged || {};
  const flowJobStatus = useSelector(state => {
    const latestJobs = selectors.latestFlowJobs(state);

    const isInProgress = latestJobs.some(job => job.status === JOB_STATUS.RUNNING);

    if (isInProgress) return 'running';

    const isWaitingInQueue = latestJobs.some(job => job.status === JOB_STATUS.QUEUED);

    if (isWaitingInQueue) return 'queued';
  });

  const lastExecutedJob = useSelector(state => {
    const jobs = selectors.flowJobs(state);

    return jobs.find(job => !!job.lastExecutedAt);
  });

  if (!(flowJobStatus || lastExecutedJob || flow.lastRunAt || flow.lastExecutedAt)) {
    return null;
  }

  if (flowJobStatus) {
    return (
      <>
        <div className={classes.divider} />
        <span className={classes.flexContainer}> <RefreshIcon className={classes.icon} /> {flowJobStatus === 'running' ? 'running' : 'waiting in queue' }</span>
      </>
    );
  }
  // Updates job's last executed at on the flow with a temporary prop 'lastRunAt' to update flow's lastExecutedAt
  // If any changes occur on a flow, it fetches latest flow's lastExecutedAt which is same as this
  if (lastExecutedJob?.lastExecutedAt && lastExecutedJob.lastExecutedAt !== flow.lastRunAt) {
    const patchSet = [
      {
        op: flow.lastRunAt ? 'replace' : 'add',
        path: '/lastRunAt',
        value: lastExecutedJob.lastExecutedAt,
      },
    ];

    dispatch(actions.resource.patchStaged(flowId, patchSet, 'value'));
  }
  // At any time if the jobs are not loaded/ flow's lastRunAt has not been updated yet
  // we can fall back to lastExecutedAt property
  if (flow.lastRunAt || flow.lastExecutedAt) {
    return (
      <>
        <div className={classes.divider} />
        <span className={classes.flexContainer}> <RefreshIcon className={classes.icon} /> Last run: <DateTimeDisplay dateTime={flow.lastRunAt || flow.lastExecutedAt} /> </span>
      </>
    );
  }
}
