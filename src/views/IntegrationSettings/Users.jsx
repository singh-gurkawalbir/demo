import { Component } from 'react';
import UserList from '../../components/UserList';

export default class Users extends Component {
  render() {
    const { match } = this.props;
    const { integrationId } = match.params;

    return <UserList integrationId={integrationId} />;
  }
}
