import { MenuItem, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatePath, Link, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import actions from '../../actions';
import CeligoPageBar from '../../components/CeligoPageBar';
import CeligoSelect from '../../components/CeligoSelect';
import CheckPermissions from '../../components/CheckPermissions';
import ResourceDrawer from '../../components/drawer/Resource';
import AddIcon from '../../components/icons/AddIcon';
import ArrowDownIcon from '../../components/icons/ArrowDownIcon';
import IconTextButton from '../../components/IconTextButton';
import LoadResources from '../../components/LoadResources';
import ResourceTable from '../../components/ResourceTable';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../reducers';
import { PERMISSIONS } from '../../utils/constants';
import { generateNewId } from '../../utils/resource';
import ViewReportDetails from './ViewReportDetails';
import ShowMoreDrawer from '../../components/drawer/ShowMore';

const useStyles = makeStyles(theme => ({
  reportTypes: {

    fontSize: 16,
  },
  emptySpace: {
    flexGrow: 1,
    minWidth: theme.spacing(10),
  },
  actions: {
    display: 'flex',
  },
  resultContainer: {
    padding: theme.spacing(3, 3, 12, 3),
  },
}));
const defaultFilter = {
  take: parseInt(process.env.DEFAULT_TABLE_ROW_COUNT, 10) || 10,
  sort: { order: 'desc', orderBy: 'createdAt' },

};

const resourceTypeToLabel = {
  eventreports: 'Flow Events',
};
const defaultEventReportType = 'eventreports';
const reportTypes = [{label: resourceTypeToLabel[defaultEventReportType], value: defaultEventReportType}];

// poll for 5 seconds
const timerValue = 5000;

const usePollLatestResourceCollection = resourceType => {
  const dispatch = useDispatch();

  useEffect(() => {
    let timerId;

    if (resourceType) {
      timerId = setInterval(() => {
        dispatch(actions.resource.requestCollection(resourceType, null, true));
      }, timerValue);
    }

    return () => {
      clearInterval(timerId);
    };
  }, [dispatch, resourceType]);
};
export default function Reports() {
  const match = useRouteMatch();
  const history = useHistory();
  // all reportTypes can be considered as a resourceList collection
  const {reportType: resourceType} = match.params;
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (!resourceType) {
      const defaultEventReportPath =
        generatePath(`${match.path}/:reportType`, {
          ...match.params,
          reportType: defaultEventReportType,
        });

      history.replace(defaultEventReportPath);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(actions.patchFilter(resourceType, defaultFilter));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const filter =
    useSelector(state => selectors.filter(state, resourceType));
  const filterConfig = useMemo(
    () => ({
      type: resourceType,
      ...(filter || {}),
    }),
    [filter, resourceType]
  );

  const selectNewReportType = e => {
    const reportType = e.target.value;
    const reportTypePath = generatePath(match.path, {
      ...match.params,
      reportType,
    });

    history.replace(reportTypePath);
  };

  const list = useSelectorMemo(
    selectors.makeResourceListSelector,
    filterConfig
  );

  usePollLatestResourceCollection(resourceType);
  const selectedReportTypeLabel = () => reportTypes.find(({value}) => value === resourceType)?.label;

  return (
    <CheckPermissions
      permission={
         PERMISSIONS.eventreports.view
       }>

      <ResourceDrawer />
      <ViewReportDetails />
      <CeligoPageBar
        title="Reports">
        <div className={classes.actions}>
          <CeligoSelect
            className={classes.reportTypes}
            data-public
            displayEmpty
            IconComponent={ArrowDownIcon}
            renderValue={selectedReportTypeLabel}
            value={resourceType}
            onChange={selectNewReportType}

          >
            {reportTypes.map(({label, value}) => (
              <MenuItem
                key={value}
                value={value} >
                {label}
              </MenuItem>
            ))}
          </CeligoSelect>

        </div>
      </CeligoPageBar>
      <div className={classes.resultContainer}>
        <div className={classes.actions}>
          <Typography
            className={classes.reportTypes}>
            {resourceTypeToLabel[resourceType]} report results
          </Typography>
          <div className={classes.emptySpace} />

          <IconTextButton
            data-test="addNewResource"
            component={Link}
            to={`${location.pathname}/add/${resourceType}/${generateNewId()}`}
            variant="text"
            color="primary">
            <AddIcon /> Create {resourceTypeToLabel[resourceType]}
          </IconTextButton>
        </div>
        <LoadResources required resources={`${resourceType || defaultEventReportType},integrations,flows`}>
          {list.total === 0 ? (
            <Typography>
              {'You don\'t have any report results'}

            </Typography>
          ) : (
            <ResourceTable
              resourceType={resourceType}
              resources={list.resources}
            />
          )}
        </LoadResources>
      </div>
      <ShowMoreDrawer
        filterKey={resourceType}
        count={list.count}
        maxCount={list.filtered}
      />
    </CheckPermissions>
  );
}
