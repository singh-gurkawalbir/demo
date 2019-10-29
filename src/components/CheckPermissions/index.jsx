import { Component } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import * as selectors from '../../reducers';

const mapStateToProps = state => {
  const permissions = selectors.userPermissions(state);

  return {
    permissions,
  };
};

@withStyles(theme => ({
  permissionErrors: {
    color: theme.palette.error.main,
  },
}))
class CheckPermissions extends Component {
  render() {
    const { classes, permissions, permission, children } = this.props;
    const hasPermission = permission
      ? !!permission
          .split('.')
          .reduce((prev, curr) => (prev ? prev[curr] : null), permissions)
      : false;

    return hasPermission ? (
      children
    ) : (
      <Typography className={classes.permissionErrors} variant="h5">
        You do not have permissions to access this page.
      </Typography>
    );
  }
}

export default connect(mapStateToProps)(CheckPermissions);
