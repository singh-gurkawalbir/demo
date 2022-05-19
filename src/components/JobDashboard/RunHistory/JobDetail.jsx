import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
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
import { JobDetailsStyles } from '../ChildJobDetail';

const useStyles = makeStyles(() => ({
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
  started: {
    width: '11.5%',
    whiteSpace: 'nowrap',
  },
  actions: {
    width: '7.5%',
    textAlign: 'center',
  },
  errorWrapper: {
    textAlign: 'left',
  },
}));

export default function JobDetail({
  job,
}) {
  const classes = JobDetailsStyles();
  const jobDetailsClasses = useStyles();
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
          <ul className={clsx(classes.checkAction, jobDetailsClasses.checkAction)}>
            <li>
              <IconButton
                data-test="toggleJobDetail"
                className={clsx(classes.moreIcon, jobDetailsClasses.moreIcon)}
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
        <TableCell className={clsx(classes.started, jobDetailsClasses.started)}><CeligoTimeAgo date={job.startedAt} /></TableCell>
        <TableCell className={classes.completed}><CeligoTimeAgo date={job.endedAt} /></TableCell>
        <TableCell className={classes.success}>{job.numSuccess}</TableCell>

        <TableCell className={classes.ignore}>{job.numIgnore}</TableCell>
        <TableCell className={clsx(jobDetailsClasses.error, classes.errorWrapper)}>{getTextAfterCount('error', job.numError)}</TableCell>
        <TableCell className={classes.pages}>{job.numPagesGenerated}</TableCell>
        <TableCell className={clsx(classes.actions, jobDetailsClasses.actions)}>
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
