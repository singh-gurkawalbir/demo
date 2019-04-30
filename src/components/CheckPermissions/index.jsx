import { Component } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import * as selectors from '../../reducers';

const mapStateToProps = state => {
  const permissions = selectors.userPermissions(state);

  return {
    permissions,
  };
};

class CheckPermissions extends Component {
  render() {
    const { permissions, permission, children } = this.props;
    const hasPermission = !!permission
      .split('.')
      .reduce((prev, curr) => (prev ? prev[curr] : null), permissions);

    return hasPermission ? (
      children
    ) : (
      <Typography color="error" variant="h5">
        You do not have permissions to access this page.
      </Typography>
    );
  }
}

export default connect(mapStateToProps)(CheckPermissions);
