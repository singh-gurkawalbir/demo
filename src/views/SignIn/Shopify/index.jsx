import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import SigninForm from './SignInForm';
import CeligoLogo from '../../../components/CeligoLogo';
import { getDomain } from '../../../utils/resource';
import { selectors } from '../../../reducers';
import { TextButton } from '../../../components/Buttons';
import getImageUrl from '../../../utils/image';

const useStyles = makeStyles(theme => ({
  wrapper: {
    flexGrow: 1,
    display: 'grid',
    gridTemplateColumns: '100%',
    background: theme.palette.background.paper,
    height: '100vh',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '100%',
    },
  },
  headerBorder: {
    background: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    padding: theme.spacing(2),
    height: theme.spacing(10),
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
    marginTop: '5%',
    height: '100%',
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

  return (
    <Typography variant="h3" className={classes.title}>
      Sign in
    </Typography>
  );
};

export default function Signin(props) {
  const classes = useStyles();

  const isSignupCompleted = useSelector(state => selectors.signupStatus(state) === 'done');
  const signupMessage = useSelector(state => selectors.signupMessage(state));

  return (
    <div className={classes.wrapper}>
      <div className={classes.headerBorder}>
        <div className={classes.externalLink} onClick={() => { props.history.goBack(); }}>
          <img src={getImageUrl('/images/backToShopify.png')} alt="backToShopify" />
        </div>
      </div>

      <div className={classes.signinWrapper}>
        <div className={classes.signinWrapperContent}>
          <div className={classes.logo}>
            <CeligoLogo />
          </div>
          <Title />
          {
            isSignupCompleted && (
            <Typography variant="body2" className={classes.signupSuccess} >
              {signupMessage}
            </Typography>
            )
          }
          <SigninForm
            {...props}
            dialogOpen={false}
            className={classes.signInForm}
          />
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
    </div>
  );
}
