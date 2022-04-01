import React, { useCallback } from 'react';
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import actions from '../../actions';
import AddIcon from '../icons/AddIcon';
import RefreshIcon from '../icons/RefreshIcon';
import RightDrawer from '../drawer/Right';
import DrawerHeader from '../drawer/Right/DrawerHeader';
import DrawerContent from '../drawer/Right/DrawerContent';
import InviteUser from './InviteUser';
import SharedUserList from './SharedUserList';
import { TextButton } from '../Buttons';
import { drawerPaths, buildDrawerUrl } from '../../utils/drawerURLs';

export default function StackShareDrawer() {
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const history = useHistory();
  const handleRefreshClick = useCallback(
    () => dispatch(actions.resource.requestCollection('sshares')),
    [dispatch]
  );
  const handleInviteClick = useCallback(() => {
    history.push(`${buildDrawerUrl({
      path: drawerPaths.ACCOUNT.INVITE_USER,
      baseUrl: `${match.url}/${drawerPaths.SHARE_STACKS}`,
    })}`);
  }, [history, match.url]);

  const isInviteUser = history.location.pathname.includes('/invite');

  return (
    <RightDrawer
      path={drawerPaths.SHARE_STACKS}
      height="tall"
      width="large"
      helpKey={!isInviteUser && 'stack.sharing'}
      helpTitle={!isInviteUser && 'Stack sharing'} >
      <DrawerHeader
        showBackButton={isInviteUser}
        title={isInviteUser ? 'Invite user' : 'Stack sharing'}>
        {!isInviteUser && (
        <>
          <TextButton
            startIcon={<RefreshIcon />}
            data-test="retrieveStackShares"
            onClick={handleRefreshClick}>
            Refresh
          </TextButton>
          <TextButton
            startIcon={<AddIcon />}
            data-test="inviteUserAccessToStack"
            onClick={handleInviteClick}>
            Invite user
          </TextButton>
        </>
        )}
      </DrawerHeader>

      <Switch>
        <Route path={`${match.url}/${drawerPaths.SHARE_STACKS}/${drawerPaths.ACCOUNT.INVITE_USER}`}>
          <InviteUser />
        </Route>
        <Route path={`${match.url}/${drawerPaths.SHARE_STACKS}`}>
          <DrawerContent>
            <SharedUserList />
          </DrawerContent>
        </Route>
      </Switch>
    </RightDrawer>
  );
}
