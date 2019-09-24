import { useState, Fragment } from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import JobErrorMessage from './JobErrorMessage';

export default function JobErrorDetail({
  jobError,
  isParent,
  onSelectChange,
  selected,
  onEditRetryDataClick,
}) {
  const [expanded, setExpanded] = useState(false);

  function handleExpandCollapseClick() {
    setExpanded(!expanded);
  }

  return (
    <Fragment>
      <TableRow key={jobError._id}>
        <TableCell padding="checkbox">
          {isParent && !jobError.resolved && (
            <Checkbox
              checked={!!selected}
              onChange={event => onSelectChange(event, jobError._id)}
            />
          )}
        </TableCell>
        <TableCell>
          {isParent &&
            jobError.similarErrors &&
            jobError.similarErrors.length > 0 && (
              <IconButton onClick={handleExpandCollapseClick}>
                {expanded ? <ExpandMore /> : <ChevronRight />}
              </IconButton>
            )}
        </TableCell>
        <TableCell>{jobError.resolved ? 'Yes' : 'No'}</TableCell>
        <TableCell>{jobError.source}</TableCell>
        <TableCell>{jobError.code}</TableCell>
        <TableCell>
          <JobErrorMessage
            message={jobError.message}
            exportDataURI={jobError.exportDataURI}
            importDataURI={jobError.importDataURI}
          />
        </TableCell>
        <TableCell>{jobError.createdAtAsString}</TableCell>
        <TableCell>
          {isParent &&
            jobError.retryObject &&
            jobError.retryObject.isDataEditable && (
              <Button
                variant="text"
                onClick={() => onEditRetryDataClick(jobError._retryId)}>
                Edit
              </Button>
            )}
        </TableCell>
      </TableRow>
      {expanded &&
        jobError.similarErrors &&
        jobError.similarErrors.map(je => (
          <JobErrorDetail key={jobError._id} isParent={false} jobError={je} />
        ))}
    </Fragment>
  );
}
