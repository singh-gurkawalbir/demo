import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, Typography, Link } from '@material-ui/core';
import SigninForm from './SigninForm';
import CeligoLogo from '../../components/CeligoLogo';
import { getDomain } from '../../utils/resource';
import { selectors } from '../../reducers';
import MarketingContentWithIframe from '../../components/LoginScreen/MarketingContentWithIframe';
import InfoIcon from '../../components/icons/InfoIcon';

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
    fontSize: 30,
    lineHeight: '40px',
  },
  mfaTitle: {
    marginBottom: theme.spacing(2),
    fontSize: 30,
    lineHeight: '28px',
    width: 290,
    textAlign: 'center',
  },
  signupLink: {
    position: 'absolute',
    bottom: theme.spacing(8),
  },
  signInForm: {
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100%',
    },
  },
  mfaInfo: {
    display: 'flex',
    marginBottom: theme.spacing(1),
  },
  infoText: {
    marginLeft: theme.spacing(1),
  },
}));

const Title = ({ isMFAAuthRequired }) => {
  const classes = useStyles();

  if (!isMFAAuthRequired) {
    return (
      <Typography variant="h3" className={classes.title}>
        Sign in
      </Typography>
    );
  }

  return (
    <>
      <Typography variant="h3" className={classes.mfaTitle}>
        Authenticate with one-time passcode
      </Typography>
      <div className={classes.mfaInfo}>
        <InfoIcon color="primary" width="16.5" height="16.5" />
        <span className={classes.infoText}>You are signing in from a new device. Enter your passcode to verify your account.</span>
      </div>
    </>

  );
};

export default function Signin(props) {
  const classes = useStyles();
  // eslint-disable-next-line no-undef
  const contentUrl = (getDomain() === 'eu.integrator.io' ? IO_LOGIN_PROMOTION_URL_EU : IO_LOGIN_PROMOTION_URL);

  const isMFAAuthRequired = useSelector(state => selectors.isMFAAuthRequired(state));

  return (
    <div className={classes.wrapper}>
      <div className={classes.signinWrapper}>
        <div className={classes.signinWrapperContent}>
          <div className={classes.logo}>
            <CeligoLogo />
          </div>
          <Title isMFAAuthRequired={isMFAAuthRequired} />

          <SigninForm
            {...props}
            dialogOpen={false}
            className={classes.signInForm}
          />
          {getDomain() !== 'eu.integrator.io' && (
          <Typography variant="body2" className={classes.signupLink}>
            Don&apos;t have an account?
            <Link href="/signup" className={classes.link}>
              Sign up
            </Link>
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
