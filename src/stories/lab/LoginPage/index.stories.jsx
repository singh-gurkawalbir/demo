import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
import {makeStyles, Typography, Button, TextField} from '@material-ui/core';
import CeligoLogo from '../../../components/CeligoLogo';
import MarketingContent from './MarketingContent';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'grid',
    gridTemplateColumns: '30% 70%',
    height: '100vh',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '100%',
    },
  },
  signUpForm: {
    background: theme.palette.common.white,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    [theme.breakpoints.up('lg')]: {
      height: '100vh',
    },
  },
  signuplinkWrapper: {
    color: theme.palette.secondary.light,
    fontFamily: 'sourcesanspro',
    fontSize: theme.spacing(2),
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: {
      position: 'relative',
      top: 0,
    },
    [theme.breakpoints.up('lg')]: {
      position: 'relative',
      top: 130,
    },
  },
  signUpLink: {
    color: theme.palette.primary.main,
    padding: 0,
  },
  formContainer: {
    marginTop: '50%',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      marginTop: 0,
    },
    [theme.breakpoints.up('md')]: {
      marginTop: 0,
    },
    [theme.breakpoints.down('lg')]: {
      padding: theme.spacing(3),
    },
  },
  fieldWrapper: {
    marginBottom: 10,
    width: '100%',
    '& > .MuiFormControl-root': {
      width: '100%',
    },
  },
  imgContainier: {
    '& > iframe': {
      width: '100%',
      height: '100%',
      border: '1px solid',
      borderColor: theme.palette.divider,
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
  },
  logo: {
    width: 150,
    paddingTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    '& > svg': {
      fill: theme.palette.primary.dark,
    },
  },
  title: {
    fontSize: 30,
    lineHeight: '40px',
    marginBottom: theme.spacing(2),
  },
  forgotPasswordWrapper: {
    justifyContent: 'flex-end',
    display: 'flex',
    '& > button': {
      '&:hover': {
        background: 'none',
      },
    },
  },
  forgotPasswordLink: {
    color: theme.palette.primary.dark,
    padding: 0,
  },
  or: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    margin: theme.spacing(2, 0),
    '&:before': {
      content: '""',
      width: '40%',
      borderTop: '1px solid',
      borderColor: theme.palette.secondary.lightest,
    },
    '&:after': {
      content: '""',
      width: '40%',
      borderTop: '1px solid',
      borderColor: theme.palette.secondary.lightest,
    },
  },
  googleBtn: {
    borderRadius: 4,
    border: '1px solid',
    borderColor: theme.palette.divider,
    width: '100%',
    background: 'url(https://d142hkd03ds8ug.cloudfront.net/images/googlelogo.png) 10% center no-repeat',
    backgroundSize: theme.spacing(2),
    height: 38,
    fontSize: 16,
    backgroundColor: theme.palette.background.paper,
  },
  googleBtnForm: {
    width: '100%',
  },
  submitBtn: {
    marginTop: 30,
  },
  formBox: {
    width: '100%',
    maxWidth: 500,
    textAlign: 'center',
    marginBottom: 130,
  },

}));

export function Login() {
  const classes = useStyles();
  const contentUrl = 'https://staging.celigo.com/login/display';

  return (
    <div className={classes.wrapper}>
      <div className={classes.signUpForm}>
        <div className={classes.formContainer}>
          <div className={classes.logo}>
            <CeligoLogo className={classes.logo} />
          </div>
          <Typography variant="h3" className={classes.title}>
            Sign in
          </Typography>
          <div className={classes.formBox}>
            <TextField
              htmlFor="email"
              variant="filled"
              placeholder="Email*"
              name="email"
              className={classes.fieldWrapper}
          />
            <TextField
              className={classes.fieldWrapper}
              htmlFor="password"
              placeholder="Password*"
              variant="filled"
              type="password" />
            <div className={classes.forgotPasswordWrapper}>
              <Button href="" target="self" className={classes.forgotPasswordLink}>
                Forgot password?
              </Button>
            </div>
            <Button
              variant="contained"
              fullWidth
              color="primary"
              value="Submit"
              onClick={action('Form Submitted!')}
              className={classes.submitBtn}>Sign in
            </Button>
            <div className={classes.or}>
              <Typography variant="body1">or</Typography>
            </div>
            <form className={classes.googleBtnForm}>
              <Button
                type="button"
                color="secondary"
                onClick={action('sign in with google')}
                className={classes.googleBtn}>
                Sign in with Google
              </Button>
            </form>
          </div>
          <Typography component="div" className={classes.signuplinkWrapper}>
            Don&apos;t have an account?
            <Button
              href="#"
              className={classes.signUpLink}
             >
              Sign up
            </Button>
          </Typography>
        </div>
      </div>
      <MarketingContent contentUrl={contentUrl} />
    </div>
  );
}

export default {
  title: 'Lab/ Marketing Login',
  component: Login,
};

