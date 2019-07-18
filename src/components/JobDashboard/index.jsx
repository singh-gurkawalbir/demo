import { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import LoadResources from '../../components/LoadResources';
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
  const [filters, setFilters] = useState({});

  function handleFiltersChange(newFilters) {
    setFilters(newFilters);
  }

  return (
    <LoadResources required resources="flows,exports,imports">
      <Filters
        integrationId={integrationId}
        flowId={flowId}
        onFiltersChange={handleFiltersChange}
      />
      <JobTable
        integrationId={integrationId}
        flowId={flowId}
        filters={filters}
        rowsPerPage={rowsPerPage}
      />
    </LoadResources>
  );
}

export default withStyles(styles)(JobDashboard);
