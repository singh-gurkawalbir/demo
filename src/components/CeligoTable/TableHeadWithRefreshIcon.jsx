import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import actions from '../../actions';
import RefreshIcon from '../icons/RefreshIcon';
import Spinner from '../Spinner';
import * as selectors from '../../reducers';

const useStyles = makeStyles(theme => ({
  status: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  statusSpinner: {
    marginLeft: theme.spacing(1),
  },
  refreshIconButton: {
    marginLeft: theme.spacing(1),
    padding: 0,
  }
}));

export default function TableHeadWithRefreshIcon({headerName, resourceType}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isResourceLoading = useSelector(state => selectors.isResourceLoading(state, resourceType));
  const [refreshRequested, setRefreshRequested] = useState(false);
  const handleRefresh = useCallback(() => {
    setRefreshRequested(true);
    dispatch(actions.resource.requestCollection(resourceType));
  }, [dispatch, setRefreshRequested, resourceType]);
  return (
    <span className={classes.status}>
      {headerName}
      {(refreshRequested && isResourceLoading) ?
        <Spinner className={classes.statusSpinner} size={24} color="primary" /> :
        <IconButton
          data-test="refreshStatus"
          variant="text"
          className={classes.refreshIconButton}
          onClick={handleRefresh}>
          <RefreshIcon />
        </IconButton>}
    </span>
  );
}
