import { Fragment } from 'react';
import { useSelector } from 'react-redux';
// import { Typography } from '@material-ui/core';
import * as selectors from '../../../../../../reducers';
// import actions from '../../../../../../actions';
import { USER_ACCESS_LEVELS } from '../../../../../../utils/constants';
import UserList from '../../../../../../components/UserList';
import IconTextButton from '../../../../../../components/IconTextButton';
import UserIcon from '../../../../../../components/icons/SingleUserIcon';
import PanelHeader from '../../../../common/PanelHeader';

export default function UsersSection({ integrationId }) {
  const permissions = useSelector(state => selectors.userPermissions(state));
  const isAccountOwner =
    permissions.accessLevel === USER_ACCESS_LEVELS.ACCOUNT_OWNER;

  return (
    <Fragment>
      <PanelHeader title="Users">
        {isAccountOwner && (
          <IconTextButton>
            <UserIcon /> Invite User
          </IconTextButton>
        )}
      </PanelHeader>

      <UserList integrationId={integrationId} />
    </Fragment>
  );
}
