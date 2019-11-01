import { Component, Fragment } from 'react';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import { Button, Typography } from '@material-ui/core';
import actions from '../../actions';
import ModalDialog from '../../components/ModalDialog';
import {
  changeEmailFailure,
  changeEmailSuccess,
  changeEmailMsg,
} from '../../reducers';

const mapDispatchToProps = dispatch => ({
  changeEmail: message => {
    dispatch(actions.auth.changeEmail(message));
  },
});
const mapStateToProps = state => ({
  error: changeEmailFailure(state),
  success: changeEmailSuccess(state),
  message: changeEmailMsg(state),
});

class ChangeEmail extends Component {
  handleOnSubmit = e => {
    e.preventDefault();
    const payload = {
      newEmail: e.target.newEmail.value,
      password: e.target.password.value,
    };

    this.props.changeEmail(payload);
  };

  render() {
    const { show, onhandleClose, error, success, message } = this.props;

    return (
      <ModalDialog show={show} handleClose={onhandleClose}>
        Change Email
        {success ? (
          <Typography variant="body2">{message}</Typography>
        ) : (
          <div>
            <form id="changeEmailForm" onSubmit={this.handleOnSubmit}>
              <TextField
                id="newEmail"
                label="New Email"
                margin="normal"
                fullWidth
                variant="filled"
              />
              <br />

              <TextField
                id="password"
                label="Password"
                margin="normal"
                type="password"
                variant="filled"
                fullWidth
              />
            </form>
            <Typography variant="body2">
              Note: we require your current password again to help safeguard
              your integrator.io account.
            </Typography>
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
              data-test="changeEmail"
              variant="outlined"
              color="primary"
              type="submit"
              form="changeEmailForm"
              value="Submit">
              Change email
            </Button>
          </Fragment>
        )}
      </ModalDialog>
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps,mapDispatchToProps)(ChangeEmail);
