import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { IconButton } from '@mui/material';
import actions from '../../../../actions';
import RefreshIcon from '../../../icons/RefreshIcon';
import Spinner from '../../../Spinner';
import { selectors } from '../../../../reducers';
import ActionGroup from '../../../ActionGroup';

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
  },
}));

export default function RefreshableHeading({label, resourceType}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isResourceCollectionLoading = useSelector(state => selectors.isResourceCollectionLoading(state, resourceType));
  const [refreshRequested, setRefreshRequested] = useState(false);
  const handleRefresh = useCallback(() => {
    setRefreshRequested(true);
    dispatch(actions.resource.requestCollection(resourceType));
  }, [dispatch, setRefreshRequested, resourceType]);

  return (
    <ActionGroup>
      {label}
      {(refreshRequested && isResourceCollectionLoading)
        ? <Spinner className={classes.statusSpinner} size="small" />
        : (
          <IconButton
            data-test="refreshStatus"
            variant="text"
            className={classes.refreshIconButton}
            onClick={handleRefresh}
            size="large">
            <RefreshIcon />
          </IconButton>
        ) }
    </ActionGroup>
  );
}
