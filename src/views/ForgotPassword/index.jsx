import React, { useState } from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { makeStyles, Typography } from '@material-ui/core';
import { Link, useLocation } from 'react-router-dom';
import ForgotPasswordForm from './ForgotPasswordForm';
import CeligoLogo from '../../components/CeligoLogo';
import { getDomain } from '../../utils/resource';
import { selectors } from '../../reducers';
import MarketingContentWithIframe from '../../components/LoginScreen/MarketingContentWithIframe';
import { TextButton } from '../../components/Buttons';
import actions from '../../actions';
import ConcurForgotPassword from './Concur';
import useQuery from '../../hooks/useQuery';
import messageStore from '../../utils/messageStore';
import UserSignInPage from '../../components/UserSignInPage';

const useStyles = makeStyles(theme => ({
  wrapper: {
    flexGrow: 1,
    display: 'grid',
    gridTemplateColumns: '30% 70%',
    height: '100vh',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '100%',
    },
  },
  alertMsg: {
    fontSize: theme.spacing(1.5),
    textAlign: 'left',
    marginLeft: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    marginTop: 0,
    marginBottom: 10,
    lineHeight: `${theme.spacing(2)}px`,
    '& > svg': {
      fill: theme.palette.error.main,
      fontSize: theme.spacing(2),
      marginRight: 5,
    },
  },
  marketingContentWrapper: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  logo: {
    width: 150,
    marginBottom: theme.spacing(5),
    '& > svg': {
      fill: theme.palette.primary.dark,
    },
  },
  link: {
    paddingLeft: 4,
    color: theme.palette.primary.dark,
  },
  signinWrapper: {
    background: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  signinWrapperContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 300,
    marginTop: '50%',
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      marginTop: 0,
    },
  },
  title: {
    marginBottom: theme.spacing(2),
    fontSize: 29,
    lineHeight: '40px',
  },
  mfaTitle: {
    marginBottom: theme.spacing(3),
    fontSize: 30,
    lineHeight: '28px',
    width: 290,
    textAlign: 'center',
  },
  signupLink: {
    position: 'absolute',
    bottom: theme.spacing(8),
  },
  ForgotPasswordForm: {
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100%',
    },
  },
  mfaInfo: {
    marginBottom: theme.spacing(3.5),
  },
}));

function ForgotPassword(props) {
  const [showError, setShowError] = useState(false);
  const resetRequestStatus = useSelector(state => selectors.requestResetStatus(state));
  const successView = (resetRequestStatus === 'success');
  const resetRequestErrorMsg = useSelector(state => selectors.requestResetError(state));
  const email = useSelector(state => selectors.requestResetEmail(state));
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  function handleClick() {
    dispatch(actions.auth.resetRequestSent());
  }
  // eslint-disable-next-line no-undef
  const contentUrl = (getDomain() === 'eu.integrator.io' ? IO_LOGIN_PROMOTION_URL_EU : IO_LOGIN_PROMOTION_URL);
  let message = messageStore('FORGOT_PASSWORD_DEFAULT');

  if (successView) {
    message = `If ${email} ${messageStore('FORGOT_PASSWORD_USER_EXIST')}`;
  }

  const alertMessage = (showError && resetRequestErrorMsg) ? resetRequestErrorMsg : '';

  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.signinWrapper}>
          <div className={classes.signinWrapperContent}>
            <div className={classes.logo}>
              <CeligoLogo />
            </div>
            <Typography variant="h3" className={classes.title}>
              Forgot your password?
            </Typography>
            {email && (
            <Typography variant="h6" className={classes.title}>
              {email}
            </Typography>
            )}
            { showError && resetRequestErrorMsg && (
            <Typography
              data-private
              color="error"
              component="div"
              variant="h5"
              className={classes.alertMsg}>
              {resetRequestErrorMsg}
            </Typography>
            )}
            <div className={classes.mfaInfo}>
              {message}
            </div>
            {!successView
              ? (
                <ForgotPasswordForm
                  {...props}
                  setShowError={setShowError}
                  dialogOpen={false}
                  email={queryParams.get('email')}
                  className={classes.signInForm}
          />
              ) : ''}
            {successView ? (
              <Typography variant="body2" className={classes.signupLink}>
                Back to
                <TextButton
                  data-test="signin"
                  color="primary"
                  className={classes.link}
                  onClick={handleClick}
                  component={Link}
                  to="/signin">
                  Sign in
                </TextButton>
              </Typography>
            ) : ''}
          </div>
        </div>
        <div className={classes.marketingContentWrapper}>
          <MarketingContentWithIframe contentUrl={contentUrl} />
        </div>
      </div>
      <UserSignInPage
        pageTitle="Forgot your password?"
        pageSubHeading={message}
        alertMessage={alertMessage}
      >

        {!successView
          ? (
            <ForgotPasswordForm
              {...props}
              setShowError={setShowError}
              dialogOpen={false}
              email={queryParams.get('email')}
              className={classes.signInForm}
          />
          ) : ''}
        {successView ? (
          <Typography variant="body2" className={classes.signupLink}>
            Back to
            <TextButton
              data-test="signin"
              color="primary"
              className={classes.link}
              onClick={handleClick}
              component={Link}
              to="/signin">
              Sign in
            </TextButton>
          </Typography>
        ) : ''}
      </UserSignInPage>
    </>
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
