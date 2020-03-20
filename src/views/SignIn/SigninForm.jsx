import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import { Component } from 'react';
import { hot } from 'react-hot-loader';
import { Typography, Button, Link } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import actions from '../../actions';
import * as selectors from '../../reducers';
import ErrorIcon from '../../components/icons/ErrorIcon';

const mapStateToProps = state => ({
  error: selectors.authenticationErrored(state),
  userEmail: selectors.userProfileEmail(state),
});
const mapDispatchToProps = dispatch => ({
  handleAuthentication: (email, password) => {
    dispatch(actions.auth.request(email, password));
  },
});
const path = `${process.env.CDN_BASE_URI}images/googlelogo.png`;

@hot(module)
@withStyles(theme => ({
  snackbar: {
    margin: theme.spacing(1),
  },
  submit: {
    width: '90%',
    borderRadius: 4,
    height: 48,
    fontSize: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  editableFields: {
    textAlign: 'center',
    maxWidth: 500,
    margin: [[-8, -24]],
    background: theme.palette.background.paper2,
    padding: [[8, 24]],
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
    },
  },
  relatedContent: {
    textDecoration: 'none',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '90%',
    border: '1px solid',
    background: theme.palette.background.paper,
    borderColor: theme.palette.secondary.lightest,
    marginBottom: 0,

    // '& div > input:disabled': {
    //   background: theme.palette.background.paper2,
    // },
    '& Label': {
      color: theme.palette.secondary.light,
      zIndex: 2,
    },
  },
  alertMsg: {
    marginBottom: theme.spacing(1),
    fontSize: 12,
    textAlign: 'left',
    marginLeft: 20,
    width: '90%',
    display: 'flex',
    alignItems: 'center',
    '& > svg': {
      fill: theme.palette.error.main,
      fontSize: theme.spacing(2),
      marginRight: 5,
    },
  },
  link: {
    paddingLeft: 4,
    color: theme.palette.primary.dark,
  },
  forgotPass: {
    color: theme.palette.primary.dark,
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  googleBtn: {
    borderRadius: 4,
    width: '90%',
    background: `url(${path}) 20% center no-repeat`,
    backgroundSize: theme.spacing(2),
    height: 48,
    fontSize: 16,
    backgroundColor: theme.palette.background.paper,
  },
  or: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    margin: '0 auto',
    marginBottom: theme.spacing(2),
    '&:before': {
      content: '""',
      width: '40%',
      borderTop: '2px solid',
      borderColor: theme.palette.secondary.lightest,
    },
    '&:after': {
      content: '""',
      width: '40%',
      borderTop: '2px solid',
      borderColor: theme.palette.secondary.lightest,
    },
  },
  hidden: {
    display: 'none',
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
    const email = e.target.email.value;
    const password = e.target.password.value;

    this.props.handleAuthentication(email, password);
  };

  render() {
    const { classes, dialogOpen, userEmail, location } = this.props;
    let { error } = this.props;
    const attemptedRoute = location.state && location.state.attemptedRoute;

    if (error) {
      error = 'Oops! Something went wrong. Try again.';
    } else if (window.signInError) {
      error = window.signInError;
    }

    const { email } = this.state;

    return (
      <div className={classes.editableFields}>
        <form onSubmit={this.handleOnSubmit}>
          <TextField
            data-test="email"
            id="email"
            label="Email"
            type="email"
            margin="normal"
            variant="filled"
            value={dialogOpen ? userEmail : email}
            onChange={this.handleOnChangeEmail}
            className={classes.textField}
            disabled={dialogOpen}
          />
          <TextField
            data-test="password"
            id="password"
            label="Password"
            type="password"
            margin="normal"
            variant="filled"
            className={classes.textField}
          />
          {error && (
            <div>
              <Typography
                color="error"
                variant="h5"
                className={classes.alertMsg}>
                <ErrorIcon /> {error}
              </Typography>
            </div>
          )}
          <Button
            data-test="submit"
            variant="contained"
            color="primary"
            type="submit"
            className={classes.submit}
            value="Submit">
            Sign in
          </Button>
          <div className={classes.forgotPass}>
            <Link href="true" className={classes.forgotPass} variant="body2">
              Forgot password?
            </Link>
          </div>
        </form>
        <div>
          <div className={classes.or}>
            <Typography variant="body1">or</Typography>
          </div>
          <form
            action={`/auth/google?attemptedRoute=${attemptedRoute || '/pg/'}`}
            method="post">
            <TextField
              type="hidden"
              id="_csrf"
              name="_csrf"
              value={window.siwgCsrf || ''}
            />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              className={classes.googleBtn}>
              Sign in with Google
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
