import React, { } from 'react';
import { makeStyles, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import clsx from 'clsx';
import JobDetail from './JobDetail';
import HeaderWithHelpText from '../../ResourceTable/commonCells/HeaderWithHelpText';
import { JobDetailsStyles } from '../ChildJobDetail';

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 700,
    position: 'relative',
  },
  name: {
    wordBreak: 'break-word',
    [theme.breakpoints.down('md')]: {
      wordBreak: 'normal',
    },
  },
  started: {
    width: '11.5%',
    whiteSpace: 'nowrap',
  },
  errorWrapper: {
    textAlign: 'left',
  },
}));

export default function JobTable({
  jobsInCurrentPage,
}) {
  const classes = JobDetailsStyles();
  const jobDetailsClasses = useStyles();

  return (
    <>
      <Table className={clsx(classes.table, jobDetailsClasses.table)}>
        <TableHead>
          <TableRow>
            <TableCell className={clsx(classes.name, jobDetailsClasses.name)}> <HeaderWithHelpText title="Flow" helpKey="runHistory.flow" /></TableCell>
            <TableCell className={classes.status}><HeaderWithHelpText title="Status" helpKey="runHistory.status" /></TableCell>
            <TableCell className={classes.duration}>Duration</TableCell>
            <TableCell className={clsx(classes.started, jobDetailsClasses.started)}>Started</TableCell>
            <TableCell className={classes.completed}>Completed</TableCell>
            <TableCell className={classes.success}>Success</TableCell>
            <TableCell className={classes.ignore}>Ignored</TableCell>
            <TableCell className={clsx(classes.error, jobDetailsClasses.errorWrapper)}><HeaderWithHelpText title="Errors" helpKey="runHistory.errors" /></TableCell>
            <TableCell className={classes.pages}>Pages</TableCell>
            <TableCell className={classes.actions}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody >
          {jobsInCurrentPage.map(job => (
            <JobDetail
              key={job._id}
              job={job}
            />
          ))}
        </TableBody>
      </Table>
    </>
  );
}
