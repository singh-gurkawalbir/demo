import { useState } from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { getPages, getSuccess } from './util';
import JobStatus from './JobStatus';
import JobActionsMenu from './JobActionsMenu';

export default function ChildJobDetail({
  job,
  parentJob,
  onSelectChange,
  selectedJobs,
  userPermissionsOnIntegration,
  onViewErrorsClick,
  integrationName,
}) {
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

  function handleViewErrorsClick() {
    onViewErrorsClick({ jobId: job._id, parentJobId: parentJob._id });
  }

  const jobType = job.type === 'export' ? 'Export' : 'Import';

  return (
    <TableRow>
      <TableCell />
      <TableCell padding="checkbox">
        <Checkbox
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
        {showViewErrorsLink && job.numError > 0 ? (
          <Button
            data-test="jobNumErrorView"
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
            data-test="jobsNumResolvedView"
            variant="text"
            color="primary"
            onClick={handleViewErrorsClick}>
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
