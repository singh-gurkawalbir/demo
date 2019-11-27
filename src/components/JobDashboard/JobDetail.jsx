import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import { Button } from '@material-ui/core';
import { useState, Fragment } from 'react';
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
    padding: 16,
    '& span': {
      marginLeft: '10px',
      color: '#fff',
    },
  },
  checkAction: {
    listStyle: 'none',
    padding: 0,
    minWidth: '60px',
    '& li': {
      float: 'left',
    },
  },
  moreIcon: {
    padding: 0,
  },
  checkIcon: {
    padding: 0,
  },
}));

function JobDetail({
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
  const [showViewErrorsLink, setShowViewErrorsLink] = useState(false);
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

  return (
    <Fragment>
      <TableRow>
        <TableCell>
          <ul className={classes.checkAction}>
            <li>
              {job.uiStatus !== JOB_STATUS.QUEUED && (
                <IconButton
                  data-test="toggleJobDetail"
                  className={classes.moreIcon}
                  onClick={handleExpandCollapseClick}>
                  {expanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
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
        <TableCell data-test={job.name}>{job.name}</TableCell>
        <TableCell>
          <JobStatus job={job} />
        </TableCell>
        <TableCell>{getSuccess(job)}</TableCell>
        <TableCell>{job.numIgnore}</TableCell>
        <TableCell
          align="right"
          onMouseEnter={() => {
            setShowViewErrorsLink(true);
          }}
          onMouseLeave={() => {
            setShowViewErrorsLink(false);
          }}>
          {showViewErrorsLink && !isJobInProgress && job.numError > 0 ? (
            <Button
              data-test="viewJobErrors"
              variant="text"
              color="primary"
              onClick={() => {
                handleViewErrorsClick(false);
              }}>
              {job.numError} View
            </Button>
          ) : (
            job.numError
          )}
        </TableCell>
        <TableCell
          onMouseEnter={() => {
            setShowViewErrorsLink(true);
          }}
          onMouseLeave={() => {
            setShowViewErrorsLink(false);
          }}>
          {showViewErrorsLink && !isJobInProgress && job.numResolved > 0 ? (
            <Button
              variant="text"
              data-test="viewResolvedErroredJobs"
              color="primary"
              onClick={() => {
                handleViewErrorsClick(true);
              }}>
              {job.numResolved} View
            </Button>
          ) : (
            job.numResolved
          )}
        </TableCell>
        <TableCell>{getPages(job)}</TableCell>
        <TableCell>{job.duration}</TableCell>
        <TableCell>{job.endedAtAsString}</TableCell>
        <TableCell>
          <JobActionsMenu
            job={job}
            userPermissionsOnIntegration={userPermissionsOnIntegration}
            integrationName={integrationName}
            isFlowBuilderView={isFlowBuilderView}
          />
        </TableCell>

        {expanded && !job.children && (
          <TableCell className={classes.spinner}>
            <Spinner size={20} /> <span>Loading child jobs...</span>
          </TableCell>
        )}
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
          />
        ))}
    </Fragment>
  );
}

export default JobDetail;
