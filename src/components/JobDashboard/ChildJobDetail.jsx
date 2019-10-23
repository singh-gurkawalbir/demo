import { useState } from 'react';
import TableCell from '@material-ui/core/TableCell';
import { makeStyles } from '@material-ui/core/styles';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { getPages, getSuccess } from './util';
import JobStatus from './JobStatus';
import JobActionsMenu from './JobActionsMenu';
import { JOB_STATUS } from '../../utils/constants';

const useStyles = makeStyles({
  checkAction: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

export default function ChildJobDetail({
  job,
  parentJob,
  onSelectChange,
  selectedJobs,
  userPermissionsOnIntegration,
  onViewErrorsClick,
  integrationName,
}) {
  const isJobInProgress = [
    JOB_STATUS.QUEUED,
    JOB_STATUS.RUNNING,
    JOB_STATUS.RETRYING,
  ].includes(job.uiStatus);
  const classes = useStyles();
  const isSelectable = !!(job.retriable || job.numError);
  const parentSelectionInfo = selectedJobs[parentJob._id] || {
    selected: false,
    selectedChildJobIds: [],
  };
  const isSelected =
    parentSelectionInfo.selected ||
    (parentSelectionInfo.selectedChildJobIds &&
      parentSelectionInfo.selectedChildJobIds.includes(job._id));

  if (
    isSelectable &&
    isSelected &&
    (!parentSelectionInfo.selectedChildJobIds ||
      !parentSelectionInfo.selectedChildJobIds.includes(job._id))
  ) {
    onSelectChange(true, job._id, true);
  }

  const [showViewErrorsLink, setShowViewErrorsLink] = useState(false);

  function handleSelectChange(event) {
    onSelectChange(event.target.checked, job._id);
  }

  function handleViewErrorsClick(showResolved = false) {
    onViewErrorsClick({
      jobId: job._id,
      parentJobId: parentJob._id,
      showResolved,
      numError: job.numError,
      numResolved: job.numResolved,
    });
  }

  const jobType = job.type === 'export' ? 'Export' : 'Import';

  return (
    <TableRow>
      <TableCell className={classes.checkAction}>
        <Checkbox
          color="primary"
          disabled={!isSelectable}
          checked={isSelectable && isSelected}
          onChange={event => handleSelectChange(event)}
        />
      </TableCell>
      <TableCell>{job.name || jobType}</TableCell>
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
        {showViewErrorsLink && !isJobInProgress && job.numError > 0 ? (
          <Button
            data-test="jobNumErrorView"
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
            data-test="jobsNumResolvedView"
            variant="text"
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
      <TableCell>{getPages(job, parentJob)}</TableCell>
      <TableCell>{job.duration}</TableCell>
      <TableCell>{job.endedAtAsString}</TableCell>
      <TableCell>
        <JobActionsMenu
          job={job}
          userPermissionsOnIntegration={userPermissionsOnIntegration}
          integrationName={integrationName}
        />
      </TableCell>
    </TableRow>
  );
}
