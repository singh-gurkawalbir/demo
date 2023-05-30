import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Spinner } from '@celigo/fuse-ui';
import SignUp from './SignUpForm';
import { selectors } from '../../reducers';
import actions from '../../actions';
import { emptyObject } from '../../constants';
import RawHtml from '../../components/RawHtml';
import UserSignInPage from '../../components/UserSignInPage';
import NotificationToaster from '../../components/NotificationToaster';
import Loader from '../../components/Loader';
import {message as messageStoreMessage} from '../../utils/messageStore';

const useStyles = makeStyles({
  disclaimer: {
    marginBottom: '10px',
  },
});

export default function AcceptInvite(props) {
  const match = useRouteMatch();
  const [isStatusRquested, setIsStatusRquested] = useState(false);
  const { token } = match.params;
  const classes = useStyles();
  const data = useSelector(selectors.acceptInviteData) || emptyObject;
  const redirectUrl = useSelector(selectors.shouldRedirectToSignIn);
  // eslint-disable-next-line no-unused-vars
  const { message = [], type, skipPassword, ssoLink } = data;
  const showError = !!message.length && type === 'error';
  const isLoading = data.status === 'requested';
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (redirectUrl) {
      dispatch(actions.auth.acceptInvite.clear());
      setIsStatusRquested(true);
      if (redirectUrl.includes('sso')) {
        // Reload the page instead of app routing to url
        window.location.href = redirectUrl;
      } else {
        history.push(redirectUrl);
      }
    }
  }, [dispatch, history, redirectUrl]);

  useEffect(() => {
    dispatch(actions.auth.acceptInvite.validate(token));
  }, [dispatch, token]);

  if (isLoading || isStatusRquested) return <Loader open>Loading...<Spinner /></Loader>;

  return (
    <>
      {showError ? (
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
                <RawHtml html={messageStoreMessage.MFA.SSO_SIGN_UP} />
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
