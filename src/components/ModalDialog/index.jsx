import { React, Component, Fragment } from 'react';
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
    padding: theme.spacing(4),
    minWidth: 500,
  },
  modalContent: {
    margin: theme.spacing(0, 1),
    padding: theme.spacing(1, 2),
    width: '100',
  },
  iconButton: {
    position: 'absolute',
    top: '5px',
    right: '10px',
  },
  actions: {
    '&:last-child': {
      marginRight: theme.spacing(1),
    },
    // '& *': { marginRight: theme.spacing(1) },
    // margin: theme.spacing(1, 1, 2, 0),
  },
}))
export default class ModalDialog extends Component {
  render() {
    const { classes, show, handleClose } = this.props;

    return (
      <div>
        <Dialog open={show} className={classes.modalDialog} maxWidth="lg">
          {this.props.children[0] && (
            <DialogTitle className={classes.modalTitle}>
              {this.props.children[0]}
              {handleClose && (
                <IconButton
                  onClick={handleClose}
                  className={classes.iconButton}
                  autoFocus>
                  <SvgIcon>
                    <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
                  </SvgIcon>
                </IconButton>
              )}
            </DialogTitle>
          )}
          {this.props.children[1] && (
            <Fragment>
              <Divider />
              <DialogContent className={classes.modalContent}>
                {this.props.children[1]}
              </DialogContent>
            </Fragment>
          )}
          {this.props.children[2] && (
            <Fragment>
              <Divider />
              <DialogActions className={classes.actions}>
                {this.props.children[2]}
              </DialogActions>
            </Fragment>
          )}
        </Dialog>
      </div>
    );
  }
}
