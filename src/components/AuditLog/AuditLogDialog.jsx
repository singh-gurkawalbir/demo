import { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core';
import AuditLog from './index';

@withStyles(theme => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: '1px',
  },
  dialogContent: {
    overflowX: 'auto',
  },
}))
export default class AuditLogDialog extends Component {
  render() {
    const {
      classes,
      title = 'Audit Log',
      resourceType,
      resourceId,
      onClose,
    } = this.props;

    return (
      <Dialog open maxWidth="lg">
        <DialogTitle>
          {title}
          {onClose ? (
            <IconButton
              data-test="closeAuditDialog"
              aria-label="Close"
              className={classes.closeButton}
              onClick={onClose}>
              <CloseIcon />
            </IconButton>
          ) : null}
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <AuditLog resourceType={resourceType} resourceId={resourceId} />
        </DialogContent>
      </Dialog>
    );
  }
}
