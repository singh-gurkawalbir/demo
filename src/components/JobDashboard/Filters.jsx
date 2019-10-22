import { useState, Fragment } from 'react';
import { useSelector } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import * as selectors from '../../reducers';
import ArrowDownIcon from '../icons/ArrowDownIcon';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  select: {
    background: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    transitionProperty: 'border',
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
    overflow: 'hidden',
    height: 42,
    textAlign: 'left',
    borderRadius: 2,
    '& > div': {
      maxWidth: '85%',
    },
    '& > Label': {
      paddingTop: 10,
    },
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
    '& > *': {
      padding: [[0, 0, 0, 12]],
    },
    '& > div > div ': {
      paddingBottom: 5,
    },
    '& svg': {
      right: 8,
      paddingLeft: 0,
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing.double,
  },
  btnGroup: {
    '& button': {
      marginRight: 10,
      height: 42,
      '&:first-child': {
        marginLeft: 10,
      },
    },
  },
}));

function Filters({
  integrationId,
  flowId,
  onFiltersChange,
  onActionClick,
  numJobsSelected = 0,
  disableButtons = true,
}) {
  const classes = useStyles();
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
      <div className={classes.btnGroup}>
        <Button
          data-test="retryAllJobs"
          variant="outlined"
          color="secondary"
          onClick={handleRetryAllJobsClick}
          disabled={disableButtons}>
          Retry All Jobs
        </Button>
        <Button
          data-test="retrySelectedJobs"
          variant="outlined"
          color="secondary"
          onClick={handleRetrySelectedJobsClick}
          disabled={disableButtons}>
          Retry Selected {numJobsSelected} Jobs
        </Button>
        <Button
          data-test="resolveAllJobs"
          variant="outlined"
          color="secondary"
          onClick={handleResolveAllJobsClick}
          disabled={disableButtons}>
          Resolve All Jobs
        </Button>
        <Button
          data-test="resolveSelectedJobs"
          variant="outlined"
          color="secondary"
          onClick={handleResolveSelectedJobsClick}
          disabled={disableButtons}>
          Resolve Selected {numJobsSelected} Jobs
        </Button>
      </div>
      <form className={classes.root} autoComplete="off">
        {!flowId && (
          <FormControl className={classes.formControl}>
            <Select
              inputProps={{
                name: '_flowId',
                id: '_flowId',
              }}
              className={classes.select}
              onChange={handleChange}
              IconComponent={ArrowDownIcon}
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
            className={classes.select}
            IconComponent={ArrowDownIcon}
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
        <FormControlLabel
          control={
            <Checkbox
              inputProps={{
                name: 'hideEmpty',
                id: 'hideEmpty',
              }}
              // indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={hideEmpty}
              onChange={handleChange}
              color="primary"
            />
          }
          label="Hide Empty Jobs"
        />
      </form>
    </Fragment>
  );
}

export default Filters;
