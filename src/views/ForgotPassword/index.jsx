import React, { useState } from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { Typography } from '@material-ui/core';
import { Link, useLocation } from 'react-router-dom';
import ForgotPasswordForm from './ForgotPasswordForm';
import { selectors } from '../../reducers';
import { TextButton } from '../../components/Buttons';
import actions from '../../actions';
import ConcurForgotPassword from './Concur';
import useQuery from '../../hooks/useQuery';
import messageStore from '../../utils/messageStore';
import UserSignInPage from '../../components/UserSignInPage';

function ForgotPassword(props) {
  const [showError, setShowError] = useState(false);
  const resetRequestStatus = useSelector(state => selectors.requestResetStatus(state));
  const successView = (resetRequestStatus === 'success');
  const resetRequestErrorMsg = useSelector(state => selectors.requestResetError(state));
  const email = useSelector(state => selectors.requestResetEmail(state));
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  function handleClick() {
    dispatch(actions.auth.resetRequestSent());
  }
  let message = messageStore('FORGOT_PASSWORD_DEFAULT');

  if (successView) {
    message = `If ${email} ${messageStore('FORGOT_PASSWORD_USER_EXIST')}`;
  }

  const alertMessage = (showError && resetRequestErrorMsg) ? resetRequestErrorMsg : '';

  return (

    <UserSignInPage
      pageTitle="Forgot your password?"
      pageSubHeading={message}
      alertMessage={alertMessage}>
      {!successView
        ? (
          <ForgotPasswordForm
            {...props}
            setShowError={setShowError}
            dialogOpen={false}
            email={queryParams.get('email')}
          />
        ) : ''}
      {successView ? (
        <Typography variant="body2">
          Back to
          <TextButton
            data-test="signin"
            color="primary"
            onClick={handleClick}
            component={Link}
            to="/signin">
            Sign in
          </TextButton>
        </Typography>
      ) : ''}
    </UserSignInPage>
  );
}

export default function ForgotPasswordWrapper(props) {
  const query = useQuery();
  const application = query.get('application');
  let ForgotPasswordPage = ForgotPassword;

  if (application) {
    switch (application) {
      case 'concur':
        ForgotPasswordPage = ConcurForgotPassword;
        break;
      default:
        break;
    }
  }

  return <ForgotPasswordPage {...props} />;
}
