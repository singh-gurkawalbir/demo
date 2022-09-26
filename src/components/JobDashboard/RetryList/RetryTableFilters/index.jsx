import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import Icon from '../../../icons/RefreshIcon';
import TextButton from '../../../Buttons/TextButton';
import messageStore from '../../../../utils/messageStore';
import MultiSelectUsersFilter from './MultiSelectUsersFilter';
import InfoMessage from '../../../InfoMessage';

const useStyles = makeStyles(theme => ({
  header: {
    paddingBottom: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
  },
  refreshBtn: {
    marginLeft: theme.spacing(2),
  },
  filtersErrorTable: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

export default function RetryTableFilters({flowId, resourceId, filterKey}) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const retryStatus = useSelector(
    state => selectors.retryStatus(state, flowId, resourceId)
  );
  const isOpenErrorsUpdated = useSelector(state => {
    const openErrorDetails = selectors.allResourceErrorDetails(state, { flowId, resourceId});

    return !!openErrorDetails.updated;
  });
  const isResolvedErrorsUpdated = useSelector(state => {
    const openErrorDetails = selectors.allResourceErrorDetails(state, { flowId, resourceId, isResolved: true});

    return !!openErrorDetails.updated;
  });
  const fetchRetries = useCallback(() => {
    dispatch(actions.errorManager.retries.request({flowId, resourceId}));
  }, [dispatch, flowId, resourceId]);

  return (

    <div className={classes.filtersErrorTable}>
      <div className={classes.header}>
        <MultiSelectUsersFilter
          flowId={flowId}
          resourceId={resourceId}
          filterKey={filterKey}
        />
        <div className={classes.refreshBtn}>
          <div className={classes.card} >
            <TextButton
              startIcon={<Icon />}
              onClick={fetchRetries}
              disabled={retryStatus === 'inProgress'}>
              Refresh
            </TextButton>
          </div>
        </div>
        { (!retryStatus && (isOpenErrorsUpdated || isResolvedErrorsUpdated)) ? (
          <InfoMessage
            infoMessage={messageStore('RETRIES_TAB_ERRORS_UPDATED_INFO')} />
        ) : ''}
      </div>
    </div>
  );
}
