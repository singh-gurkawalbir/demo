import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors } from '../reducers';
import actions from '../actions';

export default function useFetchIntegrationUsers(integrationId) {
  const dispatch = useDispatch();
  const integrationUsers = useSelector(state =>
    selectors.availableUsersList(state, integrationId)
  );
  const isIntegrationUsersRequested = useSelector(state =>
    !!selectors.integrationUsers(state, integrationId)
  );

  useEffect(() => {
    if (integrationId && !isIntegrationUsersRequested) {
      dispatch(actions.resource.requestCollection(`integrations/${integrationId}/ashares`));
    }
  }, [isIntegrationUsersRequested, integrationId, dispatch]);

  return integrationUsers;
}
