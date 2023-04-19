import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';
import MultiSelectColumnFilter from '../../../../ResourceTable/commonCells/MultiSelectColumnFilter';

const useStyles = makeStyles(theme => ({
  multiSelectUserWrapper: {
    alignItems: 'center',
  },
  customUserLabel: {
    marginRight: theme.spacing(1),
  },
}));

const filterBy = 'selectedUsers';
const resourceType = 'users';
const defaultUserId = 'all';

export default function MultiSelectUsersFilter({flowId, resourceId, filterKey}) {
  const classes = useStyles();
  const integrationId = useSelector(state =>
    selectors.resource(state, 'flows', flowId)?._integrationId || 'none'
  );
  const users = useSelector(
    state => selectors.retryUsersList(state, integrationId, flowId, resourceId)
  );

  const retries = useSelector(state => selectors.retryList(state, flowId, resourceId, {}));
  const filterOptions = useSelector(state => selectors.filter(state, filterKey));
  const selected = filterOptions[filterBy]?.length ? filterOptions[filterBy] : ['all'];

  const ButtonLabel = useMemo(() => {
    if (selected.length === 1) {
      const selectedUser = users.find(r => r._id === selected[0]);

      return selectedUser?._id === defaultUserId ? 'Select' : selectedUser?.name;
    }

    return `${selected.length} ${resourceType} selected`;
  }, [selected, users]);

  const CustomLabel = useMemo(() => (
    <Typography className={classes.customUserLabel}>
      Retry started by:
    </Typography>
  ), [classes.customUserLabel]);

  if (!retries.length) {
    return null;
  }

  return (
    <MultiSelectColumnFilter
      className={classes.multiSelectUserWrapper}
      title={CustomLabel}
      filterBy="selectedUsers"
      filterKey={filterKey}
      options={users}
      ButtonLabel={ButtonLabel} />
  );
}
