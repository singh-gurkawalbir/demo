import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
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

@hot(module)
@withStyles(theme => ({
  table: {
    paddingTop: theme.spacing.unit,
    // minWidth: 700,
  },
}))
export default class ConflictAlertDialog extends Component {
  render() {
    const { classes, conflict, handleCommit, handleCancel } = this.props;

    return (
      <Dialog
        open
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="sm"
        aria-labelledby="confirmation-dialog-title">
        <DialogTitle id="confirmation-dialog-title">
          Change Notification
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
              {conflict &&
                conflict.map(p => (
                  <TableRow key={p.path}>
                    <TableCell component="th" scope="row">
                      {p.op}
                    </TableCell>
                    <TableCell>{p.path}</TableCell>
                    <TableCell>{p.value}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel and Review
          </Button>
          <Button onClick={handleCommit} color="secondary">
            Complete Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
