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

export default function UsersList({ integrationId, childId, className }) {
  const dispatch = useDispatch();
  const accessLevel = useSelector(state => selectors.resourcePermissions(state)?.accessLevel);
  const isAccountOwner = useSelector(state => selectors.isAccountOwnerOrAdmin(state));
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  const users = useSelector(state => selectors.availableUsersList(state, integrationId));
  const isIntegrationUsersRequested = useSelector(state =>
    !!selectors.integrationUsers(state, integrationId)
  );
  const isSSOEnabled = useSelector(state => selectors.isSSOEnabled(state));

  useEffect(() => {
    if (integrationId && !isIntegrationUsersRequested) {
      dispatch(actions.resource.requestCollection(`integrations/${integrationId}/ashares`));
    }
  }, [isIntegrationUsersRequested, dispatch, integrationId]);

  const actionProps = useMemo(() => (
    {
      integrationId,
      childId,
      accessLevel,
      isUserInErrMgtTwoDotZero,
      isSSOEnabled,
    }), [integrationId, childId, accessLevel, isUserInErrMgtTwoDotZero, isSSOEnabled]);

  const requiredResources = ['integrations', 'connections', 'notifications'];

  if (isAccountOwner) {
    requiredResources.push('ssoclients');
  }

  return (
    <>
      <LoadResources required resources={requiredResources}>
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
            <ViewNotificationsDrawer integrationId={integrationId} childId={childId} />
            <ManageNotificationsDrawer integrationId={integrationId} childId={childId} />
          </>
        ) : null }

    </>
  );
}

