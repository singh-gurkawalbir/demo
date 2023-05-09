import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { selectors } from '../../reducers';
import { buildDrawerUrl, drawerPaths } from '../../utils/rightDrawer';
import AddIcon from '../icons/AddIcon';
import PanelHeader from '../PanelHeader';
import UsersList from './UsersList';
import { TextButton } from '../Buttons';
import infoText from '../Help/infoText';

const useStyles = makeStyles(theme => ({
  userListWrapper: {
    overflow: 'visible',
  },
  root: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    minHeight: 124,
  },
}));

export default function ManageUsersPanel({ integrationId, childId }) {
  const classes = useStyles();
  const match = useRouteMatch();
  const history = useHistory();
  const isAccountOwner = useSelector(state => selectors.isAccountOwnerOrAdmin(state));

  const handleInvite = useCallback(() => history.push(buildDrawerUrl({
    path: drawerPaths.ACCOUNT.INVITE_USER,
    baseUrl: match.url,
  })), [history, match]);

  return (
    <div className={classes.root}>
      <PanelHeader title="Users" infoText={infoText.Users} contentId="manageUsers">
        {isAccountOwner && (
          <TextButton
            onClick={handleInvite}
            startIcon={<AddIcon />}>
            Invite user
          </TextButton>
        )}
      </PanelHeader>
      <UsersList integrationId={integrationId} childId={childId} className={classes.userListWrapper} />
    </div>
  );
}

