import { Component, Fragment } from 'react';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import { Button, Typography } from '@material-ui/core';
import actions from '../../actions';
import ModalDialog from '../../components/ModalDialog';
import {
  changePasswordFailure,
  changePasswordSuccess,
  changePasswordMsg,
} from '../../reducers';

const mapDispatchToProps = dispatch => ({
  changePassword: message => {
    dispatch(actions.auth.changePassword(message));
  },
});
const mapStateToProps = state => ({
  error: changePasswordFailure(state),
  success: changePasswordSuccess(state),
  message: changePasswordMsg(state),
});

class ChangePassword extends Component {
  handleOnSubmit = e => {
    e.preventDefault();
    const payload = {
      currentPassword: e.target.currentPassword.value,
      newPassword: e.target.newPassword.value,
    };

    this.props.changePassword(payload);
  };
  render() {
    const { show, onhandleClose, error, success, message } = this.props;

    return (
      <ModalDialog show={show} onClose={onhandleClose}>
        <span>Change Password</span>
        {success ? (
          <span>{message}</span>
        ) : (
          <div>
            <Typography variant="body2">
              {`Please note that clicking 'Change Password' will sign you out of the
          application, and you will need to sign back in with your new password.`}
            </Typography>
            <form id="changePasswordForm" onSubmit={this.handleOnSubmit}>
              <TextField
                id="currentPassword"
                label="Current Password"
                margin="normal"
                type="password"
                variant="filled"
                fullWidth
              />
              <br />
              <TextField
                id="newPassword"
                label="New Password"
                margin="normal"
                type="password"
                variant="filled"
                fullWidth
              />
            </form>
          </div>
        )}

        {success ? (
          <span />
        ) : (
          <Fragment>
            {error && (
              <Typography variant="body2" component="span" color="error">
                {message}
              </Typography>
            )}
            <Button
              data-test="changePassword"
              variant="outlined"
              color="primary"
              type="submit"
              form="changePasswordForm"
              value="Submit">
              Change password
            </Button>
          </Fragment>
        )}
      </ModalDialog>
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps,mapDispatchToProps)(ChangePassword);
