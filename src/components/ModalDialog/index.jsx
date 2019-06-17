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
    padding: theme.spacing.quad,
    minWidth: 500,
  },
  modalContent: {
    margin: `0 ${theme.spacing.unit}px`,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    width: '100',
  },
  iconButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
  },
  actions: {
    '& *': { marginRight: theme.spacing.unit },
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit, // theme.spacing.unit / 2,
    marginBottom: theme.spacing.double,
  },
}))
export default class ModalDialog extends Component {
  render() {
    const { classes, show, handleClose } = this.props;

    return (
      <div>
        <Dialog open={show} className={classes.modalDialog}>
          <DialogTitle>
            {this.props.children[0]}

            <IconButton
              onClick={handleClose}
              color="primary"
              className={classes.iconButton}
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
          <DialogActions className={classes.actions}>
            {this.props.children[2]}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
