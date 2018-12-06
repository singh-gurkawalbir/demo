import { React, Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

@withStyles(theme => ({
  modalDialog: {
    padding: 4 * theme.spacing.unit,
    minWidth: 500,
  },
  modalContent: {
    width: '100',
  },
}))
export default class ModalDialog extends Component {
  render() {
    // const { open } = this.state;
    const { classes, show, handleClose } = this.props;

    // if (!show) return null;

    return (
      <div>
        <Dialog
          open={show}
          className={classes.modalDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">
            {this.props.children[0]}

            <IconButton
              aria-label="Delete"
              onClick={handleClose}
              color="primary"
              style={{ position: 'absolute', top: '10px', right: '10px' }}
              autoFocus>
              <SvgIcon>
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
              </SvgIcon>
            </IconButton>
          </DialogTitle>
          <Divider />
          <DialogContent className={classes.modalContent}>
            {this.props.children[1]}
          </DialogContent>
          <Divider />
          <DialogActions>{this.props.children[2]}</DialogActions>
        </Dialog>
      </div>
    );
  }
}
