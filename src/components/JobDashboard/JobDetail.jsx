import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { difference } from 'lodash';
import actions from '../../actions';
import ChildJobDetail from './ChildJobDetail';
import { JOB_STATUS } from '../../utils/constants';
import JobStatus from './JobStatus';
import { getPages, getSuccess } from './util';
import JobActionsMenu from './JobActionsMenu';
import Spinner from '../Spinner';
import ArrowDownIcon from '../icons/ArrowDownIcon';
import ArrowUpIcon from '../icons/ArrowUpIcon';
import DateTimeDisplay from '../DateTimeDisplay';
import ErrorCountCell from './ErrorCountCell';

const useStyles = makeStyles(theme => ({
  icon: {
    margin: theme.spacing.double,
  },
  spinner: {
    left: '0px',
    right: '0px',
    background: 'rgba(106, 123, 137, 0.7)',
    width: '100%',
    position: 'absolute',
    color: theme.palette.background.paper,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'inherit',
    zIndex: 1,
    padding: 14,
    '& span': {
      marginLeft: '10px',
      color: theme.palette.background.paper,
    },
  },
  checkAction: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    justifyContent: 'flex-start',
    '& li': {
      float: 'left',
      '&:empty': {
        marginLeft: 22,
      },
    },
  },
  moreIcon: {
    padding: 0,
  },
  checkIcon: {
    padding: 0,
  },
  name: {
    width: '18.15%',
  },
  status: {
    width: '10.15%',
  },
  success: {
    width: '9%',
    textAlign: 'right',
  },
  ignore: {
    width: '7.5%',
    textAlign: 'right',
  },
  error: {
    width: '10.15%',
    textAlign: 'right',
  },
  errorCount: {
    color: theme.palette.error.dark,
  },
  // statusBtn: {
  //   color: theme.palette.error.dark,
  //   float: 'right',
  //   padding: 0,
  //   minWidth: 'unset',
  // },
  resolved: {
    width: '9%',
    textAlign: 'right',
  },
  pages: {
    width: '7.5%',
    textAlign: 'right',
  },
  duration: {
    width: '9%',
    textAlign: 'right',
  },
  completed: {
    width: '11.5%',
    whiteSpace: 'nowrap',
  },
  actions: {
    width: '7.5%',
    textAlign: 'center',
  },
  checkActionBorder: {
    paddingLeft: '13px',
    borderLeft: `5px solid ${theme.palette.primary.main}`,
  },
}));

