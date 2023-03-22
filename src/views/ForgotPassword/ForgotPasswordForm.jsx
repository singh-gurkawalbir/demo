import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import actions from '../../actions';
import { selectors } from '../../reducers';
import { TextButton, FilledButton} from '../../components/Buttons';
import FieldMessage from '../../components/DynaForm/fields/FieldMessage';
import Spinner from '../../components/Spinner';
import { EMAIL_REGEX } from '../../constants';
import getRoutePath from '../../utils/routePaths';
import LoginFormWrapper from '../../components/LoginScreen/LoginFormWrapper';
import messageStore, { message } from '../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  submit: {
    marginTop: theme.spacing(4),
  },
  textField: {
    width: '100%',
    background: theme.palette.background.paper,
  },
  errorField: {
    '&:hover': {
      borderColor: theme.palette.error.dark,
    },
    '& > * input': {
      '&:hover': {
        borderColor: theme.palette.error.dark,
      },
      borderColor: theme.palette.error.dark,
    },
  },
  forgotPasswordSpinner: {
    marginTop: theme.spacing(1),
  },
}));
export default function ForgotPassword({setShowError, email}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [userEmail, setUserEmail] = useState(email || '');
  const [showErr, setShowErr] = useState(false);
  const [showInvalidEmailError, setShowInvalidEmailError] = useState(false);
  const [showErrorMsg, setShowErrorMsg] = useState('EMAIL_EMPTY');
  const resetRequestStatus = useSelector(state => selectors.requestResetStatus(state));
  const resetRequestErrorMsg = useSelector(state => selectors.requestResetError(state));
  const isAuthenticating = resetRequestStatus === 'requesting';

  useEffect(() => {
    if (resetRequestStatus === 'success') {
      setShowError(false);
    } else {
      setShowError(true);
    }
  }, [resetRequestStatus, resetRequestErrorMsg, setShowError]);
  const validateEmail = email => email.match(EMAIL_REGEX);

  const handleAuthentication = useCallback(userEmail => {
    dispatch(actions.auth.resetRequest(userEmail));
  }, [dispatch]);
  const handleOnSubmit = useCallback(e => {
    e.preventDefault();
    const email = e?.target?.email?.value || e?.target?.elements?.email?.value;

    if (!email) {
      setShowErrorMsg(messageStore('USER_SIGN_IN.SIGNIN_REQUIRED', {label: 'Email'}));
      setShowErr(true);
    } else {
      if (validateEmail(email)) {
        setShowInvalidEmailError(false);
        handleAuthentication(email);
      } else {
        setShowErrorMsg(message.USER_SIGN_IN.INVALID_EMAIL);
        setShowInvalidEmailError(true);
      }
      setShowErr(false);
    }
  }, [handleAuthentication]);
  const handleOnChangeEmail = useCallback(e => {
    setShowErr(false);
    setUserEmail(e.target.value);
  }, []);

  return (
    <LoginFormWrapper>
      <form onSubmit={handleOnSubmit}>
        <TextField
          data-private
          data-test="email"
          id="email"
          variant="filled"
          placeholder="Email*"
          fullWidth
          value={userEmail}
          onChange={handleOnChangeEmail}
          className={clsx(classes.textField, {[classes.errorField]: showErr || showInvalidEmailError})}
        />
        <FieldMessage errorMessages={showErr || showInvalidEmailError ? showErrorMsg : ''} />

        { isAuthenticating ? <Spinner className={classes.forgotPasswordSpinner} />
          : (
            <FilledButton
              data-test="submit"
              type="submit"
              className={classes.submit}
              submit
              value="Submit">
              Submit
            </FilledButton>
          )}
        <TextButton
          to={getRoutePath('/signin')}
          data-test="cancelForgotPassword"
          color="primary"
          component={Link}
          role="link"
          type="cancel"
          submit
          className={classes.submit}
        >
          Cancel
        </TextButton>
      </form>
    </LoginFormWrapper>
  );
}

