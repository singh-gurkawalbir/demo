import { useState } from 'react';
import { useSelector } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core';
import * as selectors from '../../reducers';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing.double,
  },
});

function Filters({ classes, integrationId, onFiltersChange }) {
  const [_flowId, setFlowId] = useState('');
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

    newFilters.flowId = newFilters._flowId;
    delete newFilters._flowId;
    newFilters.status = ['all', 'error', 'resolved'].includes(newFilters.status)
      ? ''
      : newFilters.status;

    newFilters.numError_gte = newFilters.status === 'error' ? 1 : 0;
    newFilters.numResolved_gte = newFilters.status === 'resolved' ? 1 : 0;

    onFiltersChange(newFilters);
  }

  return (
    <form className={classes.root} autoComplete="off">
      <FormControl className={classes.formControl}>
        <Select
          inputProps={{
            name: '_flowId',
            id: '_flowId',
          }}
          onChange={handleChange}
          value={_flowId}>
          {filteredFlows.map(opt => (
            <MenuItem key={opt._id} value={opt._id}>
              {opt.name || opt._id}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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
  );
}

export default withStyles(styles)(Filters);
