import React from 'react';
import { TextField, Typography, Button } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { CeligoLogo } from '@celigo/fuse-ui';
import { OutlinedButton } from '../../Buttons';
import FilledButton from '../../Buttons/FilledButton';

const useStyles = makeStyles(theme => ({
  signUpForm: {
    background: theme.palette.background.paper,
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
    background: theme.palette.background.paper,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      marginTop: 0,
    },
    [theme.breakpoints.up('md')]: {
      marginTop: 0,
    },
    [theme.breakpoints.down('xl')]: {
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
      [theme.breakpoints.down('md')]: {
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
  passwordTextField: {
    '& * >.MuiFilledInput-input': {
      letterSpacing: '2px',
      '&::placeholder': {
        letterSpacing: '1px',
      },
    },
  },
  gridImgWrapper: {
    background: `center / contain no-repeat url('https://integrator-staging-ui-resources.s3.amazonaws.com/react/static/images/public-pages.svg'), ${theme.palette.background.default}`,
    padding: theme.spacing(2),
    backgroundOrigin: 'content-box, padding-box',
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
}));
export default function LoginForm() {
  const classes = useStyles();

  return (
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
            className={classes.fieldWrapper} />
          <TextField
            className={clsx(classes.fieldWrappe, classes.passwordTextField)}
            htmlFor="password"
            fullWidth
            placeholder="Password*"
            variant="filled"
            type="password" />
          <div className={classes.forgotPasswordWrapper}>
            <Button href="" target="self" className={classes.forgotPasswordLink}>
              Forgot password?
            </Button>
          </div>
          <FilledButton
            variant="contained"
            fullWidth
            color="primary"
            value="Submit"
            submitBtn
            onClick={() => 'Form Submitted!'}
            className={classes.submitBtn}>Sign in
          </FilledButton>
          <div className={classes.or}>
            <Typography variant="body1">or</Typography>
          </div>
          <form className={classes.googleBtnForm}>
            <OutlinedButton
              type="button"
              color="secondary"
              onClick={() => 'sign in with google'}
              googleBtn>
              Sign in with Google
            </OutlinedButton>
          </form>
        </div>
        <Typography component="div" className={classes.signuplinkWrapper}>
          Don&apos;t have an account?
          <Button
            href="#"
            className={classes.signUpLink}>
            Sign up
          </Button>
        </Typography>
      </div>
    </div>
  );
}
