import React from 'react';
import TableCell from '@mui/material/TableCell';
import makeStyles from '@mui/styles/makeStyles';
import TableRow from '@mui/material/TableRow';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { selectors } from '../../../reducers';
import JobStatusWithTag from '../../ResourceTable/runHistory/JobStatusWithTag';
import { getJobDuration } from '../../../utils/errorManagement';
import CeligoTimeAgo from '../../CeligoTimeAgo';
import {
  RESOURCE_TYPE_SINGULAR_TO_PLURAL,
} from '../../../constants/resource';
import ErrorCell from './ErrorCell';
import { JobDetailsStyles } from '../ChildJobDetail';

const useStyles = makeStyles(theme => ({
  name: {
    paddingLeft: theme.spacing(6),
  },
  completed: {
    width: '11.5%',
    whiteSpace: 'nowrap',
  },
  started: {
    width: '11.5%',
    whiteSpace: 'nowrap',
  },
  errorWrapper: {
    textAlign: 'left',
  },
}));

export default function ChildJobDetail({
  job,
}) {
  const classes = JobDetailsStyles();
  const jobDetailsClasses = useStyles();
  const resource = useSelector(state => selectors.resource(state, RESOURCE_TYPE_SINGULAR_TO_PLURAL[job.type], job._expOrImpId || job._importId || job._exportId));

  const jobType = job.type === 'export' ? 'Export' : 'Import';

  return (
    <TableRow>
      <TableCell className={clsx(classes.name, jobDetailsClasses.name)}>{job.name || resource?.name || jobType}</TableCell>
      <TableCell className={classes.status}>
        <JobStatusWithTag job={job} />
      </TableCell>
      <TableCell className={classes.duration}>{getJobDuration(job)}</TableCell>
      <TableCell className={clsx(classes.started, jobDetailsClasses.started)}><CeligoTimeAgo date={job.startedAt} /></TableCell>
      <TableCell className={clsx(classes.completed, jobDetailsClasses.completed)}><CeligoTimeAgo date={job.endedAt} /></TableCell>
      <TableCell className={classes.success}>{job.numSuccess}</TableCell>

      <TableCell className={classes.ignore}>{job.numIgnore}</TableCell>
      <TableCell className={clsx(jobDetailsClasses.error, classes.errorWrapper)}><ErrorCell job={job} /></TableCell>
      <TableCell className={classes.pages}>{job.type === 'export' ? job.numPagesGenerated || job.numPagesProcessed : job.numPagesProcessed}</TableCell>
      <TableCell />

    </TableRow>
  );
}
