import { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core';
import AuditLog from './index';

@withStyles(theme => ({
  title: {
    margin: 0,
    padding: theme.spacing.double,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing,
    top: theme.spacing,
  },
}))
export default class AuditLogDialog extends Component {
  render() {
    const {
      classes,
      title = 'Audit Log',
      width = '70vw',
      resourceType,
      resourceId,
      onClose,
    } = this.props;

    return (
      <Dialog open maxWidth={false}>
        <DialogTitle className={classes.title}>
          <Typography variant="h6">{title}</Typography>
          {onClose ? (
            <IconButton
              aria-label="Close"
              className={classes.closeButton}
              onClick={onClose}>
              <CloseIcon />
            </IconButton>
          ) : null}
        </DialogTitle>
        <DialogContent style={{ width }}>
          <AuditLog resourceType={resourceType} resourceId={resourceId} />
        </DialogContent>
      </Dialog>
    );
  }
}
