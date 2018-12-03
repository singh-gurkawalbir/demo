import { Component } from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ChangePassword from './ChangePassword';
import ChangeEmail from './ChangeEmail';
import { userProfile, userPreferences } from '../../reducers';

export const ProfilesItem = () => <Typography variant="h6">Profile</Typography>;

const mapStateToProps = state => ({
  profile: userProfile(state),
  preferences: userPreferences(state),
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
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '70%',
  },
  editRowElement: {
    display: 'inline-flex',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '70%',
  },
}))
class ProfilesComponent extends Component {
  state = {
    openPasswordModal: false,
    openEmailModal: false,
    ...this.props.profile,
    ...this.props.preferences,
  };

  handleOnChangeData = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  render() {
    const { classes, handleChangePassword } = this.props;

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
            onChange={this.handleOnChangeData}
          />

          <Button
            color="primary"
            variant="contained"
            onClick={() => this.setState({ openEmailModal: true })}>
            Edit Email
          </Button>
        </div>
        <ChangeEmail
          show={this.state.openEmailModal}
          onhandleClose={() => this.setState({ openEmailModal: false })}
          handleChangePassword={handleChangePassword}
        />
        <div className={classes.textField}>
          <InputLabel>
            Edit Password:
            <Button
              color="primary"
              variant="contained"
              onClick={() => this.setState({ openPasswordModal: true })}>
              Edit Password
            </Button>
          </InputLabel>
        </div>
        <ChangePassword
          show={this.state.openPasswordModal}
          onhandleClose={() => this.setState({ openPasswordModal: false })}
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
                onChange={this.handleOnChangeData}
                className={classes.textField}
                color="primary"
              />
            }
          />
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  null
)(ProfilesComponent);
