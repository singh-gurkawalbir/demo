import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SetPasswordForm from './setPasswordForm';
import { selectors } from '../../reducers';
import actions from '../../actions';
import { ACTIVE_SESSION_MESSAGE } from '../../constants';
import UserSignInPage from '../../components/UserSignInPage';

export default function SetPassword(props) {
  const dispatch = useDispatch();
  const isActiveSession = useSelector(state => selectors.sessionInfo(state)?.authenticated);

  useEffect(() => {
    dispatch(actions.auth.validateSession());
  }, [dispatch]);

  return (

    <UserSignInPage
      pageTitle="Create your password"
      alertMessage={isActiveSession && ACTIVE_SESSION_MESSAGE}
    >
      {!isActiveSession && (
        <SetPasswordForm
          {...props}
          dialogOpen={false}
          />
      )}
    </UserSignInPage>
  );
}
