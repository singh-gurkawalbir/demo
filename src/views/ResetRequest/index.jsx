import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ResetPasswordForm from './resetPasswordForm';
import useQuery from '../../hooks/useQuery';
import ConcurResetPasswordPage from './Concur';
import { selectors } from '../../reducers';
import actions from '../../actions';
import { ACTIVE_SESSION_MESSAGE } from '../../constants';
import UserSignInPage from '../../components/UserSignInPage';

function ResetPassword(props) {
  const dispatch = useDispatch();
  const isActiveSession = useSelector(state => selectors.sessionInfo(state)?.authenticated);

  useEffect(() => {
    dispatch(actions.auth.validateSession());
  }, [dispatch]);

  return (

    <UserSignInPage
      pageTitle="Reset password"
      alertMessage={isActiveSession && ACTIVE_SESSION_MESSAGE}>
      {!isActiveSession && (
        <ResetPasswordForm
          {...props}
          dialogOpen={false} />
      )}
    </UserSignInPage>
  );
}

export default function RequestResetWrapper(props) {
  const query = useQuery();
  const application = query.get('application');
  let ResetPasswordPage = ResetPassword;

  if (application) {
    switch (application) {
      case 'concur':
        ResetPasswordPage = ConcurResetPasswordPage;
        break;
      default:
        break;
    }
  }

  return <ResetPasswordPage {...props} />;
}
