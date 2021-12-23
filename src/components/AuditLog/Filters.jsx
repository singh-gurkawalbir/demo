import React, { useState, useCallback } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core';
import { endOfDay } from 'date-fns';
import { AUDIT_LOG_SOURCE_LABELS } from '../../constants/auditLog';
import { selectors } from '../../reducers';
import { ResourceTypeFilter, ResourceIdFilter } from './ResourceFilters';
import CeligoSelect from '../CeligoSelect';
import ActionGroup from '../ActionGroup';
import DateRangeSelector from '../DateRangeSelector';
import { AUDIT_LOGS_RANGE_FILTERS } from '../../utils/resource';
import actions from '../../actions';
import Help from '../Help';

const OPTION_ALL = { id: 'all', label: 'All' };

const userInput = {
  name: 'byUser',
  id: 'byUser',
};

const sourceInput = {
  name: 'source',
  id: 'source',
};

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
  },
  formControl: {
    marginRight: theme.spacing(1),
    minWidth: 150,
    maxWidth: theme.spacing(30),
    height: 36,
  },
  filterContainer: {
    padding: theme.spacing(2, 0),
    border: `solid 1px ${theme.palette.secondary.lightest}`,
    borderWidth: [[1, 0]],
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    '& > *': {
      marginRight: 10,
      '&:first-child': {
        marginLeft: 10,
      },
    },
  },
  downloadButton: {
    '& .MuiButton-root': {
      marginRight: 0,
    },
  },

  helpTextButton: {
    padding: 0,
  },
}));
const defaultRange = {
  startDate: new Date(),
  endDate: endOfDay(new Date()),
  preset: null,
};

export default function Filters(props) {
  const [date, setDate] = useState(defaultRange);

  const {resourceType, resourceId, resourceDetails, onFiltersChange, childId} = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const {
    users,
    affectedResources,
  } = useSelector(state => selectors.affectedResourcesAndUsersFromAuditLogs(
    state,
    resourceType,
    resourceId
  ));
  const handleDateFilter = useCallback(
    dateFilter => {
      setDate(dateFilter);
      const fromDate = dateFilter.startDate && moment(dateFilter.startDate).startOf('day').toISOString();
      const toDate = dateFilter.endDate && moment(dateFilter.endDate).endOf('day').toISOString();

      dispatch(actions.auditLogs.download(
        {
          resourceType,
          resourceId,
          childId,
          filters: { fromDate, toDate },
        }
      ));
    }, [childId, dispatch, resourceId, resourceType]);

  const [filters, setFilters] = useState(
    {

      resourceType: OPTION_ALL.id,
      _resourceId: OPTION_ALL.id,
      byUser: OPTION_ALL.id,
      source: OPTION_ALL.id,
    }
  );
  const canDownloadLogs = useSelector(state =>
    selectors.auditLogs(
      state,
      resourceType,
      resourceId,
      undefined,
      {childId}
    ).totalCount);

  const getResource = () => {
    const resource =
      resourceType &&
      resourceDetails[resourceType] &&
      resourceDetails[resourceType][resourceId];

    return resource;
  };

  const handleChange = event => {
    const toUpdate = { ...filters, [event.target.name]: event.target.value };

    if (event.target.name === 'resourceType') {
      toUpdate._resourceId = OPTION_ALL.id;
    }
    setFilters(toUpdate);

    const updatedFilters = { ...toUpdate };

    Object.keys(updatedFilters).forEach(key => {
      if (updatedFilters[key] === OPTION_ALL.id) {
        updatedFilters[key] = undefined;
      }
    });

    onFiltersChange(updatedFilters);
  };

  const { byUser, source } = filters;
  const resource = getResource();

  return (
    <div className={classes.filterContainer}>
      <form className={classes.root} autoComplete="off">
        <ActionGroup >
          <ResourceTypeFilter
            {...props}
            classes={classes}
            affectedResources={affectedResources}
            filters={filters}
            onChange={handleChange}
        />
          <ResourceIdFilter
            {...props}
            classes={classes}
            affectedResources={affectedResources}
            filters={filters}
            onChange={handleChange}
        />
          <FormControl className={classes.formControl}>
            <CeligoSelect
              inputProps={userInput}
              onChange={handleChange}
              value={byUser}>
              <MenuItem key={OPTION_ALL.id} value={OPTION_ALL.id}>
                Select user
              </MenuItem>
              {users.map(opt => (
                <MenuItem key={opt._id} value={opt._id}>
                  {opt.name || opt.email}
                </MenuItem>
              ))}
            </CeligoSelect>
          </FormControl>
          <FormControl className={classes.formControl}>
            <CeligoSelect
              inputProps={sourceInput}
              onChange={handleChange}
              value={source}>
              <MenuItem key={OPTION_ALL.id} value={OPTION_ALL.id}>
                Select source
              </MenuItem>
              {[
                ...Object.keys(AUDIT_LOG_SOURCE_LABELS)
                  .filter(k => {
                    if (!resource) {
                      return true;
                    }

                    if (resource._connectorId) {
                      return k !== 'stack';
                    }

                    return k !== 'connector';
                  })
                  .map(k => [k, AUDIT_LOG_SOURCE_LABELS[k]]),
              ].map(opt => (
                <MenuItem key={opt[0]} value={opt[0]}>
                  {opt[1]}
                </MenuItem>
              ))}
            </CeligoSelect>
          </FormControl>
        </ActionGroup>
        <ActionGroup position="right" className={classes.downloadButton}>
          <DateRangeSelector
            disabled={!canDownloadLogs}
            primaryButtonLabel="Download"
            placement="right"
            fixedPlaceholder="Download"
            clearValue={defaultRange}
            onSave={handleDateFilter}
            value={date}
            customPresets={AUDIT_LOGS_RANGE_FILTERS}
         />
          <Help
            title="Download"
            className={classes.helpTextButton}
            helpKey="auditlogs.download"
      />
        </ActionGroup>
      </form>
    </div>
  );
}
