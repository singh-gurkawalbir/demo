import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import { Component } from 'react';
import { hot } from 'react-hot-loader';
import { Redirect } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import actions from '../../actions';
import {
  userProfileEmail,
  isAuthenticated,
  authenticationErrored,
} from '../../reducers';

const mapStateToProps = state => ({
  authenticated: isAuthenticated(state),
  error: authenticationErrored(state),
  userEmail: userProfileEmail(state),
});
const mapDispatchToProps = dispatch => ({
  handleAuthentication: message => {
    dispatch(actions.auth.request(message));
  },
});

@hot(module)
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
    width: '90%',
  },
}))
class SignIn extends Component {
  state = {
    email: '',
  };
  componentDidMount() {
    if (
      process.env.AUTO_LOGIN === 'true' &&
      process.env.NODE_ENV === 'development'
    ) {
      const e = {
        target: {
          email: {
            value: process.env.API_EMAIL,
          },
          password: {
            value: process.env.API_PASSWORD,
          },
        },
        preventDefault: () => {},
      };

      this.handleOnSubmit(e);
    }
  }

  handleOnChangeEmail = e => {
    this.setState({ email: e.target.value });
  };
  handleOnSubmit = e => {
    e.preventDefault();
    const payload = JSON.stringify({
      email: e.target.email.value,
      password: e.target.password.value,
    });

    this.props.handleAuthentication(payload);
  };

  render() {
    const { classes, error, authenticated, dialogOpen, userEmail } = this.props;
    const { email } = this.state;

    if (authenticated) return <Redirect to="/pg" />;

    return (
      <div className={classes.editableFields}>
        <form onSubmit={this.handleOnSubmit}>
          <TextField
            id="email"
            label="Email"
            type="email"
            rowsMax="1"
            margin="normal"
            value={dialogOpen ? userEmail : email}
            onChange={this.handleOnChangeEmail}
            className={classes.textField}
            disabled={dialogOpen}
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            rowsMax="1"
            margin="normal"
            className={classes.textField}
          />

          {error && (
            <div>
              <br />
              <Typography
                color="error"
                variant="display1"
                className={classes.margin}>
                Authentication Failure!
              </Typography>
            </div>
          )}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className={classes.submit}
            value="Submit">
            Submit
          </Button>
        </form>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
