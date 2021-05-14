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
  userListWrapper: {
    overflowX: 'auto',
    marginLeft: -theme.spacing(2),
    marginRight: -theme.spacing(2),
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

  const handleInvite = useCallback(() => history.push(`${match.url}/invite`), [history, match]);

  return (
    <div className={classes.fullPanel}>
      <PanelHeader title="Users" infoText={infoTextUsers}>
        {isAccountOwner && (
          <IconTextButton onClick={handleInvite}>
            <AddIcon /> Invite user
          </IconTextButton>
        )}
      </PanelHeader>
      <UsersList integrationId={integrationId} childId={childId} className={classes.userListWrapper} />
    </div>
  );
}

