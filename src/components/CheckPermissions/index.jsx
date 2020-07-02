import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import * as selectors from '../../reducers';

const useStyles = makeStyles(theme => ({
  permissionErrors: {
    color: theme.palette.error.main,
  },
}));

export default function CheckPermissions(props) {
  const { permission, children } = props;
  const classes = useStyles();
  const hasPermission = useSelector(state => {
    const permissions = selectors.userPermissions(state);

    return permission
      ? !!permission
        .split('.')
        .reduce((prev, curr) => (prev ? prev[curr] : null), permissions)
      : false;
  });

  return hasPermission ? (
    children
  ) : (
    <Typography className={classes.permissionErrors} variant="h5">
      You do not have permissions to access this page.
    </Typography>
  );
}
