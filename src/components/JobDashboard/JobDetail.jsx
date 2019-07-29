import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { useState, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { difference } from 'lodash';
import actions from '../../actions';
import ChildJobDetail from './ChildJobDetail';
import { JOB_STATUS } from '../../utils/constants';
import JobStatus from './JobStatus';
import { getPages, getSuccess } from './util';
import JobActionsMenu from './JobActionsMenu';

const styles = theme => ({
  icon: {
    margin: theme.spacing.double,
  },
});

function JobDetail({
  job,
  selectedJobs,
  onSelectChange,
  userPermissionsOnIntegration,
}) {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const isSelected = !!(
    selectedJobs[job._id] && selectedJobs[job._id].selected
  );
  const childJobIds = job.children
    .filter(
      cJob =>
        [JOB_STATUS.COMPLETED, JOB_STATUS.FAILED, JOB_STATUS.CANCELED].includes(
          cJob.uiStatus
        ) &&
        (cJob.retriable || cJob.numError > 0)
    )
    .map(cJob => cJob._id);

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
        <TableCell>{job.numError}</TableCell>
        <TableCell>{job.numResolved}</TableCell>
        <TableCell>{getPages(job)}</TableCell>
        <TableCell>{job.duration}</TableCell>
        <TableCell>{job.endedAtAsString}</TableCell>
        <TableCell>
          <JobActionsMenu
            job={job}
            userPermissionsOnIntegration={userPermissionsOnIntegration}
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
          />
        ))}
    </Fragment>
  );
}

export default withStyles(styles)(JobDetail);
