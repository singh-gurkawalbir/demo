import React, { useState } from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { makeStyles, Typography } from '@material-ui/core';
import { Link, useLocation } from 'react-router-dom';
import ForgotPasswordForm from './ForgotPasswordForm';
import { selectors } from '../../../reducers';
import { TextButton } from '../../../components/Buttons';
import actions from '../../../actions';
import messageStore from '../../../utils/messageStore';
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
    '& > img': {
      width: 'auto',
    },
  },
  link: {
    paddingLeft: 4,
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
  alertMsg: {
    width: '100%',
    fontSize: 14,
    textAlign: 'left',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
    lineHeight: `${theme.spacing(2)}px`,
    '& > svg': {
      fill: theme.palette.error.main,
      fontSize: theme.spacing(2),
      marginRight: 5,
    },
  },
  title: {
    margin: theme.spacing(0, 0, 4, 0),
    lineHeight: '38px',
    color: '#677A89',
    fontFamily: '"Roboto", Helvetica, sans-serif',
    fontSize: '32px',
    fontWeight: 'normal',
  },
  mfaTitle: {
    marginBottom: theme.spacing(3),
    fontSize: 30,
    lineHeight: '28px',
    width: 290,
    textAlign: 'center',
  },
  signupLink: {
    position: 'relative',
    // bottom: theme.spacing(8),
  },
  ForgotPasswordForm: {
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100%',
    },
  },
  mfaInfo: {
    margin: '0 auto 15px auto',
    width: '327px',
  },
  infoText: {
    marginLeft: theme.spacing(1),
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
  bottom: {
    padding: '20px 0',
    margin: '20px 0 0',
    borderTop: '1px solid #D8E5EF',
    '& > a': {
      color: '#6A7B89',
      padding: '0 15px',
    },
  },
  forgotPasswordEmail: {
    marginTop: theme.spacing(-2),
    marginBottom: theme.spacing(3),
  },
}));

export default function ConcurForgotPassword(props) {
  const [showError, setShowError] = useState(false);
  const resetRequestStatus = useSelector(state => selectors.requestResetStatus(state));
  const successView = (resetRequestStatus === 'success');
  const resetRequestErrorMsg = useSelector(state => selectors.requestResetError(state));
  const email = useSelector(state => selectors.requestResetEmail(state));
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  function handleClick() {
    dispatch(actions.auth.resetRequestSent());
  }
  let message = 'Please note that after you reset your password, you have to go back to the Concur App Center and connect again to the Celigo app.';

  if (successView) {
    message = `If ${email} ${messageStore('FORGOT_PASSWORD_USER_EXIST')}`;
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.signinWrapper}>
        <div className={classes.signinWrapperContent}>
          <div className={classes.logo}>
            <img alt="SapConcur" src={getImageUrl('/images/celigo-sapconcur.png')} />
          </div>
          <Typography variant="h1" className={classes.title}>
            Forgot your password?
          </Typography>
          {email && (
          <Typography variant="h4" className={classes.forgotPasswordEmail}>
            {email}
          </Typography>
          )}
          { showError && resetRequestErrorMsg && (
          <Typography
            data-private
            color="error"
            component="div"
            variant="h5"
            className={classes.alertMsg}>
            {resetRequestErrorMsg}
          </Typography>
          )}
          <div className={classes.mfaInfo}>
            <span className={classes.infoText}>{message}</span>
          </div>
          {!successView
            ? (
              <ForgotPasswordForm
                {...props}
                setShowError={setShowError}
                dialogOpen={false}
                email={queryParams.get('email')}
                className={classes.signInForm}
          />
            ) : ''}
          {successView ? (
            <Typography variant="body2">
              Back to
              <TextButton
                data-test="signin"
                color="primary"
                className={classes.link}
                onClick={handleClick}
                component={Link}
                to="/signin?application=concur">
                Sign in
              </TextButton>
            </Typography>
          ) : ''}
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
