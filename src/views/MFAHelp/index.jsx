import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { Link} from 'react-router-dom';
import CeligoLogo from '../../components/CeligoLogo';
import { getDomain } from '../../utils/resource';
import MarketingContentWithIframe from '../../components/LoginScreen/MarketingContentWithIframe';
import { TextButton } from '../../components/Buttons';

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
    fontWeight: 300,
    lineHeight: '28px',
    width: 290,
    textAlign: 'center',
  },
  mfaLabel: {
    marginBottom: '16px',
    fontSize: '15px',
    color: '#6a7b89',
    maxWidth: '300px',
    alignItems: 'center',
    lineHeight: '20px',
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

  return (
    <>
      <Typography variant="h3" className={classes.mfaTitle}>
        Need help authenticating?
      </Typography>
    </>

  );
};
const Label = () => {
  const classes = useStyles();

  return (
    <div className={classes.mfaLabel}>
      Contact an admin or owner of the primary account to reset MFA. Otherwise ,
      <a
        href="https://www.celigo.com/company/contact-us/"
        target="_blank"
        rel="noreferrer"
    >
        contact Celigo support via call.
      </a>
      <br />
      <br />
      Need more help? &nbsp;
      <a
        href="https://docs.celigo.com/hc/en-us/articles/7127009384987-Set-up-multifactor-authentication-MFA-for-an-account"
        target="_blank"
        rel="noreferrer"
    >
        Check out our help documentation.
      </a>
    </div>
  );
};
export default function MfaHelp() {
  const classes = useStyles();
  // eslint-disable-next-line no-undef
  const contentUrl = (getDomain() === 'eu.integrator.io' ? IO_LOGIN_PROMOTION_URL_EU : IO_LOGIN_PROMOTION_URL);

  return (
    <div className={classes.wrapper}>
      <div className={classes.signinWrapper}>
        <div className={classes.signinWrapperContent}>
          <div className={classes.logo}>
            <CeligoLogo />
          </div>
          <Title />
          <Label />
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
