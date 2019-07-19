import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { useState, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../actions';
import ChildJobDetail from './ChildJobDetail';
import { JOB_STATUS } from '../../utils/constants';
import JobStatus from './JobStatus';
import { getPages, getSuccess } from './util';

const styles = theme => ({
  icon: {
    margin: theme.spacing.double,
  },
});

function JobDetail({ job, onSelectChange }) {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [selectedJobIds, setSelectedJobIds] = useState([]);
  const allChildsSelected =
    selectedJobIds.length > 0 &&
    job.children &&
    job.children.filter(j => j.numError > 0).length === selectedJobIds.length;

  function handleExpandCollapseClick() {
    setExpanded(!expanded);

    if (!expanded && (!job.children || !job.children.length)) {
      dispatch(actions.job.requestFamily({ jobId: job._id }));
    }
  }

  function handleSelectChange(event) {
    const { checked } = event.target;

    if (checked && !expanded) {
      handleExpandCollapseClick();
    }

    setIsSelected(checked);
    onSelectChange(checked, job._id);
  }

  function handleChildSelectChange(selected, jobId) {
    let jobIds = [...selectedJobIds];

    if (selected) {
      jobIds.push(jobId);
    } else {
      const index = jobIds.indexOf(jobId);

      if (index > -1) {
        jobIds = [...jobIds.slice(0, index), ...jobIds.slice(index + 1)];
      }

      setIsSelected(false);
    }

    setSelectedJobIds(jobIds);
    onSelectChange(selected, jobId);
  }

  return (
    <Fragment>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            disabled={!(job.retriable || job.numError)}
            checked={isSelected || allChildsSelected}
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
        <TableCell>Actions</TableCell>
      </TableRow>
      {expanded &&
        job.children &&
        job.children.map(cJob => (
          <ChildJobDetail
            key={cJob._id}
            job={cJob}
            parentJob={job}
            onSelectChange={handleChildSelectChange}
            parentJobSelected={isSelected}
            selectedJobIds={selectedJobIds}
          />
        ))}
    </Fragment>
  );
}

export default withStyles(styles)(JobDetail);
