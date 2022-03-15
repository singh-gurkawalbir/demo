import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors } from '../reducers';
import actions from '../actions';

export default function useFetchIntegrationUsers({ integrationId }) {
  const dispatch = useDispatch();
  const integrationUsers = useSelector(state =>
    selectors.availableUsersList(state, integrationId)
  );

  useEffect(() => {
    if (integrationId && !integrationUsers) {
      dispatch(actions.resource.requestCollection(`integrations/${integrationId}/ashares`));
    }
  }, [integrationUsers, integrationId, dispatch]);

  return integrationUsers;
}
