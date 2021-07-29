import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import actions from '../../actions';
import { selectors } from '../../reducers';
import Spinner from '../../components/Spinner';
import { FilledButton } from '../../components/Buttons';

const useStyles = makeStyles(theme => ({
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
    marginBottom: 125,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
    },
  },
  textField: {
    width: '100%',
    background: theme.palette.background.paper,
    marginBottom: 10,
  },
}));

export default function SignInSSOForm() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const userEmail = useSelector(state => selectors.userProfileEmail(state));
  const isAuthenticating = useSelector(state => selectors.isAuthenticating(state));
  const handleSignInWithSSO = e => {
    e.preventDefault();
    dispatch(actions.auth.reSignInWithSSO());
  };

  window.signedInWithSSO = () => {
    dispatch(actions.auth.initSession());
  };

  return (
    <div className={classes.editableFields}>
      <TextField
        data-test="email"
        id="email"
        type="email"
        variant="filled"
        placeholder="Email"
        value={userEmail}
        className={classes.textField}
        disabled />
      {isAuthenticating ? <Spinner /> : (
        <FilledButton
          data-test="submit"
          type="submit"
          className={classes.submit}
          onClick={handleSignInWithSSO} >
          Sign in with SSO
        </FilledButton>
      )}
    </div>
  );
}

