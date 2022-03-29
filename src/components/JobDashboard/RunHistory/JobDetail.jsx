import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import ChildJobDetail from './ChildJobDetail';
import JobStatusWithTag from '../../ResourceTable/runHistory/JobStatusWithTag';
import JobActionsMenu from './JobActionsMenu';
import Spinner from '../../Spinner';
import ArrowDownIcon from '../../icons/ArrowDownIcon';
import ArrowUpIcon from '../../icons/ArrowUpIcon';
import { getJobDuration } from '../../../utils/errorManagement';
import CeligoTimeAgo from '../../CeligoTimeAgo';
import { getTextAfterCount } from '../../../utils/string';

const useStyles = makeStyles(theme => ({
  checkAction: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    justifyContent: 'flex-start',
    '& li': {
      float: 'left',
      '&:empty': {
        marginLeft: 22,
      },
    },
  },
  moreIcon: {
    padding: 0,
  },
  checkIcon: {
    padding: 0,
  },
  name: {
    width: '18.15%',
  },
  status: {
    width: '10.15%',
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
    textAlign: 'left',
  },
  errorCount: {
    color: theme.palette.error.dark,
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
    paddingLeft: '13px',
    borderLeft: `5px solid ${theme.palette.primary.main}`,
  },
}));

export default function JobDetail({
  job,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const flow = useSelector(state => selectors.resource(state, 'flows', job._flowId));

  function handleExpandCollapseClick() {
    setExpanded(!expanded);

    if (!expanded && (!job.children || job.children.length === 0)) {
      dispatch(actions.errorManager.runHistory.requestFamily({ jobId: job._id }));
    }
  }

  function RowIcon({expanded, childLoaded}) {
    if (expanded && !childLoaded) {
      return <Spinner size={24} />;
    }

    return expanded ? <ArrowUpIcon /> : <ArrowDownIcon />;
  }

  return (
    <>
      <TableRow>
        <TableCell>
          <ul className={classes.checkAction}>
            <li>
              <IconButton
                data-test="toggleJobDetail"
                className={classes.moreIcon}
                onClick={handleExpandCollapseClick}>
                <RowIcon expanded={expanded && job.children} childLoaded={job.children} />
              </IconButton>
              {job.name || flow?.name || job._flowId}
            </li>
          </ul>
        </TableCell>
        <TableCell className={classes.status}>
          <JobStatusWithTag job={job} />
        </TableCell>
        <TableCell className={classes.duration}>{getJobDuration(job)}</TableCell>
        <TableCell className={classes.started}><CeligoTimeAgo date={job.startedAt} /></TableCell>
        <TableCell className={classes.completed}><CeligoTimeAgo date={job.endedAt} /></TableCell>
        <TableCell className={classes.success}>{job.numSuccess}</TableCell>

        <TableCell className={classes.ignore}>{job.numIgnore}</TableCell>
        <TableCell className={classes.error}>{getTextAfterCount('error', job.numError)}</TableCell>
        <TableCell className={classes.pages}>{job.numPagesGenerated}</TableCell>
        <TableCell className={classes.actions}>
          <JobActionsMenu
            job={job}
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
          />
        ))}
    </>
  );
}
