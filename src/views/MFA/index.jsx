import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, Typography } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';
import messageStore from '../../utils/messageStore';
import { selectors } from '../../reducers';
import InfoIcon from '../../components/icons/InfoIcon';
import getRoutePath from '../../utils/routePaths';

import OneTimePassCodeForm from './OneTimePassCodeForm';
import actions from '../../actions';
import Loader from '../../components/Loader';
import Spinner from '../../components/Spinner';
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
    color: theme.palette.warning.main,
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
    fontSize: 30,
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
  signupSuccess: {
    color: theme.palette.success.main,
    marginBottom: theme.spacing(2),
  },
  signInForm: {
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100%',
    },
  },
  mfaInfo: {
    display: 'flex',
    marginBottom: theme.spacing(1.5),
  },
  infoText: {
    marginLeft: theme.spacing(1),
  },
}));

const Title = () => {
  const classes = useStyles();
  const { isAccountUser, noOfDays } = useSelector(selectors.mfaAuthInfo);
  let infoMessage;

  if (isAccountUser) {
    infoMessage = messageStore(noOfDays ? 'MFA_USER_OTP_INFO_FOR_TRUSTED_NUMBER_OF_DAYS' : 'MFA_USER_OTP_INFO', { noOfDays });
  } else {
    infoMessage = messageStore('MFA_OWNER_OTP_INFO');
  }

  return (
    <>
      <Typography variant="h3" className={classes.mfaTitle}>
        Authenticate with one-time passcode
      </Typography>
      <div className={classes.mfaInfo}>
        <InfoIcon color="primary" width="16.5" height="16.5" />
        <span className={classes.infoText}>{infoMessage}</span>
      </div>
    </>

  );
};

export default function MfaVerify() {
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const isMFASetupIncomplete = useSelector(selectors.isMFASetupIncomplete);
  const sessionInfoResolved = useSelector(selectors.mfaSessionInfoStatus) === 'received';
  const attemptedRoute = location.state?.attemptedRoute;
  const isMFAAuthRequired = useSelector(selectors.isMFAAuthRequired);
  const isUserAuthenticated = useSelector(selectors.isUserAuthenticated);

  useEffect(() => {
    dispatch(actions.auth.validateSession());
  }, [dispatch]);

  useEffect(() => {
    if (sessionInfoResolved) {
      if (isMFASetupIncomplete) {
        history.push(getRoutePath('/myAccount/security'));
      } else if (!isMFAAuthRequired) {
        history.push(getRoutePath('/signin'));
      } else if (isUserAuthenticated) {
        history.push(attemptedRoute || '/');
      }
    }
  }, [attemptedRoute, history, isMFAAuthRequired, isMFASetupIncomplete, isUserAuthenticated, sessionInfoResolved]);

  if (!sessionInfoResolved) return <Loader open><Spinner /></Loader>;

  return (
    <UserSignInPage
      footerLinkText="Sign up"
      footerLink="signup"
      footerLinkLabel="Don't have an account?">
      <Title />
      <OneTimePassCodeForm />
    </UserSignInPage>

  );
}
