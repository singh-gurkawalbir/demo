import { Fragment, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import * as selectors from '../../reducers';
import { USER_ACCESS_LEVELS } from '../../utils/constants';
import IconTextButton from '../IconTextButton';
import UsersIcon from '../icons/GroupOfUsersIcon';
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

  return (
    <Fragment>
      <UserDialog
        open={showDialog}
        userId={userId}
        onClose={handleCloseDialog}
        onSuccess={handleCloseDialog}
      />

      <PanelHeader title="Users">
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
