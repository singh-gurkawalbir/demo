import React, { useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../reducers';
import actions from '../../actions';
import getRoutePath from '../../utils/routePaths';
import { ACTIVE_SESSION_MESSAGE } from '../../constants';
import UserSignInPage from '../../components/UserSignInPage';

export default function ChangeEmail(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const changeEmailStatus = useSelector(state => selectors.changeEmailStatus(state));
  const changeEmailMessage = useSelector(state => selectors.changeEmailMessage(state));
  const ChangeEmailErrMessage = useSelector(state => selectors.changeEmailErrorMessage(state));
  const token = React.useState(props.match.params.token ? props.match.params.token : '');
  const isActiveSession = useSelector(state => selectors.sessionInfo(state)?.authenticated);

  useEffect(() => {
    dispatch(actions.auth.changeEmailRequest(token));
    dispatch(actions.auth.validateSession());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (changeEmailStatus === 'success') {
      dispatch(actions.auth.signupStatus('done', changeEmailMessage));
      history.replace(getRoutePath('/signin?from=change=email'));
    }
  }, [dispatch, history, changeEmailStatus, changeEmailMessage]);

  if (changeEmailStatus === 'failed') {
    return (
      <>
        <UserSignInPage
          pageTitle="Failed to change email address."
          pageSubHeading={!isActiveSession && ChangeEmailErrMessage}
          alertMessage={isActiveSession && ACTIVE_SESSION_MESSAGE}
       />
      </>
    );
  }

  return <Spinner center="screen" />;
}
