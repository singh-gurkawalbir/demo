import { React, Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { connect } from 'react-redux';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SignIn from '../../views/SignIn';
import { isSessionExpired } from '../../reducers';

const mapStateToProps = state => ({
  dialogOpen: isSessionExpired(state),
});

class AlertDialog extends Component {
  // state = {
  //   open: true,
  // };

  // handleClose = () => {
  //   this.setState({ open: false });
  // };

  render() {
    const { dialogOpen } = this.props;

    return (
      <div>
        <Dialog
          open={dialogOpen}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">
            {'Your Session has Expired'}
            <br />
            {'Please login again'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <SignIn />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              Dismiss
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps, null)(AlertDialog);
