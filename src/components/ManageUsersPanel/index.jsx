import { Fragment, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import * as selectors from '../../reducers';
import { USER_ACCESS_LEVELS } from '../../utils/constants';
import IconTextButton from '../IconTextButton';
import UsersIcon from '../icons/SingleUserIcon';
import PanelHeader from '../PanelHeader';
import UserDialog from './UserDialog';
import UserList from './UserList';

export default function ManageUsersPanel({ integrationId }) {
  const [showDialog, setShowDialog] = useState(false);
  const [userId, setUserId] = useState();
  const permissions = useSelector(state => selectors.userPermissions(state));
  const isAccountOwner =
    permissions.accessLevel === USER_ACCESS_LEVELS.ACCOUNT_OWNER;
  const handleCloseDialog = useCallback(() => {
    setShowDialog(false);
  }, []);
  const handleInviteUserClick = useCallback(() => {
    setShowDialog(true);
    setUserId();
  }, []);
  const handleEditUserClick = useCallback(userId => {
    setShowDialog(true);
    setUserId(userId);
  }, []);
  const infoTextUsers =
    'Invite users to either Manage or Monitor your integrations. A user that has been invited to Manage an integration will have permissions to edit and make changes to the existing flows, or create new flows within an integration tile. A user that has Monitor permissions will only be allowed to view the integration, they do not have permissions to make any changes. They are however allowed to run the flows within the integration. The user will only see your integrations that you have invited them to.';

  return (
    <Fragment>
      <UserDialog
        open={showDialog}
        userId={userId}
        onClose={handleCloseDialog}
        onSuccess={handleCloseDialog}
      />

      <PanelHeader title="Users" infoText={infoTextUsers}>
        {isAccountOwner && (
          <IconTextButton onClick={handleInviteUserClick}>
            <UsersIcon /> Invite user
          </IconTextButton>
        )}
      </PanelHeader>

      <UserList
        integrationId={integrationId}
        onEditUserClick={handleEditUserClick}
      />
    </Fragment>
  );
}
