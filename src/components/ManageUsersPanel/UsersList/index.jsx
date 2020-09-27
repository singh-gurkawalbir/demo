import React, { useMemo, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ResourceTable from '../../ResourceTable';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import { USER_ACCESS_LEVELS } from '../../../utils/constants';

export default function UsersList({ integrationId }) {
  const dispatch = useDispatch();
  const permissions = useSelector(state => selectors.userPermissions(state));

  const users = useSelector(state => selectors.availableUsersList(state, integrationId));
  const requestIntegrationAShares = useCallback(() => {
    if (integrationId) {
      if (!users) {
        dispatch(
          actions.resource.requestCollection(
            ['integrations', integrationId, 'ashares'].join('/')
          )
        );
      }
    }
  }, [dispatch, integrationId, users]);

  useEffect(() => {
    requestIntegrationAShares();
  }, [requestIntegrationAShares]);

  const isAccountOwner =
  permissions.accessLevel === USER_ACCESS_LEVELS.ACCOUNT_OWNER;

  const actionProps = useMemo(() => ({ integrationId }), [integrationId]);

  return (
    <ResourceTable
      resources={users}
      resourceType={isAccountOwner ? 'usersForOwner' : 'sharedUsers'}
      actionProps={actionProps}
    />
  );
}
