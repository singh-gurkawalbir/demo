import { makeStyles } from '@material-ui/core/styles';
import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import * as selectors from '../../reducers';
import { USER_ACCESS_LEVELS } from '../../utils/constants';
import IconTextButton from '../IconTextButton';
import UsersIcon from '../icons/SingleUserIcon';
import PanelHeader from '../PanelHeader';
import UserDialog from './UserDialog';
import UserList from './UserList';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    overflow: 'visible',
  },
}));

export default function ManageUsersPanel({ integrationId }) {
  const classes = useStyles();
  const [showDialog, setShowDialog] = useState(false);
  const [userId, setUserId] = useState();
  const isAccountOwner = useSelector(
    state =>
      selectors.resourcePermissions(state).accessLevel ===
      USER_ACCESS_LEVELS.ACCOUNT_OWNER
  );
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
    <div className={classes.root}>
      {showDialog && (
        <UserDialog
          open={showDialog}
          userId={userId}
          onClose={handleCloseDialog}
          onSuccess={handleCloseDialog}
        />
      )}
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
    </div>
  );
}
