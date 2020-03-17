import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useSelector } from 'react-redux';
import * as selectors from '../../reducers';

const useStyles = makeStyles(theme => ({
  table: {
    paddingTop: theme.spacing(1),
    // minWidth: 700,
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
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="sm"
      aria-labelledby="confirmation-dialog-title">
      <DialogTitle id="confirmation-dialog-title" disableTypography>
        <Typography variant="h6">Change Notification</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          The following changes have been made to this resource. We have
          attempted to automatically merge these changes, but this resolution
          was not successful. Please the click the refresh button to refresh
          your browser.
        </Typography>

        {allResourceConflicts.map(r => (
          <SingleResourceConflictsTable {...r} key={r.resourceId} />
        ))}
      </DialogContent>
      <DialogActions>
        <Button
          data-test="cancelAndReview"
          variant="contained"
          onClick={() => {
            window.location.reload();
          }}>
          Refresh
        </Button>
      </DialogActions>
    </Dialog>
  );
}
