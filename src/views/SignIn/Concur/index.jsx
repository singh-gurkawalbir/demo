import React from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import SigninForm from './SignInForm';
import messageStore, { message } from '../../../utils/messageStore';
import { selectors } from '../../../reducers';
import InfoIcon from '../../../components/icons/InfoIcon';
import { SIGN_UP_SUCCESS } from '../../../constants';
import getImageUrl from '../../../utils/image';

const useStyles = makeStyles(theme => ({
  wrapper: {
    margin: '0 auto',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100vh',
    background: theme.palette.background.paper,
  },
  logo: {
    margin: '0 0 40px 0',
  },
  link: {
    paddingLeft: 4,
    color: theme.palette.warning.main,
  },
  signinWrapper: {
    background: theme.palette.background.paper,
    width: '770px',
    height: '100vh',
    border: '0px none',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
    overflow: 'inherit !important',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signinWrapperContent: {
    display: 'table-cell',
    verticalAlign: 'middle',
    padding: '10px 0',
    '& > p': {
      margin: '0 auto 15px auto',
      width: '327px',
    },
  },
  title: {
    color: '#677A89',
    fontFamily: '"Roboto", Helvetica, sans-serif',
    fontSize: '20px',
    lineHeight: '38px',
    fontWeight: 'normal',
    margin: '0 0 30px 0',
  },
  bottom: {
    padding: '20px 0',
    margin: '20px 0 0',
    borderTop: '1px solid #D8E5EF',
    '& > a': {
      color: '#6A7B89',
      padding: '0 15px',
    },
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
    width: '327px',
    margin: '0 auto',
    '& > div': {
      marginBottom: '5px',
      maxWidth: '390px',
      marginLeft: 'auto',
      marginRight: 'auto',
      position: 'relative',
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

const Title = ({ isMFAAuthRequired }) => {
  const classes = useStyles();
  const { isAccountUser, noOfDays } = useSelector(selectors.mfaAuthInfo);

  if (!isMFAAuthRequired) {
    return (
      <Typography variant="h1" className={classes.title}>
        Link your Celigo account with SAP Concur
      </Typography>
    );
  }

  let infoMessage;

  if (isAccountUser) {
    infoMessage = noOfDays ? messageStore('MFA.USER_OTP_INFO_FOR_TRUSTED_NUMBER_OF_DAYS', { noOfDays }) : message.MFA.USER_OTP_INFO;
  } else {
    infoMessage = message.MFA.OWNER_OTP_INFO;
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

export default function Signin(props) {
  const classes = useStyles();
  const isSignupCompleted = useSelector(state => selectors.signupStatus(state) === 'done');
  const isMFAAuthRequired = useSelector(state => selectors.isMFAAuthRequired(state));

  return (
    <div className={classes.wrapper}>
      <div className={classes.signinWrapper}>
        <div className={classes.signinWrapperContent}>
          <div className={classes.logo}>
            <img alt="SapConcur" src={getImageUrl('/images/celigo-sapconcur.png')} />
          </div>
          <Title isMFAAuthRequired={isMFAAuthRequired} />
          {
            isSignupCompleted && (
            <Typography variant="body2" className={classes.signupSuccess} >
              {SIGN_UP_SUCCESS}
            </Typography>
            )
          }
          <Typography>
            {messageStore('USER_SIGN_IN.NEW_USER_IO', {link: '<a className="external-link" href="https://concursolutions.com">here.</a>' })}
          </Typography>
          <SigninForm
            {...props}
            dialogOpen={false}
            className={classes.signInForm}
          />
          <div className={classes.bottom}>
            <a href="https://www.celigo.com/privacy/" target="_blank" rel="noreferrer" >Privacy</a>
            <a href="https://www.celigo.com/terms-of-service/" target="_blank" rel="noreferrer" >Terms of Service</a>
            <a href="https://www.celigo.com/support/" target="_blank" rel="noreferrer" >Support</a>
          </div>
        </div>
      </div>
    </div>
  );
}

