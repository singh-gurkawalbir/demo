import React, { } from 'react';
import { makeStyles, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import JobDetail from './JobDetail';
import HeaderWithHelpText from '../../ResourceTable/commonCells/HeaderWithHelpText';

const useStyles = makeStyles(theme => ({
  root: {
    width: '98%',
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    overflowX: 'auto',
  },
  title: {
    marginBottom: theme.spacing(2),
    float: 'left',
  },
  table: {
    minWidth: 700,
    position: 'relative',
  },
  checkFlow: {
    paddingLeft: 40,
  },
  name: {
    width: '18.15%',
    wordBreak: 'break-word',
    [theme.breakpoints.down('md')]: {
      wordBreak: 'normal',
    },
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
  started: {
    width: '11.5%',
    whiteSpace: 'no-wrap',
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
    whiteSpace: 'no-wrap',
  },
  actions: {
    width: '7.5%',
    textAlign: 'center',
  },
  tableContainer: {
    overflowX: 'auto',
    overflowY: 'hidden',
  },
}));

export default function JobTable({
  jobsInCurrentPage,
}) {
  const classes = useStyles();

  return (
    <>
      <div className={classes.tableContainer}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.name}> <HeaderWithHelpText title="Flow" helpKey="runHistory.flow" /></TableCell>
              <TableCell className={classes.status}>Status</TableCell>
              <TableCell className={classes.duration}>Duration</TableCell>
              <TableCell className={classes.started}>Started</TableCell>
              <TableCell className={classes.completed}>Completed</TableCell>
              <TableCell className={classes.success}>Success</TableCell>
              <TableCell className={classes.ignore}>Ignored</TableCell>
              <TableCell className={classes.error}><HeaderWithHelpText title="Errors" helpKey="runHistory.errors" /></TableCell>
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
      </div>
    </>
  );
}
