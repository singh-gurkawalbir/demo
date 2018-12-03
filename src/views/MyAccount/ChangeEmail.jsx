import { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import actions from '../../actions';
import ModalDialog from './ModalDialog';

const mapDispatchToProps = dispatch => ({
  changePassword: message => {
    dispatch(actions.auth.changePassword(message));
  },
});

class ChangeEmail extends Component {
  handleOnSubmit = e => {
    e.preventDefault();
    const payload = JSON.stringify({
      currentPassword: e.target.currentPassword.value,
      newPassword: e.target.newPassword.value,
    });

    this.props.changePassword(payload);
  };
  render() {
    const { show, onhandleClose } = this.props;

    return (
      <ModalDialog show={show} handleClose={onhandleClose}>
        <span>Change Email</span>
        <span>
          <form id="myForm" onSubmit={this.handleOnSubmit}>
            <TextField id="newEmail" label="New Email" margin="normal" />
            <br />

            <TextField id="password" label="Password" margin="normal" />
          </form>
          {`Note: we require your current password again to help safeguard your integrator.io account.`}
        </span>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          form="myForm"
          value="Submit">
          change email
        </Button>
      </ModalDialog>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(ChangeEmail);
