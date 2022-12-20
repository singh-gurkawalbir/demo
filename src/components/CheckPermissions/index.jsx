import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { selectors } from '../../reducers';
import Spinner from '../Spinner';
import Loader from '../Loader';

const useStyles = makeStyles(theme => ({
  permissionErrors: {
    color: theme.palette.error.main,
    padding: theme.spacing(2, 3),
  },
}));

export default function CheckPermissions(props) {
  const { permission, children } = props;
  const classes = useStyles();
  const isDefaultAccountSetAfterAuth = useSelector(selectors.isDefaultAccountSetAfterAuth);

  const hasPermission = useSelector(state => {
    const permissions = selectors.userPermissions(state);

    return permission
      ? !!permission
        .split('.')
        .reduce((prev, curr) => (prev ? prev[curr] : null), permissions)
      : false;
  });

  if (!isDefaultAccountSetAfterAuth) return <Loader open>Loading...<Spinner /></Loader>;

  return hasPermission ? (
    children
  ) : (
    <Typography className={classes.permissionErrors} variant="h5">
      You do not have permissions to access this page.
    </Typography>
  );
}