export default function JobDetail({
  job,
  selectedJobs,
  onSelectChange,
  userPermissionsOnIntegration,
  onViewErrorsClick,
  integrationName,
  isFlowBuilderView,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const isSelected = !!(
    selectedJobs[job._id] && selectedJobs[job._id].selected
  );
  const childJobIds = job.children
    ? job.children
      .filter(
        cJob =>
          [
            JOB_STATUS.COMPLETED,
            JOB_STATUS.FAILED,
            JOB_STATUS.CANCELED,
          ].includes(cJob.uiStatus) &&
            (cJob.retriable || cJob.numError > 0)
      )
      .map(cJob => cJob._id)
    : [];
  const isJobInProgress = [
    JOB_STATUS.QUEUED,
    JOB_STATUS.RUNNING,
    JOB_STATUS.RETRYING,
  ].includes(job.uiStatus);

  function handleExpandCollapseClick() {
    setExpanded(!expanded);

    if (!expanded && (!job.children || job.children.length === 0)) {
      dispatch(actions.job.requestFamily({ jobId: job._id }));
    }
  }

  if (isSelected) {
    if (!expanded && (!job.children || job.children.length === 0)) {
      handleExpandCollapseClick();
    }
  }

  function handleSelectChange(event) {
    const { checked } = event.target;

    if (checked && !expanded) {
      handleExpandCollapseClick();
    }

    const jobIds = { ...selectedJobs };
    const currJob = jobIds[job._id] || {};

    currJob.selected = checked;
    currJob.flowDisabled = job.flowDisabled;

    if (checked) {
      currJob.selectedChildJobIds = childJobIds;
    } else {
      currJob.selectedChildJobIds = [];
    }

    onSelectChange(currJob, job._id);
  }

  function handleChildSelectChange(
    selected,
    jobId,
    ignoreUpdatingParentStatus
  ) {
    const jobIds = { ...selectedJobs };
    const currJob = jobIds[job._id] || {};

    currJob.flowDisabled = job.flowDisabled;

    if (!currJob.selectedChildJobIds) {
      currJob.selectedChildJobIds = [];
    }

    const index = currJob.selectedChildJobIds.indexOf(jobId);

    if (selected) {
      if (index === -1) {
        currJob.selectedChildJobIds.push(jobId);
      }

      const notSelectedChildJobIds = difference(
        childJobIds,
        currJob.selectedChildJobIds
      );

      if (!ignoreUpdatingParentStatus) {
        currJob.selected = notSelectedChildJobIds.length === 0;
      }
    } else {
      if (index > -1) {
        currJob.selectedChildJobIds = [
          ...currJob.selectedChildJobIds.slice(0, index),
          ...currJob.selectedChildJobIds.slice(index + 1),
        ];
      }

      if (!ignoreUpdatingParentStatus) {
        currJob.selected = false;
      }
    }

    onSelectChange(currJob, job._id);
  }

  function handleViewErrorsClick(showResolved = false) {
    if (!job.children || job.children.length === 0) {
      dispatch(actions.job.requestFamily({ jobId: job._id }));
    }

    onViewErrorsClick({ jobId: job._id, showResolved });
  }
  function RowIcon({expanded, childLoaded}) {
    if (expanded && !childLoaded) {
      return <Spinner size={24} />;
    }

    return expanded ? <ArrowUpIcon /> : <ArrowDownIcon />;
  }

  return (
    <>
      <TableRow>
        <TableCell
          className={clsx({
            [classes.checkActionBorder]: isSelected && expanded && job.children,
          })}>
          <ul className={classes.checkAction}>
            <li>
              {job.uiStatus !== JOB_STATUS.QUEUED && (
                <IconButton
                  data-test="toggleJobDetail"
                  className={classes.moreIcon}
                  onClick={handleExpandCollapseClick}>
                  <RowIcon expanded={expanded} childLoaded={job.children} />
                </IconButton>
              )}
            </li>
            <li>
              <Checkbox
                disabled={!(job.retriable || job.numError)}
                checked={isSelected}
                className={classes.checkIcon}
                color="primary"
                onChange={event => handleSelectChange(event)}
              />
            </li>
          </ul>
        </TableCell>
        <TableCell className={classes.name} data-test={job.name || job._flowId}>
          {job.name || job._flowId}
        </TableCell>
        <TableCell className={classes.status}>
          <JobStatus job={job} />
        </TableCell>
        <TableCell className={classes.success}>{getSuccess(job)}</TableCell>
        <TableCell className={classes.ignore}>{job.numIgnore}</TableCell>
        <ErrorCountCell
          count={job.numError}
          isJobInProgress={isJobInProgress}
          isError
          onClick={() => handleViewErrorsClick(false)}
          className={clsx(classes.error, {
            [classes.errorCount]: job.numError > 0,
          })}
           />
        <ErrorCountCell
          count={job.numResolved}
          isJobInProgress={isJobInProgress}
          onClick={() => handleViewErrorsClick(true)}
          className={classes.resolved}
           />
        <TableCell className={classes.pages}>{getPages(job)}</TableCell>
        <TableCell className={classes.duration}>{job.duration}</TableCell>
        <TableCell className={classes.completed}>
          <DateTimeDisplay dateTime={job.endedAt} />
        </TableCell>
        <TableCell className={classes.actions}>
          <JobActionsMenu
            job={job}
            userPermissionsOnIntegration={userPermissionsOnIntegration}
            integrationName={integrationName}
            isFlowBuilderView={isFlowBuilderView}
          />
        </TableCell>
      </TableRow>

      {expanded &&
        job.children &&
        job.children.map(cJob => (
          <ChildJobDetail
            key={cJob._id}
            job={cJob}
            parentJob={job}
            onSelectChange={handleChildSelectChange}
            selectedJobs={selectedJobs}
            userPermissionsOnIntegration={userPermissionsOnIntegration}
            onViewErrorsClick={onViewErrorsClick}
            integrationName={integrationName}
            isFlowBuilderView={isFlowBuilderView}
          />
        ))}
    </>
  );
}
