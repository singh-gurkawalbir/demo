import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import actions from '../../actions';
import RefreshIcon from '../icons/RefreshIcon';
import Spinner from '../Spinner';
import { COMM_STATES } from '../../reducers/comms/networkComms';
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

export default function TableHeadWithRefreshIcon({headerName, resourceType, resourceCommPath}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const resourceCommStatus = useSelector(state => selectors.commStatusPerPath(state, `/${resourceCommPath || resourceType}`, 'GET'));
  const [refreshRequested, setRefreshRequested] = useState(false);
  const handleRefresh = useCallback(() => {
    setRefreshRequested(true);
    dispatch(actions.resource.requestCollection(resourceType));
  }, [dispatch, setRefreshRequested, resourceType]);
  return (
    <span className={classes.status}>
      {headerName}
      {(refreshRequested && resourceCommStatus === COMM_STATES.LOADING) ?
        <Spinner className={classes.statusSpinner} size={24} color="primary" /> :
        <IconButton
          data-test="newTransfer"
          variant="text"
          className={classes.refreshIconButton}
          onClick={handleRefresh}>
          <RefreshIcon />
        </IconButton>}
    </span>
  );
}
