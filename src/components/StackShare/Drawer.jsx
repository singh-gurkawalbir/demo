import React, { useCallback } from 'react';
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { TextButton } from '@celigo/fuse-ui';
import actions from '../../actions';
import AddIcon from '../icons/AddIcon';
import RefreshIcon from '../icons/RefreshIcon';
import RightDrawer from '../drawer/Right';
import DrawerHeader from '../drawer/Right/DrawerHeader';
import DrawerContent from '../drawer/Right/DrawerContent';
import InviteUser from './InviteUser';
import SharedUserList from './SharedUserList';
import { drawerPaths, buildDrawerUrl } from '../../utils/rightDrawer';

export default function StackShareDrawer() {
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const history = useHistory();

  const shareStacksUrl = buildDrawerUrl({
    path: drawerPaths.SHARE_STACKS,
    baseUrl: match.url,
  });
  const inviteUserUrl = buildDrawerUrl({
    path: drawerPaths.ACCOUNT.INVITE_USER,
    baseUrl: shareStacksUrl,
  });

  const handleRefreshClick = useCallback(
    () => dispatch(actions.resource.requestCollection('sshares')),
    [dispatch]
  );
  const handleInviteClick = useCallback(() => {
    history.push(buildDrawerUrl({
      path: drawerPaths.ACCOUNT.INVITE_USER,
      baseUrl: `${history.location.pathname}`,
    }));
  }, [history]);

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
        <Route path={inviteUserUrl}>
          <InviteUser />
        </Route>
        <Route path={shareStacksUrl}>
          <DrawerContent>
            <SharedUserList />
          </DrawerContent>
        </Route>
      </Switch>
    </RightDrawer>
  );
}
