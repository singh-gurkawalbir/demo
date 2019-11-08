import { Fragment } from 'react';
// import { Typography } from '@material-ui/core';
import UserList from '../../../../../components/UserList';
import IconTextButton from '../../../../../components/IconTextButton';
import UserIcon from '../../../../../components/icons/SingleUserIcon';
import PanelHeader from '../../PanelHeader';

export default function UsersSection({ integrationId }) {
  return (
    <Fragment>
      <PanelHeader title="Users">
        <IconTextButton>
          <UserIcon /> Invite User
        </IconTextButton>
      </PanelHeader>

      <UserList integrationId={integrationId} />
    </Fragment>
  );
}
