import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import { getPages, getSuccess } from './util';
import JobStatus from './JobStatus';
import JobActionsMenu from './JobActionsMenu';

export default function ChildJobDetail({
  job,
  parentJob,
  onSelectChange,
  selectedJobs,
  userPermissionsOnIntegration,
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

  function handleSelectChange(event) {
    onSelectChange(event.target.checked, job._id);
  }

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
      <TableCell>{job.name}</TableCell>
      <TableCell>
        <JobStatus job={job} />
      </TableCell>
      <TableCell>{getSuccess(job)}</TableCell>
      <TableCell>{job.numIgnore}</TableCell>
      <TableCell>{job.numError}</TableCell>
      <TableCell>{job.numResolved}</TableCell>
      <TableCell>{getPages(job, parentJob)}</TableCell>
      <TableCell>{job.duration}</TableCell>
      <TableCell>{job.endedAtAsString}</TableCell>
      <TableCell>
        <JobActionsMenu
          job={job}
          userPermissionsOnIntegration={userPermissionsOnIntegration}
        />
      </TableCell>
    </TableRow>
  );
}
