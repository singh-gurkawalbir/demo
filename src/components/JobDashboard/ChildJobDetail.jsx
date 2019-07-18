import { useState } from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import { getPages, getSuccess } from './util';
import JobStatus from './JobStatus';

export default function JobDetail({
  job,
  parentJob,
  onSelectChange,
  parentJobSelected,
}) {
  const [isSelected, setIsSelected] = useState(false);
  const isSelectable = job.retriable || job.numError;

  function handleSelectChange(event) {
    setIsSelected(event.target.checked);
    onSelectChange(event.target.checked, job._id);
  }

  return (
    <TableRow>
      <TableCell />
      <TableCell padding="checkbox">
        <Checkbox
          disabled={!isSelectable}
          checked={isSelectable && (parentJobSelected || isSelected)}
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
      <TableCell>Actions</TableCell>
    </TableRow>
  );
}
