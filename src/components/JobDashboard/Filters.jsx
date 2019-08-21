import { useState, Fragment } from 'react';
import { useSelector } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import * as selectors from '../../reducers';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing.double,
  },
});

function Filters({
  classes,
  integrationId,
  flowId,
  onFiltersChange,
  onActionClick,
  numJobsSelected = 0,
  disableButtons = true,
}) {
  const [_flowId, setFlowId] = useState('all');
  const [status, setStatus] = useState('all');
  const [hideEmpty, setHideEmpty] = useState(false);
  const flows = useSelector(
    state => selectors.resourceList(state, { type: 'flows' }).resources
  );
  const filteredFlows = flows.filter(flow =>
    !integrationId
      ? !flow._integrationId
      : flow._integrationId === integrationId
  );

  function handleChange(event) {
    const { name, value, checked } = event.target;
    const changedFilters = { [name]: name === 'hideEmpty' ? checked : value };

    if (name === '_flowId') {
      setFlowId(changedFilters[name]);
    }

    if (name === 'hideEmpty') {
      setHideEmpty(changedFilters[name]);
    }

    if (name === 'status') {
      setStatus(changedFilters[name]);
    }

    const newFilters = {
      _flowId,
      hideEmpty,
      status,
      ...changedFilters,
    };

    if (!flowId) {
      newFilters.flowId =
        newFilters._flowId === 'all' ? '' : newFilters._flowId;
    }

    delete newFilters._flowId;

    newFilters.numError_gte = newFilters.status === 'error' ? 1 : 0;
    newFilters.numResolved_gte = newFilters.status === 'resolved' ? 1 : 0;
    newFilters.status = ['all', 'error', 'resolved'].includes(newFilters.status)
      ? ''
      : newFilters.status;

    onFiltersChange(newFilters);
  }

  function handleResolveSelectedJobsClick() {
    onActionClick('resolveSelected');
  }

  function handleResolveAllJobsClick() {
    onActionClick('resolveAll');
  }

  function handleRetrySelectedJobsClick() {
    onActionClick('retrySelected');
  }

  function handleRetryAllJobsClick() {
    onActionClick('retryAll');
  }

  return (
    <Fragment>
      <Button
        variant="contained"
        color="primary"
        onClick={handleRetryAllJobsClick}
        disabled={disableButtons}>
        Retry All Jobs
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleRetrySelectedJobsClick}
        disabled={disableButtons}>
        Retry Selected {numJobsSelected} Jobs
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleResolveAllJobsClick}
        disabled={disableButtons}>
        Resolve All Jobs
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleResolveSelectedJobsClick}
        disabled={disableButtons}>
        Resolve Selected {numJobsSelected} Jobs
      </Button>

      <form className={classes.root} autoComplete="off">
        {!flowId && (
          <FormControl className={classes.formControl}>
            <Select
              inputProps={{
                name: '_flowId',
                id: '_flowId',
              }}
              onChange={handleChange}
              value={_flowId}>
              <MenuItem key="all" value="all">
                Select a Flow
              </MenuItem>
              {filteredFlows.map(opt => (
                <MenuItem key={opt._id} value={opt._id}>
                  {opt.name || opt._id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <FormControl className={classes.formControl}>
          <Select
            inputProps={{
              name: 'status',
              id: 'status',
            }}
            onChange={handleChange}
            value={status}>
            {[
              ['all', 'Select a Status'],
              ['error', 'Contains Error'],
              ['resolved', 'Contains Resolved'],
              ['running', 'In Progress'],
              ['retrying', 'Retrying'],
              ['queued', 'Queued'],
              ['canceled', 'Canceled'],
              ['completed', 'Completed'],
              ['failed', 'Failed'],
            ].map(opt => (
              <MenuItem key={opt[0]} value={opt[0]}>
                {opt[1]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="hideEmpty">Hide Empty Jobs</InputLabel>
          <Checkbox
            inputProps={{
              name: 'hideEmpty',
              id: 'hideEmpty',
            }}
            // indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={hideEmpty}
            onChange={handleChange}
          />
        </FormControl>
      </form>
    </Fragment>
  );
}

export default withStyles(styles)(Filters);
