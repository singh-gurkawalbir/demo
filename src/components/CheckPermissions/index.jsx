import { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import * as selectors from '../../reducers';

const mapStateToProps = state => {
  const permissions = selectors.userPermissions(state);

  return {
    permissions,
  };
};

@withStyles({
  permissionsError: {
    textAlign: 'center',
    color: '#ff0000',
  },
})
class CheckPermissions extends Component {
  render() {
    const { classes, permissions, permission, children } = this.props;
    const hasPermission = !!permission
      .split('.')
      .reduce((prev, curr) => (prev ? prev[curr] : null), permissions);

    return hasPermission ? (
      children
    ) : (
      <div className={classes.permissionsError}>
        You do not have permissions to access this page.
      </div>
    );
  }
}

export default connect(mapStateToProps)(CheckPermissions);
