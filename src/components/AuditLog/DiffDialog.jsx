import { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography, withStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ReactDiffViewer from 'react-diff-viewer';

@withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing.double,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500],
  },
}))
export default class DiffDialog extends Component {
  render() {
    const { classes, auditLog, onCancelClick } = this.props;

    return (
      <Dialog open maxWidth={false}>
        <DialogTitle disableTypography className={classes.root}>
          <Typography variant="h6">
            {`${auditLog.resourceType} Audit Log`}
          </Typography>
          <Typography>{`Field: ${auditLog.fieldChange.fieldPath}`}</Typography>
          <IconButton
            aria-label="Close"
            className={classes.closeButton}
            onClick={onCancelClick}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ReactDiffViewer
            hideLineNumbers
            oldValue={JSON.stringify(auditLog.fieldChange.oldValue, null, '  ')}
            newValue={JSON.stringify(auditLog.fieldChange.newValue, null, '  ')}
          />
        </DialogContent>
      </Dialog>
    );
  }
}
