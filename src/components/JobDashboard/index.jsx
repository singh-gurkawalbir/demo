import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { isEqual } from 'lodash';
import LoadResources from '../../components/LoadResources';
import * as selectors from '../../reducers';
import actions from '../../actions';
import Filters from './Filters';
import JobTable from './JobTable';

const styles = theme => ({
  root: {
    width: '98%',
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
    overflowX: 'auto',
  },
  title: {
    marginBottom: theme.spacing.unit * 2,
    float: 'left',
  },
  createAPITokenButton: {
    margin: theme.spacing.unit,
    textAlign: 'center',
    float: 'right',
  },
  table: {
    minWidth: 700,
  },
  tablePaginationRoot: { float: 'left' },
});

function JobDashboard({ integrationId, flowId, rowsPerPage = 10 }) {
  const dispatch = useDispatch();
  const userPermissionsOnIntegration = useSelector(state =>
    selectors.resourcePermissions(state, 'integrations', integrationId)
  );
  const jobs = useSelector(state =>
    selectors.flowJobList(state, integrationId, flowId)
  );
  const [filters, setFilters] = useState({});
  const [selectedJobs, setSelectedJobs] = useState({});
  const [numJobsSelected, setNumJobsSelected] = useState(0);

  useEffect(
    () => () => {
      dispatch(actions.job.clear());
    },
    [dispatch, filters]
  );

  useEffect(() => {
    if (!jobs.length) {
      dispatch(
        actions.job.requestCollection({ integrationId, flowId, filters })
      );
    }
  }, [dispatch, filters, flowId, integrationId, jobs.length]);

  useEffect(() => {
    let jobsSelected = 0;

    Object.keys(selectedJobs).forEach(jobId => {
      if (selectedJobs[jobId].selected) {
        jobsSelected += 1;
      }

      if (selectedJobs[jobId].selectedChildJobIds) {
        jobsSelected += selectedJobs[jobId].selectedChildJobIds.length;
      }
    });

    if (jobsSelected !== numJobsSelected) {
      setNumJobsSelected(jobsSelected);
    }
  }, [selectedJobs, numJobsSelected]);

  function handleFiltersChange(newFilters) {
    if (!isEqual(filters, newFilters)) {
      setFilters(newFilters);
    }
  }

  function handleSelectChange(selJobs) {
    setSelectedJobs(selJobs);
  }

  return (
    <LoadResources required resources="flows,exports,imports">
      <Filters
        integrationId={integrationId}
        flowId={flowId}
        onFiltersChange={handleFiltersChange}
        numJobsSelected={numJobsSelected}
      />
      <JobTable
        integrationId={integrationId}
        flowId={flowId}
        filters={filters}
        rowsPerPage={rowsPerPage}
        onSelectChange={handleSelectChange}
        jobs={jobs}
        selectedJobs={selectedJobs}
        userPermissionsOnIntegration={userPermissionsOnIntegration}
      />
    </LoadResources>
  );
}

export default withStyles(styles)(JobDashboard);
