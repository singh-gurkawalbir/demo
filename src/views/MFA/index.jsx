import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';
import messageStore, { message } from '../../utils/messageStore';
import { selectors } from '../../reducers';
import getRoutePath from '../../utils/routePaths';
import OneTimePassCodeForm from './OneTimePassCodeForm';
import actions from '../../actions';
import Loader from '../../components/Loader';
import Spinner from '../../components/Spinner';
import UserSignInPage from '../../components/UserSignInPage';
import RawHtml from '../../components/RawHtml';
import NotificationToaster from '../../components/NotificationToaster';

const useStyles = makeStyles(theme => ({

  pageTitle: {
    maxWidth: 280,
  },
  notificationToasterMessage: {
    '& >* div.MuiTypography-root': {
      fontSize: theme.spacing(2),
      '& > svg': {
        color: theme.palette.primary.main,
        fontSize: '24px !important',
      },
    },
  },
}));

export default function MfaVerify() {
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const location = useLocation();
  const isMFASetupIncomplete = useSelector(selectors.isMFASetupIncomplete);
  const sessionInfoResolved = useSelector(selectors.mfaSessionInfoStatus) === 'received';
  const attemptedRoute = location.state?.attemptedRoute;
  const isMFAAuthRequired = useSelector(selectors.isMFAAuthRequired);
  const isMFAAuthVerificationRequired = useSelector(selectors.isMFAVerificationRequired);
  const isUserAuthenticated = useSelector(selectors.isUserAuthenticated);
  const isMFAResolved = useSelector(selectors.isMFAResolved);
  let infoMessage;
  const { isAccountUser, noOfDays } = useSelector(selectors.mfaAuthInfo);

  if (isAccountUser) {
    infoMessage = noOfDays
      ? messageStore('MFA.USER_OTP_INFO_FOR_TRUSTED_NUMBER_OF_DAYS', { noOfDays }) : message.MFA.USER_OTP_INFO;
  } else {
    infoMessage = message.MFA.OWNER_OTP_INFO;
  }
  useEffect(() => {
    dispatch(actions.auth.validateSession());
  }, [dispatch]);

  useEffect(() => {
    if (sessionInfoResolved) {
      if (isMFASetupIncomplete) {
        history.push(getRoutePath('/myAccount/security'));
      } else if (!isMFAAuthRequired && !isMFAAuthVerificationRequired && !isMFAResolved) {
        history.push(getRoutePath('/signin'));
      } else if (isUserAuthenticated) {
        history.push(attemptedRoute || '/');
      }
    }
  }, [attemptedRoute, history, isMFAAuthRequired, isMFAAuthVerificationRequired, isMFAResolved, isMFASetupIncomplete, isUserAuthenticated, sessionInfoResolved]);

  if (!sessionInfoResolved) return <Loader open><Spinner /></Loader>;

  return (
    <UserSignInPage
      pageTitle={<RawHtml html="Authenticate with one-time passcode" className={classes.pageTitle} />}
      footerLinkText="Sign up"
      footerLink="signup"
      pageSubHeading={(
        <NotificationToaster
          className={classes.notificationToasterMessage}
          noBorder
          variant="info"
          transparent>{infoMessage}
        </NotificationToaster>
)}
      footerLinkLabel="Don't have an account?">
      <OneTimePassCodeForm />
    </UserSignInPage>

  );
}
