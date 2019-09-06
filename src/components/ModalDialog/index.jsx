import { React, Component, Fragment } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { Button } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '../icons/CloseIcon';

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
  actionButton: {
    float: 'right',
    textTransform: 'inherit',
  },
  iconButton: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1) + 2,
    padding: theme.spacing(1) - 3,
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
    const {
      classes,
      show,
      handleClose,
      actionLabel,
      actionHandler,
    } = this.props;

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
                  <CloseIcon />
                </IconButton>
              )}
              {!handleClose && actionHandler && (
                <Button
                  className={classes.actionButton}
                  onClick={actionHandler}>
                  {actionLabel}
                </Button>
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
