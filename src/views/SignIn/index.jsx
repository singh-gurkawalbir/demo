import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import { Component } from 'react';
import { hot } from 'react-hot-loader';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import ErrorIcon from '@material-ui/icons/Error';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import actions from '../../actions';
import { authParams } from '../../utils/api';
import {
  userProfileEmail,
  isAuthenticated,
  authenticationErrored,
} from '../../reducers';

const variantIcon = {
  error: ErrorIcon,
};
const styles1 = theme => ({
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});

function MySnackbarContent(props) {
  const { classes, className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      {...other}
    />
  );
}

MySnackbarContent.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);
const mapStateToProps = state => ({
  authenticated: isAuthenticated(state),
  error: authenticationErrored(state),
  userEmail: userProfileEmail(state),
  // isLoadingProfile: isLoadingProfile(state),
});
// TODO:
const mapDispatchToProps = dispatch => ({
  handleAuthentication: (path, message) => {
    dispatch(actions.auth.request(path, message));
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

    this.props.handleAuthentication(authParams.path, payload);
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
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className={classes.submit}
            value="Submit">
            Submit
          </Button>
        </form>

        {error && (
          <div>
            <br />
            <MySnackbarContentWrapper
              variant="error"
              className={classes.margin}
              message="Authentication Failure!"
            />
          </div>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
