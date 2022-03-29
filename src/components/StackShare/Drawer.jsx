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
import { DRAWER_URLS, DRAWER_URL_PREFIX } from '../../utils/drawerURLs';

export default function StackShareDrawer() {
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const history = useHistory();
  const handleRefreshClick = useCallback(
    () => dispatch(actions.resource.requestCollection('sshares')),
    [dispatch]
  );
  const handleInviteClick = useCallback(() => {
    history.push(`${history.location.pathname}/${DRAWER_URL_PREFIX}/invite`);
  }, [history]);

  const isInviteUser = history.location.pathname.includes('/invite');

  return (
    <RightDrawer
      path={DRAWER_URLS.SHARE_STACKS}
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
        <Route path={`${match.url}/${DRAWER_URLS.SHARE_STACKS}/${DRAWER_URL_PREFIX}/invite`}>
          <InviteUser />
        </Route>
        <Route path={`${match.url}/${DRAWER_URLS.SHARE_STACKS}`}>
          <DrawerContent>
            <SharedUserList />
          </DrawerContent>
        </Route>
      </Switch>
    </RightDrawer>
  );
}
