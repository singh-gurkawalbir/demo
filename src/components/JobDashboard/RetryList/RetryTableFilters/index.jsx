import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import Icon from '../../../icons/RefreshIcon';
import TextButton from '../../../Buttons/TextButton';
import SelectResource from '../../../LineGraph/SelectResource';

const useStyles = makeStyles(theme => ({
  header: {
    paddingBottom: theme.spacing(3),
    display: 'flex',
  },
  refreshBtn: {
    marginLeft: theme.spacing(2),
  },
  filtersErrorTable: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

const defaultFilter = {
  selectedUsers: [],
};
const resourceType = 'users';
const defaultButtonName = 'Select retry started by';
const labelName = 'Select retry started by';

export default function RetryTableFilters({flowId, resourceId, filterKey}) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const retryFilter = useSelector(
    state => selectors.filter(state, filterKey), shallowEqual
  );
  const users = useSelector(
    state => selectors.retryUsersList(state, resourceId)
  );
  const retryStatus = useSelector(
    state => selectors.retryStatus(state, flowId, resourceId)
  );
  const fetchRetries = useCallback(() => {
    dispatch(actions.errorManager.retries.request({flowId, resourceId}));
  }, [dispatch, flowId, resourceId]);

  const onSave = useCallback(val => {
    // setSelectedResources(val);
    dispatch(actions.patchFilter(filterKey, { selectedUsers: val}));
  }, [dispatch, filterKey]);

  useEffect(() => {
    dispatch(actions.patchFilter(filterKey, defaultFilter));
  }, [dispatch, filterKey]);

  return (

    <div className={classes.filtersErrorTable}>
      <div className={classes.header}>
        <SelectResource
          resources={users}
          selectedResources={retryFilter.selectedUsers}
          onSave={onSave}
          resourceType={resourceType}
          defaultButtonName={defaultButtonName}
          labelName={labelName}
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
      </div>
    </div>
  );
}
