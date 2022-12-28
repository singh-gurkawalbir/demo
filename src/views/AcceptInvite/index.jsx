import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { useHistory, useRouteMatch } from 'react-router-dom';
import SignUp from './SignUpForm';
import { selectors } from '../../reducers';
import actions from '../../actions';
import { emptyObject } from '../../constants';
import RawHtml from '../../components/RawHtml';
import UserSignInPage from '../../components/UserSignInPage';
import NotificationToaster from '../../components/NotificationToaster';

const useStyles = makeStyles({
  disclaimer: {
    marginBottom: '10px',
  },
});

export default function AcceptInvite(props) {
  const match = useRouteMatch();
  const { token } = match.params;
  const classes = useStyles();
  const data = useSelector(selectors.acceptInviteData) || emptyObject;
  const redirectUrl = useSelector(selectors.shouldRedirectToSignIn);
  // eslint-disable-next-line no-unused-vars
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
    <>
      {!showError ? (
        <UserSignInPage
          alertMessage={showError && <RawHtml html={message[0]} />}
     />
      ) : (
        <UserSignInPage
          pageTitle="Sign up"
          footerLinkLabel="Already have an account?"
          footerLinkText="Sign in"
          footerLink="signin">
          {skipPassword && (
            <>
              <NotificationToaster variant="info" className={classes.disclaimer}>
                <RawHtml html={'This is an SSO sign-up. Make sure you have access to <a className="link" href=ssoLink>this</a> SSO provider'} />
              </NotificationToaster>
            </>
          )}
          <SignUp
            {...props}
            dialogOpen={false}
                />
        </UserSignInPage>
      )}
    </>
  );
}
