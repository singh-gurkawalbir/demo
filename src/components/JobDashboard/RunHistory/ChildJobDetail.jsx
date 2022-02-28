import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import { makeStyles } from '@material-ui/core/styles';
import TableRow from '@material-ui/core/TableRow';
import { useSelector } from 'react-redux';
import { selectors } from '../../../reducers';
import JobStatusWithTag from '../../ResourceTable/runHistory/JobStatusWithTag';
import { getJobDuration } from '../../../utils/errorManagement';
import CeligoTimeAgo from '../../CeligoTimeAgo';
import {
  RESOURCE_TYPE_SINGULAR_TO_PLURAL,
} from '../../../constants/resource';
import ErrorCell from './ErrorCell';

const useStyles = makeStyles(theme => ({
  checkAction: {
    paddingLeft: 58,
  },
  name: {
    width: '18.15%',
    paddingLeft: theme.spacing(6),
  },
  status: {
    width: '10.15',
  },
  success: {
    width: '9%',
    textAlign: 'right',
  },
  ignore: {
    width: '7.5%',
    textAlign: 'right',
  },
  error: {
    width: '10.15%',
    textAlign: 'center',
  },
  resolved: {
    width: '9%',
    textAlign: 'right',
  },
  pages: {
    width: '7.5%',
    textAlign: 'right',
  },
  duration: {
    width: '9%',
    textAlign: 'right',
  },
  completed: {
    width: '11.5%',
    whiteSpace: 'nowrap',
  },
  started: {
    width: '11.5%',
    whiteSpace: 'nowrap',
  },
  actions: {
    width: '7.5%',
    textAlign: 'center',
  },
  checkActionBorder: {
    paddingLeft: 55,
    borderLeft: `5px solid ${theme.palette.primary.main}`,
  },
  errorCount: {
    color: theme.palette.error.dark,
  },
}));

export default function ChildJobDetail({
  job,
  parentJob,
}) {
  const classes = useStyles();
  const resource = useSelector(state => selectors.resource(state, RESOURCE_TYPE_SINGULAR_TO_PLURAL[job.type], job._importId || job._exportId));

  const jobType = job.type === 'export' ? 'Export' : 'Import';

  return (
    <TableRow>
      <TableCell className={classes.name}>{job.name || resource?.name || jobType}</TableCell>
      <TableCell className={classes.status}>
        <JobStatusWithTag job={job} />
      </TableCell>
      <TableCell className={classes.duration}>{getJobDuration(job)}</TableCell>
      <TableCell className={classes.started}><CeligoTimeAgo date={job.startedAt} /></TableCell>
      <TableCell className={classes.completed}><CeligoTimeAgo date={job.endedAt} /></TableCell>
      <TableCell className={classes.success}>{job.numSuccess}</TableCell>

      <TableCell className={classes.ignore}>{job.numIgnore}</TableCell>
      <TableCell className={classes.error}><ErrorCell job={job} parentJob={parentJob} /></TableCell>
      <TableCell className={classes.pages}>{job.type === 'export' ? job.numPagesGenerated || job.numPagesProcessed : job.numPagesProcessed}</TableCell>
      <TableCell />

    </TableRow>
  );
}
