import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import { Component } from 'react';
import { hot } from 'react-hot-loader';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import actions from '../../actions';
import { authParams } from '../../utils/api';
// import { Redirect } from 'react-router';

const mapDispatchToProps = dispatch => ({
  handleAuthentication: (path, message) => {
    dispatch(actions.auth.request(path, message));
  },
});

@hot(module)
@withStyles(theme => ({
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
  handleOnSubmit = e => {
    e.preventDefault();
    const payload = JSON.stringify({
      email: e.target.email.value,
      password: e.target.password.value,
    });

    this.props.handleAuthentication(authParams.path, payload);
  };

  render() {
    // if (isLoadingProfile) {
    //   return (
    //     <Paper elevation={4}>
    //       <Typography variant="h3">Authenticating.</Typography>
    //       <Spinner loading />
    //     </Paper>
    //   );
    // }

    // if (!authenticated) {
    //   return <ErrorPanel error="Authentication failed!" />;
    // }
    const { classes, error } = this.props;

    return (
      <div className={classes.editableFields}>
        <form onSubmit={this.handleOnSubmit}>
          <TextField
            id="email"
            label="Email"
            rowsMax="4"
            margin="normal"
            className={classes.textField}
          />
          <TextField
            id="password"
            label="Password"
            multiline
            rowsMax="4"
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
        {error && <span> error </span>}
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(SignIn);
