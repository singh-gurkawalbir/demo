import React from 'react';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ResetPasswordForm from './ResetPasswordForm';

const useStyles = makeStyles(theme => ({
  wrapper: {
    flexGrow: 1,
    display: 'grid',
    gridTemplateColumns: '30% 70%',
    height: '100vh',
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '100%',
    },
  },
  marketingContentWrapper: {
    [theme.breakpoints.down('md')]: {
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
  resetPasswordWrapper: {
    background: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  resetPasswordContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 300,
    marginTop: '50%',
    height: '100%',
    [theme.breakpoints.down('md')]: {
      marginTop: 0,
    },
  },
  title: {
    marginBottom: theme.spacing(2),
    fontSize: 30,
    lineHeight: '40px',
  },
  resetPasswordForm: {
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
    },
  },
}));

export default function ResetPassword(props) {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <div className={classes.resetPasswordWrapper}>
        <div className={classes.resetPasswordContent}>
          <div className={classes.logo} />
          <Typography variant="h3" className={classes.title}>
            Reset Password
          </Typography>
          <ResetPasswordForm
            {...props}
            dialogOpen={false}
            className={classes.resetPasswordForm}
          />
        </div>
      </div>
    </div>
  );
}
