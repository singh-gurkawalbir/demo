import { Component } from 'react';
import CheckPermissions from '../../components/CheckPermissions';
import { PERMISSIONS } from '../../utils/constants';
import UserList from '../../components/UserList';

export default class Users extends Component {
  /*
  <UserList integrationId="5cc843dd5e1d7f53a12b1cb9" />
  <UserList integrationId="5c6e4fa95ab5733a65bb82e3" />
   */
  render() {
    return (
      <CheckPermissions permission={PERMISSIONS.agents.view}>
        <UserList />
        <UserList integrationId="5cc843dd5e1d7f53a12b1cb9" />
        <UserList integrationId="5c6e4fa95ab5733a65bb82e3" />
      </CheckPermissions>
    );
  }
}
