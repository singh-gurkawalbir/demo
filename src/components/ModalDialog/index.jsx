import { React, Component, Fragment } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { Button, Typography } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '../icons/CloseIcon';

@withStyles(theme => ({
  actionButton: {
    float: 'right',
    textTransform: 'inherit',
  },
  iconButton: {
    position: 'absolute',
    top: theme.spacing(1) + 4,
    right: theme.spacing(2) + 2,
    padding: theme.spacing(1) - 3,
  },
  actions: {
    justifyContent: 'flex-start',
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
      width,
    } = this.props;

    return (
      <div>
        <Dialog open={show} maxWidth={width}>
          {this.props.children[0] && (
            <DialogTitle className={classes.modalTitle} disableTypography>
              <Typography variant="h3">{this.props.children[0]}</Typography>
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
              <DialogContent className={classes.modalContent}>
                {this.props.children[1]}
              </DialogContent>
            </Fragment>
          )}
          {this.props.children[2] && (
            <Fragment>
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
