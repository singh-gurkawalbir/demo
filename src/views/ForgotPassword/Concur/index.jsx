import React, { useState } from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { Typography, Box, styled } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Link, useLocation } from 'react-router-dom';
import { TextButton } from '@celigo/fuse-ui';
import ForgotPasswordForm from './ForgotPasswordForm';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import messageStore, { message } from '../../../utils/messageStore';
import getImageUrl from '../../../utils/image';
import ShowErrorMessage from '../../../components/ShowErrorMessage';

/* Todo: (Azhar) Concur form should be in a separate component */
const StyledTitle = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(0, 0, 4, 0),
  lineHeight: '38px',
  color: '#677A89',
  fontFamily: '"Roboto", Helvetica, sans-serif',
  fontSize: '32px',
  fontWeight: 'normal',
}));

const StyledWrapper = styled(Box)(({ theme }) => ({
  margin: '0 auto',
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100vh',
  background: theme.palette.background.paper,
}));

const StyledSignInWrapper = styled(Box)(({ theme }) => ({
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
}));

const StyledSignInWrapperContent = styled(Box)({
  display: 'table-cell',
  verticalAlign: 'middle',
  padding: '10px 0',
  '& > p': {
    margin: '0 auto 15px auto',
    width: '327px',
  },
});

const useStyles = makeStyles(theme => ({
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
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
    },
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

  return (
    <StyledWrapper>
      <StyledSignInWrapper>
        <StyledSignInWrapperContent>
          <Box
            sx={{
              margin: '0 0 40px 0',
              '& > img': {
                width: 'auto',
              },
            }}>
            <img alt="SapConcur" src={getImageUrl('/images/celigo-sapconcur.png')} />
          </Box>
          <StyledTitle variant="h1" className={classes.title}>
            Forgot your password?
          </StyledTitle>
          {email && (
          <Typography
            variant="h4"
            sx={{
              marginTop: theme => theme.spacing(-2),
              marginBottom: theme => theme.spacing(3),
            }}>
            {email}
          </Typography>
          )}
          { showError && resetRequestErrorMsg && (
            <ShowErrorMessage error={resetRequestErrorMsg} />
          )}
          <Box sx={{ margin: '0 auto 15px auto', width: '327px' }}>
            <Box component="span" sx={{ marginLeft: theme => theme.spacing(1) }}>
              {successView ? messageStore('USER_SIGN_IN.FORGOT_PASSWORD_USER_EXIST', {email})
                : message.USER_SIGN_IN.RESET_PASSWORD_CONCUR}
            </Box>
          </Box>
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
                sx={{paddingLeft: 4}}
                onClick={handleClick}
                component={Link}
                to="/signin?application=concur"
              >
                Sign in
              </TextButton>
            </Typography>
          ) : ''}
          <Box
            sx={{
              padding: '20px 0',
              margin: '20px 0 0',
              borderTop: '1px solid #D8E5EF',
              '& > a': {
                color: '#6A7B89',
                padding: '0 15px',
              },
            }}>
            <a href="https://www.celigo.com/privacy/" target="_blank" rel="noreferrer" >Privacy</a>
            <a href="https://www.celigo.com/terms-of-service/" target="_blank" rel="noreferrer" >Terms of Service</a>
            <a href="https://www.celigo.com/support/" target="_blank" rel="noreferrer" >Support</a>
          </Box>
        </StyledSignInWrapperContent>
      </StyledSignInWrapper>
    </StyledWrapper>
  );
}
