import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { selectors } from '../../reducers';
import { DRAWER_URL_PREFIX } from '../../utils/rightDrawer';
import AddIcon from '../icons/AddIcon';
import PanelHeader from '../PanelHeader';
import UsersList from './UsersList';
import { TextButton } from '../Buttons';

const useStyles = makeStyles(theme => ({
  userListWrapper: {
    overflow: 'visible',
  },
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    minHeight: 124,
  },
}));

const infoTextUsers =
  `Invite users to either Administer your account, 
  or Manage or Monitor your integrations. A user who 
  has been invited to Administer an account will have 
  all the same permissions as the account Owner, 
  including inviting users and changing their access 
  rights. A user who has been invited to Manage an 
  integration will have permissions to edit existing 
  flows or create flows within an integration tile. A 
  user who has Monitor permissions will only be allowed 
  to view the integration, they do not have permissions 
  to make any changes. They are however allowed to run 
  the flows within the integration. The user will see 
  only those integrations that you have invited them to.`;

export default function ManageUsersPanel({ integrationId, childId }) {
  const classes = useStyles();
  const match = useRouteMatch();
  const history = useHistory();
  const isAccountOwner = useSelector(state => selectors.isAccountOwnerOrAdmin(state));

  const handleInvite = useCallback(() => history.push(`${match.url}/${DRAWER_URL_PREFIX}/invite`), [history, match]);

  return (
    <div className={classes.root}>
      <PanelHeader title="Users" infoText={infoTextUsers}>
        {isAccountOwner && (
          <TextButton onClick={handleInvite} startIcon={<AddIcon />}>
            Invite user
          </TextButton>
        )}
      </PanelHeader>
      <UsersList integrationId={integrationId} childId={childId} className={classes.userListWrapper} />
    </div>
  );
}

