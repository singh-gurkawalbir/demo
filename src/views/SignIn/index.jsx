import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import { Component } from 'react';
import { hot } from 'react-hot-loader';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import actions from '../../actions';
import * as selectors from '../../reducers';

const mapStateToProps = state => ({
  error: selectors.authenticationErrored(state),
  userEmail: selectors.userProfileEmail(state),
});
const mapDispatchToProps = dispatch => ({
  handleAuthentication: (email, password) => {
    dispatch(actions.auth.request(email, password));
  },
});

@hot(module)
@withStyles(theme => ({
  snackbar: {
    margin: theme.spacing(1),
  },
  submit: {
    marginLeft: 'auto',
    marginRight: ' auto',
  },
  editableFields: {
    textAlign: 'center',
    maxWidth: 500,
    margin: [[-8, -24]],
    background: theme.palette.background.paper2,
    padding: [[8, 24]],
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

    // '& div > input:disabled': {
    //   background: theme.palette.background.paper2,
    // },
    '& Label': {
      color: theme.palette.secondary.light,
      zIndex: 2,
    },
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
    const { classes, error, dialogOpen, userEmail } = this.props;
    const { email } = this.state;

    return (
      <div className={classes.editableFields}>
        <form onSubmit={this.handleOnSubmit}>
          <TextField
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
            id="password"
            label="Password"
            type="password"
            margin="normal"
            variant="filled"
            className={classes.textField}
          />

          {error && (
            <div>
              <br />
              <Typography color="error" variant="h5" className={classes.margin}>
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

// prettier-ignore
export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
