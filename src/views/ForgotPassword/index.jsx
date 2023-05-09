import React, { useState } from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Link, useLocation } from 'react-router-dom';
import { TextButton } from '@celigo/fuse-ui';
import ForgotPasswordForm from './ForgotPasswordForm';
import { selectors } from '../../reducers';
import actions from '../../actions';
import ConcurForgotPassword from './Concur';
import useQuery from '../../hooks/useQuery';
import messageStore, {message as messageStoreMessage} from '../../utils/messageStore';
import UserSignInPage from '../../components/UserSignInPage';
import RawHtml from '../../components/RawHtml';

const useStyles = makeStyles(theme => ({
  backToSignIn: {
    marginTop: 130,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rawHTML: {
    '& > p': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: theme.spacing(-0.5),
      marginBottom: theme.spacing(3),
    },
  },
}));

function ForgotPassword(props) {
  const classes = useStyles();
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
  let message = messageStoreMessage.USER_SIGN_IN.FORGOT_PASSWORD_DEFAULT;

  if (successView) {
    message = `
    <p> <b>${email}</b> </p>
    <p>${messageStore('USER_SIGN_IN.FORGOT_PASSWORD_USER_EXIST', {email})}</p>
    `;
  }

  const alertMessage = (showError && resetRequestErrorMsg) ? resetRequestErrorMsg : '';

  return (

    <UserSignInPage
      pageTitle="Forgot your password?"
      pageSubHeading={<RawHtml html={message} className={classes.rawHTML} />}
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
        <Typography variant="body2" className={classes.backToSignIn}>
          Back to
          <TextButton
            data-test="signin"
            color="primary"
            onClick={handleClick}
            bold
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
