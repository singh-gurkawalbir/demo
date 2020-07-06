import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Typography, Button, Link} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import actions from '../../actions';
import * as selectors from '../../reducers';
import ErrorIcon from '../../components/icons/ErrorIcon';
import { getDomain } from '../../utils/resource';

const mapStateToProps = state => ({
  error: selectors.authenticationErrored(state),
  userEmail: selectors.userProfileEmail(state),
  userProfileLinkedWithGoogle: selectors.userProfileLinkedWithGoogle(state),
});
const mapDispatchToProps = dispatch => ({
  handleAuthentication: (email, password) => {
    dispatch(actions.auth.request(email, password));
  },
  handleSignInWithGoogle: returnTo => {
    dispatch(actions.auth.signInWithGoogle(returnTo));
  },
  handleReSignInWithGoogle: email => {
    dispatch(actions.auth.reSignInWithGoogle(email));
  },
  handleReSignInWithGoogleCompleted: () => {
    dispatch(actions.auth.initSession());
  },
});
const path = `${process.env.CDN_BASE_URI}images/googlelogo.png`;

@withStyles(theme => ({
  snackbar: {
    margin: theme.spacing(1),
  },
  submit: {
    width: '100%',
    borderRadius: 4,
    height: 38,
    fontSize: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  editableFields: {
    textAlign: 'center',
    width: '100%',
    maxWidth: 500,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
    },
  },
  relatedContent: {
    textDecoration: 'none',
  },
  textField: {
    width: '100%',
    background: theme.palette.background.paper,
    marginBottom: 10,
  },
  alertMsg: {
    fontSize: 12,
    textAlign: 'left',
    marginLeft: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(-2),
    marginBottom: 0,
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
    textAlign: 'right',
    marginBottom: theme.spacing(3),
  },
  googleBtn: {
    borderRadius: 4,
    width: '100%',
    background: `url(${path}) 15% center no-repeat`,
    backgroundSize: theme.spacing(2),
    height: 38,
    fontSize: 16,
    backgroundColor: theme.palette.background.paper,
  },
  or: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    margin: '0 auto',
    marginBottom: theme.spacing(2),
    '&:before': {
      content: '""',
      width: '40%',
      borderTop: '1px solid',
      borderColor: theme.palette.secondary.lightest,
    },
    '&:after': {
      content: '""',
      width: '40%',
      borderTop: '1px solid',
      borderColor: theme.palette.secondary.lightest,
    },
  },
  hidden: {
    display: 'none',
  },
  wrapper: {
    textAlign: 'left',
    marginBottom: theme.spacing(2),
  },
  label: {
    display: 'flex',
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

  handleSignInWithGoogle = e => {
    e.preventDefault();

    this.props.handleSignInWithGoogle(e.target.attemptedRoute.value);
  };

  handleReSignInWithGoogle = e => {
    e.preventDefault();

    this.props.handleReSignInWithGoogle(this.props.userEmail);
  };

  render() {
    window.signedInWithGoogle = () => {
      this.props.handleReSignInWithGoogleCompleted();
    };

    const {
      classes,
      dialogOpen,
      userEmail,
      location,
      userProfileLinkedWithGoogle,
    } = this.props;
    let { error } = this.props;
    const attemptedRoute =
      location && location.state && location.state.attemptedRoute;

    if (error) {
      error = 'Sign in failed. Please try again.';
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
            type="email"
            variant="filled"
            placeholder="Email"
            value={dialogOpen ? userEmail : email}
            onChange={this.handleOnChangeEmail}
            className={classes.textField}
            disabled={dialogOpen}
            />
          <TextField
            data-test="password"
            id="password"
            variant="filled"
            type="password"
            placeholder="Password"
            className={classes.textField}
            />

          <div className={classes.forgotPass}>
            <Link href="/request-reset" className={classes.forgotPass} variant="body2">
              Forgot password?
            </Link>
          </div>
          {error && (
          <Typography
            color="error"
            component="div"
            variant="h5"
            className={classes.alertMsg}>
            <ErrorIcon /> {error}
          </Typography>
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
        </form>
        {getDomain() !== 'eu.integrator.io' && (
          <div>
            {!dialogOpen && (
              <form onSubmit={this.handleSignInWithGoogle}>
                <TextField
                  type="hidden"
                  id="attemptedRoute"
                  name="attemptedRoute"
                  value={attemptedRoute || '/pg/'}
                />
                <div className={classes.or}>
                  <Typography variant="body1">or</Typography>
                </div>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  className={classes.googleBtn}>
                  Sign in with Google
                </Button>
              </form>
            )}
            {dialogOpen && userEmail && userProfileLinkedWithGoogle && (
              <form onSubmit={this.handleReSignInWithGoogle}>
                <div className={classes.or}>
                  <Typography variant="body1">or</Typography>
                </div>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  className={classes.googleBtn}>
                  Sign in with Google
                </Button>
              </form>
            )}
          </div>
        )}
      </div>
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
