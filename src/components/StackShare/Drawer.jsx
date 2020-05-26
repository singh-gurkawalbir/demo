import { Fragment, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import UserGroupIcon from '../icons/GroupOfUsersIcon';
import RightDrawer from '../drawer/Right';
import StackShare from './';
import IconTextButton from '../IconTextButton';
import RefreshIcon from '../icons/RefreshIcon';
import actions from '../../actions';
import InviteUser from './InviteUser';

export default function StackShareDrawer() {
  const dispatch = useDispatch();
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

  return (
    <Fragment>
      <RightDrawer
        path=":stackId/share"
        height="tall"
        width="medium"
        title="Stack sharing"
        variant="temporary"
        actions={action}
        helpKey="stack.sharing"
        helpTitle="Stack sharing"
        hideBackButton>
        <StackShare />
      </RightDrawer>
      <RightDrawer
        path=":stackId/share/invite"
        height="tall"
        width="medium"
        title="Invite user"
        variant="temporary">
        <InviteUser />
      </RightDrawer>
    </Fragment>
  );
}
