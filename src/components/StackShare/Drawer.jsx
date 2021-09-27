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

const rootPath = 'share/stacks/:stackId';

export default function StackShareDrawer() {
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const history = useHistory();
  const handleRefreshClick = useCallback(
    () => dispatch(actions.resource.requestCollection('sshares')),
    [dispatch]
  );
  const handleInviteClick = useCallback(() => {
    history.push(`${history.location.pathname}/invite`);
  }, [history]);

  const isInviteUser = history.location.pathname.includes('/invite');

  return (
    <RightDrawer
      path={rootPath}
      height="tall"
      width="large"
      variant="temporary"
      helpKey={!isInviteUser && 'stack.sharing'}
      helpTitle={!isInviteUser && 'Stack sharing'}
      hideBackButton={!isInviteUser}>
      <DrawerHeader title={isInviteUser ? 'Invite user' : 'Stack sharing'}>
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
        <Route path={`${match.url}/${rootPath}/invite`}>
          <InviteUser />
        </Route>
        <Route path={`${match.url}/${rootPath}`}>
          <DrawerContent>
            <SharedUserList />
          </DrawerContent>
        </Route>
      </Switch>
    </RightDrawer>
  );
}
