import React, { useCallback } from 'react';
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import actions from '../../actions';
import AddIcon from '../icons/AddIcon';
import RefreshIcon from '../icons/RefreshIcon';
import RightDrawer from '../drawer/Right/V2';
import DrawerHeader from '../drawer/Right/V2/DrawerHeader';
import DrawerContent from '../drawer/Right/V2/DrawerContent';
import IconTextButton from '../IconTextButton';
import InviteUser from './InviteUser';
import SharedUserList from './SharedUserList';

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
          <IconTextButton
            data-test="retrieveStackShares"
            variant="text"
            color="primary"
            onClick={handleRefreshClick}>
            <RefreshIcon />
            Refresh
          </IconTextButton>
          <IconTextButton
            data-test="inviteUserAccessToStack"
            variant="text"
            color="primary"
            onClick={handleInviteClick}>
            <AddIcon />
            Invite user
          </IconTextButton>
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
