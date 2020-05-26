import { Fragment, useMemo, useCallback } from 'react';
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import UserGroupIcon from '../icons/GroupOfUsersIcon';
import RightDrawer from '../drawer/Right';
import SharedUserList from './SharedUserList';
import IconTextButton from '../IconTextButton';
import RefreshIcon from '../icons/RefreshIcon';
import actions from '../../actions';
import InviteUser from './InviteUser';

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
  const action = useMemo(
    () => (
      <Fragment>
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
          <UserGroupIcon />
          Invite user
        </IconTextButton>
      </Fragment>
    ),
    [handleInviteClick, handleRefreshClick]
  );
  const isInviteUser = history.location.pathname.includes(`/invite`);

  return (
    <Fragment>
      <RightDrawer
        path={rootPath}
        height="tall"
        width="medium"
        title={isInviteUser ? 'Invite user' : 'Stack sharing'}
        variant="temporary"
        actions={!isInviteUser && action}
        helpKey={!isInviteUser && 'stack.sharing'}
        helpTitle={!isInviteUser && 'Stack sharing'}
        hideBackButton={!isInviteUser}>
        <Switch>
          <Route path={`${match.url}/${rootPath}/invite`}>
            <InviteUser />
          </Route>
          <Route path={`${match.url}/${rootPath}`}>
            <SharedUserList />
          </Route>
        </Switch>
      </RightDrawer>
    </Fragment>
  );
}
