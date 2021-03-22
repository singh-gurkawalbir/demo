import { MenuItem, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatePath, Link, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import actions from '../../actions';
import CeligoPageBar from '../../components/CeligoPageBar';
import CeligoSelect from '../../components/CeligoSelect';
import ResourceDrawer from '../../components/drawer/Resource';
import AddIcon from '../../components/icons/AddIcon';
import ArrowDownIcon from '../../components/icons/ArrowDownIcon';
import IconTextButton from '../../components/IconTextButton';
import LoadResources from '../../components/LoadResources';
import ResourceTable from '../../components/ResourceTable';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../reducers';
import { generateNewId } from '../../utils/resource';
import ViewReportDetails from './ViewReportDetails';
import ShowMoreDrawer from '../../components/drawer/ShowMore';
import infoText from '../ResourceList/infoText';
import InfoIconButton from '../../components/InfoIconButton';

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

const EVENT_REPORT_TYPE_VALUE = 'eventreports';
const VALID_REPORT_TYPES = [{label: 'Flow Events', value: EVENT_REPORT_TYPE_VALUE}];

// poll for 5 seconds
const REPORTS_REFRESH_TIMER = 5000;

const usePollLatestResourceCollection = resourceType => {
  const dispatch = useDispatch();

  useEffect(() => {
    let timerId;

    if (resourceType) {
      timerId = setInterval(() => {
        dispatch(actions.resource.requestCollection(resourceType, null, true));
      }, REPORTS_REFRESH_TIMER);
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
  const isValidReportType = resourceType && VALID_REPORT_TYPES.some(({value}) => value === resourceType);

  useEffect(() => {
    const url = resourceType === undefined ? `${match.path}/:reportType` : match.path;

    if (!isValidReportType) {
      // EVENT_REPORT_TYPE is the default report type
      const defaultEventReportPath =
        generatePath(url, {
          ...match.params,
          reportType: EVENT_REPORT_TYPE_VALUE,
        });

      history.replace(defaultEventReportPath);
    }
  }, [history, isValidReportType, match.params, match.path, resourceType]);

  useEffect(() => {
    dispatch(actions.patchFilter(resourceType, defaultFilter));
  }, [dispatch, resourceType]);
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
  const selectedReportTypeLabel = () => VALID_REPORT_TYPES.find(({value}) => value === resourceType)?.label;
  const info = infoText[resourceType];

  const reportTypeLabel = VALID_REPORT_TYPES.find(({value}) => value === resourceType)?.label;

  if (!isValidReportType) { return null; }

  return (
    <>
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
            {VALID_REPORT_TYPES.map(({label, value}) => (
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
            {reportTypeLabel} report results  {info && <InfoIconButton info={info} />}
          </Typography>
          <div className={classes.emptySpace} />

          <IconTextButton
            data-test="addNewResource"
            component={Link}
            to={`${location.pathname}/add/${resourceType}/${generateNewId()}`}
            variant="text"
            color="primary">
            <AddIcon /> Create {reportTypeLabel}
          </IconTextButton>
        </div>
        <LoadResources required resources={`${resourceType},integrations,flows`}>
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
    </>
  );
}
