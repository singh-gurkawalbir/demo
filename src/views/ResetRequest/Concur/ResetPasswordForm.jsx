import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import React, { useState, useCallback, useEffect} from 'react';
import { useParams, useHistory, Link} from 'react-router-dom';
import { Spinner } from '@celigo/fuse-ui';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { AUTH_FAILURE_MESSAGE } from '../../../constants';
import { FilledButton, TextButton } from '../../../components/Buttons';
import getRoutePath from '../../../utils/routePaths';
import ShowErrorMessage from '../../../components/ShowErrorMessage';
import LoginFormWrapper from '../../../components/LoginScreen/LoginFormWrapper';
import DynaPassword from '../../../components/DynaForm/fields/DynaPassword';
import { message } from '../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  submit: {
    color: theme.palette.warning.main,
  },
  setPasswordForm: {
    position: 'relative',
  },
}));

export default function ResetPassword() {
  const {token} = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const [showError, setShowError] = useState(false);
  const [passwordVal, setPasswordVal] = useState('');
  const handleResetPassword = useCallback(password => {
    dispatch(actions.auth.resetPasswordRequest(password, token));
  }, [dispatch, token]);
  const isSetPasswordCompleted = useSelector(state => selectors.requestResetPasswordStatus(state) === 'success');

  useEffect(() => {
    if (isSetPasswordCompleted) {
      history.replace(getRoutePath('/signin'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSetPasswordCompleted]);
  const isAuthenticating = useSelector(state => selectors.isAuthenticating(state));
  const error = useSelector(state => {
    const errorMessage = selectors.requestResetPasswordError(state);

    if (errorMessage === AUTH_FAILURE_MESSAGE) {
      return message.USER_SIGN_IN.SIGNIN_FAILED;
    }
    if (window.signInError) {
      return window.signInError;
    }

    return errorMessage;
  });

  const handleOnSubmit = useCallback(e => {
    e.preventDefault();
    if (!passwordVal) {
      setShowError(true);
    } else if (!showError) {
      handleResetPassword(passwordVal);
    }
  }, [handleResetPassword, passwordVal, showError]);

  const onFieldChange = (id, password) => {
    setPasswordVal(password);
  };

  return (
    <LoginFormWrapper>
      { error && (
      <ShowErrorMessage error={error} />
      )}
      <form onSubmit={handleOnSubmit} className={classes.setPasswordForm}>
        <DynaPassword onFieldChange={onFieldChange} />
        { isAuthenticating ? <Spinner />
          : (
            <FilledButton
              data-test="submit"
              type="submit"
              className={classes.submit}
              submit
              value="Submit">
              Save
            </FilledButton>
          )}
        <TextButton
          data-test="cancelResetPassword"
          className={classes.submit}
          submit
          to={getRoutePath('/signin')}
          component={Link}
          role="link"
          value="Cancel">
          Cancel
        </TextButton>
      </form>
    </LoginFormWrapper>
  );
}

