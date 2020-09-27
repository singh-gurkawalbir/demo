import React, { useMemo, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ResourceTable from '../../ResourceTable';
import { selectors } from '../../../reducers';
import actions from '../../../actions';

export default function UsersList({ integrationId }) {
  const dispatch = useDispatch();
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

  const actionProps = useMemo(() => ({ integrationId }), [integrationId]);

  return (
    <ResourceTable
      resources={users}
      resourceType="users"
      actionProps={actionProps}
    />
  );
}
