import React, { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ResourceTable from '../../ResourceTable';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import ManagePermissionsDrawer from '../Drawers/ManagePermissions';
import InviteUserDrawer from '../Drawers/InviteUser';
import ViewNotificationsDrawer from '../Drawers/ViewNotifications';
import ManageNotificationsDrawer from '../Drawers/ManageNotifications';
import LoadResources from '../../LoadResources';

export default function UsersList({ integrationId, storeId, className }) {
  const dispatch = useDispatch();
  const accessLevel = useSelector(state => selectors.resourcePermissions(state)?.accessLevel);
  const isAccountOwner = useSelector(state => selectors.isAccountOwnerOrAdmin(state));
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  const users = useSelector(state => selectors.availableUsersList(state, integrationId));

  useEffect(() => {
    if (integrationId) {
      dispatch(
        actions.resource.requestCollection(
          ['integrations', integrationId, 'ashares'].join('/')
        )
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actionProps = useMemo(() => (
    {
      integrationId,
      storeId,
      accessLevel,
      isUserInErrMgtTwoDotZero,
    }), [integrationId, storeId, accessLevel, isUserInErrMgtTwoDotZero]);

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

