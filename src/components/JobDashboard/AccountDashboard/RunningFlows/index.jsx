import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';

import LoadResources from '../../../LoadResources';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import Filters from '../Filters';
import ResourceTable from '../../../ResourceTable';

const useStyles = makeStyles(({
  jobTable: {
    height: '100%',
    overflow: 'auto',
    paddingBottom: 115,
  },
}));
export default function RunningFlows() {
  const filterKey = 'runningFlows';
  const classes = useStyles();

  const dispatch = useDispatch();

  const filters = useSelector(state => selectors.filter(state, filterKey));
  const jobs = useSelector(state => selectors.accountDashboardRunningJobs(state));

  useEffect(() => {
    dispatch(
      actions.job.dashboard.running.requestCollection({
        filters,
        options: { },
      })
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <LoadResources required resources="integrations,flows,exports,imports">
      <span data-public>
        <Filters
          filterKey={filterKey}
      />
      </span>
      <ResourceTable
        resources={jobs}
        className={classes.jobTable}
        resourceType={filterKey}
          />
    </LoadResources>
  );
}
