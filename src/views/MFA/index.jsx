import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, Typography } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import CeligoLogo from '../../components/CeligoLogo';
import { getDomain } from '../../utils/resource';
import messageStore from '../../utils/messageStore';
import { selectors } from '../../reducers';
import MarketingContentWithIframe from '../../components/LoginScreen/MarketingContentWithIframe';
import InfoIcon from '../../components/icons/InfoIcon';
import { TextButton } from '../../components/Buttons';
import getRoutePath from '../../utils/routePaths';

import OneTimePassCodeForm from './OneTimePassCodeForm';

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
  const classes = useStyles();
  const history = useHistory();
  // eslint-disable-next-line no-undef
  const contentUrl = (getDomain() === 'eu.integrator.io' ? IO_LOGIN_PROMOTION_URL_EU : IO_LOGIN_PROMOTION_URL);

  const isMFAAuthRequired = useSelector(state => selectors.isMFAAuthRequired(state));

  if (!isMFAAuthRequired) {
    history.push(getRoutePath('/signin'));
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.signinWrapper}>
        <div className={classes.signinWrapperContent}>
          <div className={classes.logo}>
            <CeligoLogo />
          </div>
          <Title />
          <OneTimePassCodeForm />
          {getDomain() !== 'eu.integrator.io' && (
          <Typography variant="body2" className={classes.signupLink}>
            Don&apos;t have an account?
            <TextButton
              data-test="signup"
              color="primary"
              className={classes.link}
              component={Link}
              to="/signup">
              Sign up
            </TextButton>
          </Typography>
          )}
        </div>
      </div>
      <div className={classes.marketingContentWrapper}>
        <MarketingContentWithIframe contentUrl={contentUrl} />
      </div>
    </div>
  );
}
