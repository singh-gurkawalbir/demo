import { makeStyles, Typography } from '@material-ui/core';
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
const headerLabel = 'Select retry started by';

export default function MultiSelectUsersFilter({flowId, resourceId, resourceType, filterKey}) {
  const classes = useStyles();
  const users = useSelector(
    state => selectors.retryUsersList(state, flowId, resourceId)
  );
  const filterOptions = useSelector(state => selectors.filter(state, filterKey));
  const selected = filterOptions[filterBy]?.length ? filterOptions[filterBy] : ['all'];

  const ButtonLabel = useMemo(() => {
    if (selected.length === 1) {
      return users.find(r => r._id === selected[0])?.name;
    }

    return `${selected.length} ${resourceType} selected`;
  }, [resourceType, selected, users]);

  const CustomLabel = useMemo(() => (
    <Typography className={classes.customUserLabel}>
      Select retry started by:
    </Typography>
  ), [classes.customUserLabel]);

  return (
    <MultiSelectColumnFilter
      className={classes.multiSelectUserWrapper}
      title={CustomLabel}
      headerLabel={headerLabel}
      filterBy="selectedUsers"
      filterKey={filterKey}
      options={users}
      ButtonLabel={ButtonLabel} />
  );
}
