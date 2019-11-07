import { Fragment } from 'react';
import { Typography } from '@material-ui/core';
import UserList from '../../../../../components/UserList';

export default function UsersSection({ integrationId }) {
  return (
    <Fragment>
      <Typography>Users</Typography>

      <UserList integrationId={integrationId} />
    </Fragment>
  );
}
