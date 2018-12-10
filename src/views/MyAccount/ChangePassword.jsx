import { Component, Fragment } from 'react';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import actions from '../../actions';
import ModalDialog from './ModalDialog';
import { changePasswordFailure, changePasswordSuccess } from '../../reducers';

const mapDispatchToProps = dispatch => ({
  changePassword: message => {
    dispatch(actions.auth.changePassword(message));
  },
});
const mapStateToProps = state => ({
  error: changePasswordFailure(state),
  success: changePasswordSuccess(state),
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
    const { show, onhandleClose, error, success } = this.props;

    return (
      <ModalDialog show={show} handleClose={onhandleClose}>
        <span>Change Password</span>
        {success ? (
          <span>{success}</span>
        ) : (
          <span>
            {`Please note that clicking 'Change Password' will sign you out of the
          application, and you will need to sign back in with your new password.`}
            <form id="changePasswordForm" onSubmit={this.handleOnSubmit}>
              <TextField
                id="currentPassword"
                label="Current Password"
                margin="normal"
              />
              <br />
              <TextField
                id="newPassword"
                label="New Password"
                margin="normal"
              />
            </form>
          </span>
        )}

        {success ? (
          <span />
        ) : (
          <Fragment>
            {error && <span>{error}</span>}
            <Button
              variant="contained"
              color="primary"
              type="submit"
              form="changePasswordForm"
              value="Submit">
              change password
            </Button>
          </Fragment>
        )}
      </ModalDialog>
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps,mapDispatchToProps)(ChangePassword);
