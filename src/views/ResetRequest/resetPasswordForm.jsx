import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import React, { useState, useCallback, useEffect} from 'react';
import { useParams, useHistory, Link} from 'react-router-dom';
import clsx from 'clsx';
import { Spinner } from '@celigo/fuse-ui';
import actions from '../../actions';
import { selectors } from '../../reducers';
import { AUTH_FAILURE_MESSAGE } from '../../constants';
import { FilledButton, TextButton } from '../../components/Buttons';
import getRoutePath from '../../utils/routePaths';
import FieldMessage from '../../components/DynaForm/fields/FieldMessage';
import messageStore, {message} from '../../utils/messageStore';
import ShowErrorMessage from '../../components/ShowErrorMessage';
import LoginFormWrapper from '../../components/LoginScreen/LoginFormWrapper';
import DynaPassword from '../../components/DynaForm/fields/DynaPassword';

const useStyles = makeStyles(theme => ({
  submit: {
    marginTop: 30,
  },
  cancelBtn: {
    fontSize: theme.spacing(2),
  },
}));

export default function ResetPassword() {
  const {token} = useParams();
  const dispatch = useDispatch();
  // const showError = false;
  const history = useHistory();
  const classes = useStyles();

  const [showError, setShowError] = useState(false);
  const [passwordVal, setPasswordVal] = useState('');

  const handleResetPassword = useCallback(password => {
    dispatch(actions.auth.resetPasswordRequest(password, token));
  }, [dispatch, token]);
  const isResetPasswordStatus = useSelector(state => selectors.requestResetPasswordStatus(state));
  const showErrMsg = isResetPasswordStatus === 'failed';

  const resetPasswordMsg = useSelector(state => selectors.requestResetPasswordMsg(state));

  useEffect(() => {
    if (isResetPasswordStatus === 'success') {
      dispatch(actions.auth.signupStatus('done', resetPasswordMsg));
      history.replace(getRoutePath('/signin'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isResetPasswordStatus]);
  const isAuthenticating = isResetPasswordStatus === 'loading';
  const error = useSelector(state => {
    const errorMessage = selectors.requestResetPasswordError(state);

    if (errorMessage === AUTH_FAILURE_MESSAGE) {
      return message.USER_SIGN_IN.SIGNIN_FAILED;
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
      { showErrMsg && error && (
      <ShowErrorMessage error={error} />
      )}
      <form onSubmit={handleOnSubmit}>
        <div>
          <DynaPassword onFieldChange={onFieldChange} />
          <FieldMessage errorMessages={showError ? messageStore('USER_SIGN_IN.SIGNIN_REQUIRED', {label: 'New password'}) : null} />
        </div>
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
          to={getRoutePath('/signin')}
          data-test="cancelResetPassword"
          color="primary"
          component={Link}
          role="link"
          className={clsx(classes.submit, classes.cancelBtn)}
          submit
        >
          Cancel
        </TextButton>
      </form>
    </LoginFormWrapper>
  );
}

