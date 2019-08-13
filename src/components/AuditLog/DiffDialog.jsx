import { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography, withStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ReactDiffViewer from 'react-diff-viewer';
import { RESOURCE_TYPE_SINGULAR_TO_LABEL } from '../../utils/constants';

@withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
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
            {`${
              RESOURCE_TYPE_SINGULAR_TO_LABEL[auditLog.resourceType]
            } Audit Log`}
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
