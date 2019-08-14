import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ExpandMore from '@material-ui/icons/ExpandMore';
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

const styles = theme => ({
  icon: {
    margin: theme.spacing.double,
  },
  spinner: {
    left: '0px',
    right: '0px',
    background: 'rgba(0,0,0,0.7)',
    width: '100%',
    position: 'absolute',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'inherit',
    '& div': {
      width: '20px !important',
      height: '20px !important',
    },
    '& span': {
      marginLeft: '10px',
      color: '#fff',
    },
  },
});

function JobDetail({
  classes,
  job,
  selectedJobs,
  onSelectChange,
  userPermissionsOnIntegration,
  onViewErrorsClick,
}) {
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

  function handleExpandCollapseClick() {
    setExpanded(!expanded);

    if (!expanded && (!job.children || !job.children.length)) {
      dispatch(actions.job.requestFamily({ jobId: job._id }));
    }
  }

  if (isSelected) {
    if (!expanded && (!job.children || !job.children.length)) {
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

  function handleViewErrorsClick() {
    if (!job.children || job.children.length === 0) {
      dispatch(actions.job.requestFamily({ jobId: job._id }));
    }

    onViewErrorsClick({ jobId: job._id });
  }

  return (
    <Fragment>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            disabled={!(job.retriable || job.numError)}
            checked={isSelected}
            onChange={event => handleSelectChange(event)}
          />
        </TableCell>
        <TableCell>
          {job.uiStatus !== JOB_STATUS.QUEUED && (
            <IconButton onClick={handleExpandCollapseClick}>
              {expanded ? <ExpandMore /> : <ChevronRight />}
            </IconButton>
          )}
        </TableCell>
        <TableCell>{job.name}</TableCell>
        <TableCell>
          <JobStatus job={job} />
        </TableCell>
        <TableCell>{getSuccess(job)}</TableCell>
        <TableCell>{job.numIgnore}</TableCell>
        <TableCell
          onMouseEnter={() => {
            setShowViewErrorsLink(true);
          }}
          onMouseLeave={() => {
            setShowViewErrorsLink(false);
          }}>
          {showViewErrorsLink && job.numError > 0 ? (
            <Button
              variant="text"
              color="primary"
              onClick={handleViewErrorsClick}>
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
          {showViewErrorsLink && job.numResolved > 0 ? (
            <Button
              variant="text"
              color="primary"
              onClick={handleViewErrorsClick}>
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
          />
        </TableCell>
        {expanded && !job.children && (
          <div className={classes.spinner}>
            <Spinner /> <span>Loading child jobs...</span>
          </div>
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
          />
        ))}
    </Fragment>
  );
}

export default withStyles(styles)(JobDetail);
