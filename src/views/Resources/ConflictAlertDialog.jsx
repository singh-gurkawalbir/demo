import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useMemo } from 'react';
import actions from '../../actions';
import * as selectors from '../../reducers';

const useStyles = makeStyles(theme => ({
  table: {
    paddingTop: theme.spacing(1),
    // minWidth: 700,
  },
}));

export default function ConflictAlertDialog() {
  const allResourceConflicts = useSelector(state =>
    selectors.getAllResourceConflicts(state)
  );
  const classes = useStyles();
  const dispatch = useDispatch();
  const handleClearConflict = useCallback(
    id => {
      dispatch(actions.resource.clearConflict(id));
    },
    [dispatch]
  );
  const handleConflict = useCallback(
    id => {
      dispatch(actions.resource.commitStaged(null, id));
      dispatch(actions.resource.clearConflict(id));
    },
    [dispatch]
  );
  const firstResourceConflict = useMemo(
    () =>
      allResourceConflicts &&
      allResourceConflicts.length &&
      allResourceConflicts[0],
    [allResourceConflicts]
  );

  if (!firstResourceConflict) return null;

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
          The following changes have been made to this resource. They have
          automatically been merged with your changes.
        </Typography>

        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Operation</TableCell>
              <TableCell>Field</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {firstResourceConflict &&
              firstResourceConflict.conflict &&
              firstResourceConflict.conflict.map(p => (
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
      </DialogContent>
      <DialogActions>
        <Button
          data-test="cancelAndReview"
          variant="contained"
          onClick={() => {
            handleClearConflict(firstResourceConflict.resourceId);
          }}>
          Cancel and Review
        </Button>
        <Button
          data-test="completeCommit"
          variant="contained"
          onClick={() => {
            handleConflict(firstResourceConflict.resourceId);
          }}
          color="secondary">
          Complete Commit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
