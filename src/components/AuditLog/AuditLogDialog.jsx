import { Component } from 'react';
// import Dialog from '@material-ui/core/Dialog';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogTitle from '@material-ui/core/DialogTitle';
// import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core';
// import CloseIcon from '../icons/CloseIcon';
import AuditLog from './index';
import ModalDialog from '../ModalDialog';

@withStyles(theme => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: 1,
  },
  dialogContent: {
    overflowX: 'auto',
  },
}))
export default class AuditLogDialog extends Component {
  render() {
    const {
      title = 'Audit Log',
      resourceType,
      resourceId,
      onClose,
    } = this.props;

    return (
      <ModalDialog handleClose={onClose} show width="xl">
        <div>{title}</div>
        <div>
          <AuditLog resourceType={resourceType} resourceId={resourceId} />
        </div>
      </ModalDialog>
    );
  }
}
