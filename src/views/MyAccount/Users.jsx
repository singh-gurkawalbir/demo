import { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import CheckPermissions from '../../components/CheckPermissions';
import { PERMISSIONS } from '../../utils/constants';

export default class Users extends Component {
  render() {
    const { hide } = this.props;

    if (hide) return '';

    return (
      <CheckPermissions permission={PERMISSIONS.users.view}>
        <div>
          <Typography variant="h6">User Details</Typography>
        </div>
      </CheckPermissions>
    );
  }
}
