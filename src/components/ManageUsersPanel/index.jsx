import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { selectors } from '../../reducers';
import IconTextButton from '../IconTextButton';
import AddIcon from '../icons/AddIcon';
import PanelHeader from '../PanelHeader';
import UsersList from './UsersList';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    overflow: 'visible',
  },
  userListWrapper: {
    overflow: 'visible',
  },
}));

const infoTextUsers =
  `Invite users to either Manage or Monitor your integrations. 
  A user that has been invited to Manage an integration will have 
  permissions to edit and make changes to the existing flows, or 
  create new flows within an integration tile. A user that has Monitor 
  permissions will only be allowed to view the integration, they do not 
  have permissions to make any changes. They are however allowed to run 
  the flows within the integration. The user will only see your 
  integrations that you have invited them to.`;

export default function ManageUsersPanel({ integrationId, storeId }) {
  const classes = useStyles();
  const match = useRouteMatch();
  const history = useHistory();
  const isAccountOwner = useSelector(state => selectors.isAccountOwnerOrAdmin(state));

  const handleInvite = useCallback(() => history.push(`${match.url}/invite`), [history, match]);

  return (
    <div className={classes.root}>
      <PanelHeader title="Users" infoText={infoTextUsers}>
        {isAccountOwner && (
          <IconTextButton onClick={handleInvite}>
            <AddIcon /> Invite user
          </IconTextButton>
        )}
      </PanelHeader>
      <UsersList integrationId={integrationId} storeId={storeId} className={classes.userListWrapper} />

    </div>
  );
}
