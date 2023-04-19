import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { CeligoLogo } from '@celigo/fuse-ui';
import SigninForm from './SignInForm';
import { getDomain, isSignUpAllowed } from '../../../utils/resource';
import { selectors } from '../../../reducers';
import UserSignInPageFooter from '../../../components/UserSignInPage/UserSignInPageFooter';
import ShopifyLandingPageHeader from '../../LandingPages/Shopify/PageHeader';

const useStyles = makeStyles(theme => ({
  wrapper: {
    flexGrow: 1,
    display: 'grid',
    gridTemplateColumns: '100%',
    background: theme.palette.background.paper,
    height: '100vh',
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '100%',
    },
  },
  externalLink: {
    cursor: 'pointer',
  },
  logo: {
    width: 150,
    marginBottom: theme.spacing(5),
    '& > svg': {
      fill: theme.palette.primary.dark,
    },
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
    marginTop: '5%',
    height: '100%',
  },
  title: {
    marginBottom: theme.spacing(2),
    fontSize: 30,
    lineHeight: '40px',
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
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
    },
  },
}));

const Title = () => {
  const classes = useStyles();

  return (
    <Typography variant="h3" className={classes.title}>
      {getDomain() !== 'eu.integrator.io' ? 'Sign in' : 'Sign into EU domain'}
    </Typography>
  );
};

export default function Signin(props) {
  const classes = useStyles();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const isSignupCompleted = useSelector(
    state => selectors.signupStatus(state) === 'done'
  );
  const signupMessage = useSelector(state => selectors.signupMessage(state));

  return (
    <div className={classes.wrapper}>
      <ShopifyLandingPageHeader />
      <div className={classes.signinWrapper}>
        <div className={classes.signinWrapperContent}>
          <div className={classes.logo}>
            <CeligoLogo />
          </div>
          <Title />
          {isSignupCompleted && (
            <Typography variant="body2" className={classes.signupSuccess}>
              {signupMessage}
            </Typography>
          )}
          <SigninForm
            {...props}
            dialogOpen={false}
            className={classes.signInForm}
            queryParam={queryParams}
          />
          {isSignUpAllowed() && (
            <div className={classes.signupLink}>
              <UserSignInPageFooter
                linkLabel="Don't have an account?"
                linkText="Sign up"
                link="signup"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
