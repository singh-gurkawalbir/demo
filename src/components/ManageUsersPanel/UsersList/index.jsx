import React, { useMemo, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ResourceTable from '../../ResourceTable';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import { USER_ACCESS_LEVELS } from '../../../utils/constants';
import ManagePermissionsDrawer from '../Drawers/ManagePermissions';
import InviteUserDrawer from '../Drawers/InviteUser';
import ViewNotificationsDrawer from '../Drawers/ViewNotifications';
import ManageNotificationsDrawer from '../Drawers/ManageNotifications';
import LoadResources from '../../LoadResources';

export default function UsersList({ integrationId, storeId, className }) {
  const dispatch = useDispatch();
  const isAccountOwner = useSelector(state =>
    [USER_ACCESS_LEVELS.ACCOUNT_OWNER].includes(selectors.resourcePermissions(state).accessLevel)
  );

  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
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

  const actionProps = useMemo(() => (
    {
      integrationId,
      storeId,
      isUserInErrMgtTwoDotZero,
    }), [integrationId, storeId, isUserInErrMgtTwoDotZero]);

  return (
    <>
      <LoadResources required resources="integrations, connections, notifications">
        <ResourceTable
          resources={users}
          className={className}
          resourceType={isAccountOwner ? 'orgOwnerUsers' : 'orgUsers'}
          actionProps={actionProps}
        />
      </LoadResources>
      <InviteUserDrawer />
      <ManagePermissionsDrawer integrationId={integrationId} />
      { integrationId
        ? (
          <>
            <ViewNotificationsDrawer integrationId={integrationId} storeId={storeId} />
            <ManageNotificationsDrawer integrationId={integrationId} storeId={storeId} />
          </>
        ) : null }

    </>
  );
}

