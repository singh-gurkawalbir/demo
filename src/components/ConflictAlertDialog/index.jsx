import React from 'react';
import { Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import makeStyles from '@mui/styles/makeStyles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useSelector } from 'react-redux';
import { selectors } from '../../reducers';
import { FilledButton } from '../Buttons';
import { message } from '../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  table: {
    paddingTop: theme.spacing(1),
  },
}));
const SingleResourceConflictsTable = ({ resourceId, conflict }) => {
  const classes = useStyles();

  return (
    <Table className={classes.table}>
      <caption>{`Resource conflict for resourceId: ${resourceId}`} </caption>
      <TableHead>
        <TableRow>
          <TableCell>Operation</TableCell>
          <TableCell>Field</TableCell>
          <TableCell>Value</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {conflict &&
          conflict.map(p => (
            <TableRow key={p.path}>
              <TableCell component="th" scope="row">
                {p.op}
              </TableCell>
              <TableCell>{p.path}</TableCell>
              <TableCell>
                {typeof p.value === 'string'
                  ? p.value
                  : JSON.stringify(p.value)}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default function ConflictAlertDialog() {
  const allResourceConflicts = useSelector(state =>
    selectors.getAllResourceConflicts(state)
  );

  if (!allResourceConflicts || !allResourceConflicts.length) return null;

  return (
    <Dialog
      open
      disableEscapeKeyDown
      maxWidth="sm"
      aria-labelledby="confirmation-dialog-title">
      <DialogTitle id="confirmation-dialog-title">
        <Typography variant="h6">Change Notification</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          {message.CHANGES_IN_RESOURCE}
        </Typography>

        {allResourceConflicts.map(r => (
          <SingleResourceConflictsTable {...r} key={r.resourceId} />
        ))}
      </DialogContent>
      <DialogActions>
        <FilledButton
          data-test="cancelAndReview"
          onClick={() => {
            window.location.reload();
          }}>
          Refresh
        </FilledButton>
      </DialogActions>
    </Dialog>
  );
}
