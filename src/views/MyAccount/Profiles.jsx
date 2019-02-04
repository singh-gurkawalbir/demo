import { Component } from 'react';
import { connect } from 'react-redux';
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
    margin: theme.spacing.unit,
  },
  submit: {
    marginLeft: 'auto',
    marginRight: ' auto',
  },
  editableFields: {
    paddingTop: theme.spacing.unit,
    textAlign: 'center',
    maxWidth: 500,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  relatedContent: {
    textDecoration: 'none',
  },
  textField: {
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit,
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
  editEmailButton: {
    flex: 1,
    display: 'inline-block',
    height: '50%',
    width: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
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
        />
        <div className={classes.editRowElement}>
          <TextField
            id="email"
            label="Email"
            type="email"
            margin="normal"
            value={this.state.email}
            className={classes.textField}
            disabled
          />

          <Button
            color="secondary"
            variant="contained"
            className={classes.editEmailButton}
            onClick={() => this.handleOpenModal('openEmailModal')}>
            Edit Email
          </Button>
        </div>
        <ChangeEmail
          show={this.state.openEmailModal}
          onhandleClose={() => this.handleCloseModal('openEmailModal')}
          handleChangePassword={handleChangePassword}
        />
        <div className={classes.textField}>
          <InputLabel>
            Edit Password:
            <Button
              color="secondary"
              variant="contained"
              onClick={() => this.handleOpenModal('openPasswordModal')}>
              Edit Password
            </Button>
          </InputLabel>
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
        />
        <TextField
          id="phone"
          label="Phone Number"
          margin="normal"
          value={this.state.phone}
          className={classes.textField}
          onChange={this.handleOnChangeData}
        />
        <TextField
          id="timezone"
          label="Time Zone"
          margin="normal"
          value={this.state.timezone}
          className={classes.textField}
          onChange={this.handleOnChangeData}
        />
        <TextField
          id="dateFormat"
          label="Date Format"
          margin="normal"
          value={this.state.dateFormat}
          className={classes.textField}
          onChange={this.handleOnChangeData}
        />
        <TextField
          id="timeFormat"
          label="Time Format"
          margin="normal"
          value={this.state.timeFormat}
          className={classes.textField}
          onChange={this.handleOnChangeData}
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

        <Button
          variant="contained"
          color="primary"
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
