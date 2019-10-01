import { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Button } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ChangePassword from './ChangePassword';
import ChangeEmail from './ChangeEmail';
import actions from '../../actions';
import { userProfilePreferencesProps } from '../../reducers';

export const ProfilesItem = () => <Typography variant="h6">Profile</Typography>;

const mapStateToProps = state => ({
  userProfilePreferencesProps: userProfilePreferencesProps(state),
});
const mapDispatchToProps = dispatch => ({
  clearComms: () => dispatch(actions.clearComms()),
  persistProfilesPreferencesData: profilePreferencePayload => {
    const completePayloadCopy = { ...profilePreferencePayload };
    const { timeFormat, dateFormat } = completePayloadCopy;
    const preferencesPayload = { timeFormat, dateFormat };

    dispatch(actions.user.preferences.update(preferencesPayload));
    // deleting preferenecs from completePayloadCopy
    delete completePayloadCopy.timeFormat;
    delete completePayloadCopy.dateFormat;
    dispatch(actions.user.profile.update(completePayloadCopy));
  },
});

@withStyles(theme => ({
  snackbar: {
    margin: theme.spacing(1),
  },
  submit: {
    marginLeft: 'auto',
    marginRight: ' auto',
  },
  editableFields: {
    paddingTop: theme.spacing(1),
    textAlign: 'center',
    maxWidth: 500,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  relatedContent: {
    textDecoration: 'none',
  },
  textField: {
    flex: 1,
    width: '70%',
  },
  editRowElement: {
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    justifyContent: 'flex-start' /* center horizontally */,
    alignItems: 'center' /* center vertically */,
    height: '50%',
    width: '70%',
  },
  emailField: {
    flexGrow: 4,
  },
  editEmailButton: {
    marginLeft: theme.spacing(1),
  },
}))
class ProfilesComponent extends Component {
  state = {
    openPasswordModal: false,
    openEmailModal: false,
    ...this.props.userProfilePreferencesProps,
  };

  checkSaveEnabled = userDetails => {
    if (userDetails === undefined) return false;
    const res = Object.keys(userDetails)
      .filter(prop => prop !== '_id')
      .reduce(
        (acc, prop) => acc || userDetails[prop] !== this.state[prop],
        false
      );

    return res;
  };
  handleOnSubmit = () => {
    const copyState = { ...this.state };

    delete copyState.openPasswordModal;
    delete copyState.openEmailModal;

    this.props.persistProfilesPreferencesData(copyState);
  };
  handleOnChangeData = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
  handleOnChangeDataCheckbox = e => {
    this.setState({ [e.target.id]: e.target.checked });
  };
  handleOpenModal = modalKey => {
    this.props.clearComms();
    this.setState({ [modalKey]: true });
  };

  handleCloseModal = modalKey => {
    this.setState({ [modalKey]: false });
  };
  render() {
    const {
      classes,
      handleChangePassword,
      userProfilePreferencesProps,
    } = this.props;
    const saveButtonEnabled = this.checkSaveEnabled(
      userProfilePreferencesProps
    );

    return (
      <div>
        <Typography variant="h6">Profile</Typography>
        <TextField
          id="name"
          label="Name"
          margin="normal"
          value={this.state.name}
          className={classes.textField}
          onChange={this.handleOnChangeData}
          variant="filled"
        />
        <div className={classes.editRowElement}>
          <TextField
            id="email"
            label="Email"
            type="email"
            margin="normal"
            value={this.state.email}
            className={classNames(classes.textField, classes.emailField)}
            disabled
            variant="filled"
          />
          <div>
            <Button
              color="primary"
              variant="contained"
              className={classes.editEmailButton}
              onClick={() => this.handleOpenModal('openEmailModal')}>
              Edit Email
            </Button>
          </div>
        </div>
        <ChangeEmail
          show={this.state.openEmailModal}
          onhandleClose={() => this.handleCloseModal('openEmailModal')}
          handleChangePassword={handleChangePassword}
        />
        <div className={classes.editRowElement}>
          <div>
            <InputLabel>
              Edit Password:
              <Button
                color="primary"
                variant="contained"
                style={{ marginLeft: '10px' }}
                onClick={() => this.handleOpenModal('openPasswordModal')}>
                Edit Password
              </Button>
            </InputLabel>
          </div>
        </div>
        <ChangePassword
          show={this.state.openPasswordModal}
          onhandleClose={() => this.handleCloseModal('openPasswordModal')}
          handleChangePassword={handleChangePassword}
        />
        <TextField
          id="company"
          label="Company"
          margin="normal"
          value={this.state.company}
          className={classes.textField}
          onChange={this.handleOnChangeData}
          variant="filled"
        />
        <TextField
          id="phone"
          label="Phone Number"
          margin="normal"
          value={this.state.phone}
          className={classes.textField}
          onChange={this.handleOnChangeData}
          variant="filled"
        />
        <TextField
          id="timezone"
          label="Time Zone"
          margin="normal"
          value={this.state.timezone}
          className={classes.textField}
          onChange={this.handleOnChangeData}
          variant="filled"
        />
        <TextField
          id="dateFormat"
          label="Date Format"
          margin="normal"
          value={this.state.dateFormat}
          className={classes.textField}
          onChange={this.handleOnChangeData}
          variant="filled"
        />
        <TextField
          id="timeFormat"
          label="Time Format"
          margin="normal"
          value={this.state.timeFormat}
          className={classes.textField}
          onChange={this.handleOnChangeData}
          variant="filled"
        />
        <div>
          <FormControlLabel
            label="Developer Mode"
            labelPlacement="start"
            control={
              <Checkbox
                id="developer"
                label="Developer Mode"
                margin="normal"
                checked={this.state.developer}
                onClick={this.handleOnChangeDataCheckbox}
                className={classes.textField}
                color="primary"
              />
            }
          />
        </div>
        <Divider />
        <br />
        <Button
          variant="contained"
          color="secondary"
          onClick={this.handleOnSubmit}
          disabled={!saveButtonEnabled}>
          save
        </Button>
      </div>
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps,mapDispatchToProps)(ProfilesComponent);
