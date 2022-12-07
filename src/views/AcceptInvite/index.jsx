import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, Typography, Link } from '@material-ui/core';
import { useHistory, useRouteMatch } from 'react-router-dom';
import SignUp from './SignUpForm';
import CeligoLogo from '../../components/CeligoLogo';
import { getDomain } from '../../utils/resource';
import { selectors } from '../../reducers';
import MarketingContentWithIframe from '../../components/LoginScreen/MarketingContentWithIframe';
import actions from '../../actions';
import { emptyObject } from '../../constants';
import RawHtml from '../../components/RawHtml';

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
    position: 'relative',
    justifyContent: 'center',
    width: 300,
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
  signupLink: {
    position: 'absolute',
    bottom: theme.spacing(8),
  },
  signInForm: {
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100%',
    },
  },
  disclaimer: {
    display: 'flex',
    maxWidth: '300px',
    wordBreak: 'break-word',
    marginBottom: '10px',
    padding: '10px',
    borderLeft: '5px solid #00a1e1',
    background: '#FFFFFF',
    boxShadow: '0px 1px 4px rgb(106 123 137 / 45%)',
    borderRadius: '6px',
    fontWeight: '400',
    maxHeight: '63px',
    color: '#333d47',
    boxSizing: 'border-box',
    alignItems: 'center',
  },
  disclaimerIcon: {
    width: '65px',
    fill: '#00a1e1',
  },
  disclaimerMessage: {
    fontSize: '15px',
    lineHeight: '16px',
    color: '#333D47',
    paddingLeft: '12px',
    paddingRight: '20px',
  },
}));

export default function AcceptInvite(props) {
  const match = useRouteMatch();
  const { token } = match.params;
  const classes = useStyles();
  // eslint-disable-next-line no-undef
  const contentUrl = (getDomain() === 'eu.integrator.io' ? IO_LOGIN_PROMOTION_URL_EU : IO_LOGIN_PROMOTION_URL);
  const data = useSelector(selectors.acceptInviteData) || emptyObject;
  const redirectUrl = useSelector(selectors.shouldRedirectToSignIn);
  const { message = [], type, skipPassword, ssoLink } = data;
  const showError = !!message.length && type === 'error';
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (redirectUrl) {
      dispatch(actions.auth.acceptInvite.clear());
      history.push(redirectUrl);
    }
  }, [dispatch, history, redirectUrl]);

  useEffect(() => {
    dispatch(actions.auth.acceptInvite.validate(token));
  }, [dispatch, token]);

  return (
    <div className={classes.wrapper}>
      <div className={classes.signinWrapper}>
        <div className={classes.signinWrapperContent}>
          <div className={classes.logo}>
            <CeligoLogo />
          </div>
          {showError ? (
            <Typography color="error" style={{fontSize: 15, lineHeight: '19px' }}><RawHtml html={message[0]} /></Typography>
          ) : (
            <>
              <Typography variant="h3" className={classes.title}>
                Sign up
              </Typography>
              {skipPassword && (
                <div className={classes.disclaimer}>
                  <svg className={classes.disclaimerIcon} focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M11.6,9.16h0.81c0.55,0,0.83-0.28,0.83-0.84v-0.7c0-0.56-0.28-0.84-0.83-0.84H11.6c-0.57,0-0.85,0.28-0.85,0.84 v0.7C10.75,8.88,11.03,9.16,11.6,9.16z M14.27,15.21h-0.7c-0.18,0-0.33-0.15-0.33-0.33v-4.64c0-0.18-0.15-0.33-0.33-0.33H9.97 c-0.18,0-0.33,0.15-0.33,0.33v0.85c0,0.18,0.15,0.33,0.33,0.33h0.98c0.18,0,0.33,0.15,0.33,0.33v3.13c0,0.18-0.15,0.33-0.33,0.33 H9.73c-0.18,0-0.33,0.15-0.33,0.33v1.35c0,0.18,0.15,0.33,0.33,0.33h4.55c0.18,0,0.33-0.15,0.33-0.33v-1.35 C14.61,15.35,14.46,15.21,14.27,15.21z M12,1C5.93,1,1,5.93,1,12c0,6.07,4.93,11,11,11c6.07,0,11-4.93,11-11C23,5.93,18.07,1,12,1z M12,21.86c-5.44,0-9.86-4.42-9.86-9.86c0-5.44,4.42-9.86,9.86-9.86s9.86,4.42,9.86,9.86C21.86,17.44,17.44,21.86,12,21.86z" />
                  </svg>
                  <p className={classes.disclaimerMessage}>
                    This is an SSO sign-up. Make sure you have access to<a className="link" href={ssoLink}> this </a>SSO provider
                  </p>
                </div>
              )}
              <SignUp
                {...props}
                dialogOpen={false}
                className={classes.signInForm}
                />
              {getDomain() !== 'eu.integrator.io' && (
              <Typography variant="body2" className={classes.signupLink}>
                Already have an account?
                <Link href="/signin" className={classes.link}>
                  Sign in
                </Link>
              </Typography>
              )}
            </>
          )}
        </div>
      </div>
      <div className={classes.marketingContentWrapper}>
        <MarketingContentWithIframe contentUrl={contentUrl} />
      </div>
    </div>
  );
}
