import React, { useState, useCallback, useMemo, useEffect } from 'react';
import moment from 'moment';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core';
import { AUDIT_LOG_SOURCE_LABELS, ROWS_PER_PAGE_OPTIONS, DEFAULT_ROWS_PER_PAGE, getAuditLogFilterKey } from '../../constants/auditLog';
import { selectors } from '../../reducers';
import { ResourceTypeFilter, ResourceIdFilter, AuditLogActionFilter } from './ResourceFilters';
import CeligoSelect from '../CeligoSelect';
import ActionGroup from '../ActionGroup';
import DateRangeSelector from '../DateRangeSelector';
import CeligoPagination from '../CeligoPagination';
import { AUDIT_LOGS_RANGE_FILTERS } from '../../utils/resource';
import actions from '../../actions';
import Help from '../Help';
import { getSelectedRange } from '../../utils/flowMetrics';
import { emptyObject } from '../../constants';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import { message } from '../../utils/messageStore';

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
    marginLeft: theme.spacing(1),
    '& > :not(:last-child)': {
      marginRight: 0,
    },
  },

  helpTextButton: {
    padding: 0,
  },
  tablePaginationRoot: {
    display: 'flex',
  },
}));
const defaultRange = {startDate: null, endDate: null, preset: null};

function AuditPagination({ resourceType, resourceId, totalCount }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const filterKey = getAuditLogFilterKey(resourceType, resourceId);

  const auditPagingFilter = useSelector(state => selectors.filter(state, filterKey)?.paging || emptyObject, shallowEqual);
  const auditNextPagePath = useSelector(state => selectors.auditLogsNextPagePath(state));
  const auditLoadMoreStatus = useSelector(state => selectors.auditLoadMoreStatus(state));

  const handlePageChange = useCallback((e, newPage) => {
    dispatch(
      actions.patchFilter(filterKey, {
        paging: {
          ...auditPagingFilter,
          currPage: newPage,
        },
      })
    );
  }, [dispatch, filterKey, auditPagingFilter]);
  const handleRowsPerPageChange = useCallback(e => {
    dispatch(
      actions.patchFilter(filterKey, {
        paging: {
          ...auditPagingFilter,
          rowsPerPage: parseInt(e.target.value, 10),
          currPage: 0,
        },
      })
    );
  }, [dispatch, filterKey, auditPagingFilter]);

  const fetchMoreLogs = useCallback(() => dispatch(actions.auditLogs.request(resourceType, resourceId, auditNextPagePath)), [auditNextPagePath, dispatch, resourceId, resourceType]);

  const paginationOptions = useMemo(
    () => ({
      loadMoreHandler: fetchMoreLogs,
      hasMore: !!auditNextPagePath,
      loading: auditLoadMoreStatus === 'requested',
    }),
    [fetchMoreLogs, auditNextPagePath, auditLoadMoreStatus]
  );

  return (
    <CeligoPagination
      {...paginationOptions}
      rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
      className={classes.tablePaginationRoot}
      count={totalCount}
      page={auditPagingFilter?.currPage || 0}
      rowsPerPage={auditPagingFilter?.rowsPerPage || DEFAULT_ROWS_PER_PAGE}
      onChangePage={handlePageChange}
      onChangeRowsPerPage={handleRowsPerPageChange}
    />
  );
}

export default function Filters(props) {
  const [date, setDate] = useState(defaultRange);

  const {resourceType, resourceId, resourceDetails, childId, totalCount} = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const {
    users,
    affectedResources,
  } = useSelector(state => selectors.affectedResourcesAndUsersFromAuditLogs(
    state,
    resourceType,
    resourceId
  ));
  const hasMoreDownloads = useSelector(state => selectors.auditHasMoreDownloads(state));
  const filterKey = getAuditLogFilterKey(resourceType, resourceId);
  const filters = useSelector(state => selectors.filter(state, filterKey) || emptyObject, shallowEqual);

  const handleDateFilter = useCallback(
    dateFilter => {
      setDate(dateFilter);
      const selectedRange = getSelectedRange(dateFilter);

      const fromDate = selectedRange.startDate && moment(selectedRange.startDate).startOf('day').toISOString();
      const toDate = selectedRange.endDate && moment(selectedRange.endDate).endOf('day').toISOString();

      dispatch(actions.auditLogs.download(
        {
          resourceType,
          resourceId,
          childId,
          filters: { fromDate, toDate, ...filters },
        }
      ));
    }, [childId, dispatch, resourceId, resourceType, filters]);

  const canDownloadLogs = useSelector(state =>
    selectors.auditLogs(
      state,
      resourceType,
      resourceId,
      {childId}
    ).totalCount);

  const getResource = () => {
    const resource =
      resourceType &&
      resourceDetails[resourceType] &&
      resourceDetails[resourceType][resourceId];

    return resource;
  };

  const handleChange = useCallback(event => {
    const updatedFilters = {
      ...filters,
      paging: {
        ...filters.paging,
        currPage: 0, // whenever filters are changed, reset page to 0
      },
      [event.target.name]: event.target.value };

    if (event.target.name === 'resourceType') {
      updatedFilters._resourceId = OPTION_ALL.id;
    }

    dispatch(actions.patchFilter(filterKey, updatedFilters));
    dispatch(actions.auditLogs.request(resourceType, resourceId));
  }, [dispatch, filterKey, filters, resourceId, resourceType]);

  useEffect(() => {
    if (hasMoreDownloads) {
      enqueueSnackbar({
        message: message.AUDIT_LOGS_HAS_MORE_DOWNLOADS,
        variant: 'info',
        persist: true,
      });
      dispatch(actions.auditLogs.toggleHasMoreDownloads(false));
    }
  }, [dispatch, enqueueSnackbar, hasMoreDownloads]);

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
              isLoggable
              inputProps={userInput}
              onChange={handleChange}
              value={byUser || ''}>
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
              isLoggable
              inputProps={sourceInput}
              onChange={handleChange}
              value={source || ''}>
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
          <AuditLogActionFilter
            {...props}
            classes={classes}
            filters={filters}
            onChange={handleChange}
            resource={resource}
          />
        </ActionGroup>
        <ActionGroup position="right" className={classes.downloadButton}>
          {totalCount > 0 ? <AuditPagination {...props} /> : null}

          <DateRangeSelector
            disabled={!canDownloadLogs}
            primaryButtonLabel="Download"
            placement="right"
            fixedPlaceholder="Download"
            clearValue={defaultRange}
            onSave={handleDateFilter}
            value={date}
            showCustomRangeValue
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
