import { MenuItem, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { useEffect, useCallback, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { generatePath, Link, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { Spinner } from '@celigo/fuse-ui';
import actions from '../../actions';
import CeligoPageBar from '../../components/CeligoPageBar';
import CeligoSelect from '../../components/CeligoSelect';
import ResourceDrawer from '../../components/drawer/Resource';
import AddIcon from '../../components/icons/AddIcon';
import ArrowDownIcon from '../../components/icons/ArrowDownIcon';
import LoadResources from '../../components/LoadResources';
import CeligoPagination from '../../components/CeligoPagination';
import ResourceTable from '../../components/ResourceTable';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../reducers';
import { generateNewId } from '../../utils/resource';
import ViewReportDetails from './ViewReportDetails';
import infoText from '../ResourceList/infoText';
import InfoIconButton from '../../components/InfoIconButton';
import RefreshIcon from '../../components/icons/RefreshIcon';
import { TextButton } from '../../components/Buttons';
import ActionGroup from '../../components/ActionGroup';
import { buildDrawerUrl, drawerPaths } from '../../utils/rightDrawer';
import NoResultTypography from '../../components/NoResultTypography';
import messageStore from '../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
  },
  resultContainer: {
    maxHeight: `calc(100vh - (${theme.appBarHeight}px + ${theme.pageBarHeight}px))`,
    overflowY: 'auto',
  },
  reportTypes: {
    border: 'none',
  },
  tablePagination: {
    display: 'flex',
    '& > div': {
      marginRight: theme.spacing(-2),
    },
  },
  resultData: {
    margin: theme.spacing(3),
    background: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    overflowX: 'auto',
  },
  reportsTable: {
    overflowX: 'auto',
  },
  reportsHeading: {
    display: 'flex',
    alignItems: 'center',
  },
}));
const defaultFilter = {
  sort: { order: 'desc', orderBy: 'createdAt' },
  paging: {
    rowsPerPage: 25,
    currPage: 0,
  },
};

const EVENT_REPORT_TYPE_VALUE = 'eventreports';
export const VALID_REPORT_TYPES = [{label: 'Flow events', value: EVENT_REPORT_TYPE_VALUE}];

// poll for 5 seconds
const REPORTS_REFRESH_TIMER = 5000;

const PollLatestResourceCollection = ({resourceType}) => {
  const dispatch = useDispatch();
  const isReportTypeRunningOrQueued = useSelector(state => selectors.isAnyReportRunningOrQueued(state, resourceType));

  useEffect(() => {
    if (resourceType && isReportTypeRunningOrQueued) {
      dispatch(actions.app.polling.start(actions.resource.requestCollection(resourceType, null, true), REPORTS_REFRESH_TIMER));
    }

    return () => {
      dispatch(actions.app.polling.stopSpecificPollProcess(actions.resource.requestCollection(resourceType, null, true)));
    };
  }, [dispatch, isReportTypeRunningOrQueued, resourceType]);

  return null;
};

const Pagination = ({ filterKey}) => {
  const reportsResultFilter = useSelector(
    state => selectors.filter(state, filterKey), shallowEqual
  );
  const list = useSelectorMemo(
    selectors.mkEventReportsFiltered,
    reportsResultFilter
  );
  const dispatch = useDispatch();

  const handleChangePage = useCallback(
    (e, newPage) => dispatch(
      actions.patchFilter(filterKey, {
        paging: {
          ...reportsResultFilter.paging,
          currPage: newPage,
        },
      })
    ),
    [dispatch, filterKey, reportsResultFilter.paging]
  );
  const classes = useStyles();

  const { currPage, rowsPerPage } = reportsResultFilter.paging || {};

  return (

    <CeligoPagination
      className={classes.tablePagination}
      count={list.count}
      page={currPage}
      rowsPerPage={rowsPerPage}
      onChangePage={handleChangePage}
      />

  );
};

const RefreshPaginationComponent = ({resourceType}) => {
  const [isRefreshedByUser, setIsRefreshedByUser] = useState(false);
  const dispatch = useDispatch();
  const classes = useStyles();
  const resourceStatus = useSelectorMemo(
    selectors.makeAllResourceStatusSelector,
    resourceType || ''
  );
  const {isLoading: isLoadingResource} = resourceStatus?.[0] || {};

  useEffect(() => {
    if (!isLoadingResource) {
      setIsRefreshedByUser(false);
    }
  }, [isLoadingResource]);

  return (
    <>
      <TextButton
        data-test="refreshReports"
        startIcon={<RefreshIcon />}
        disabled={isRefreshedByUser}
        onClick={() => {
          setIsRefreshedByUser(true);
          dispatch(actions.resource.requestCollection(resourceType, null, true));
        }}
    >
        Refresh
      </TextButton>

      {isRefreshedByUser ? <div className={classes.tablePaginationRoot} />
        : <Pagination filterKey={resourceType} />}
    </>

  );
};
const Loading = ({resourceType}) => {
  const resourceStatus = useSelectorMemo(
    selectors.makeAllResourceStatusSelector,
    resourceType || ''
  );
  const {isReady: isDataReadyAfterUserRefresh} = resourceStatus?.[0] || {};

  return !isDataReadyAfterUserRefresh ? (
    <Spinner center="horizontal" size="large" sx={{m: '20px'}} />
  ) : null;
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
    dispatch(actions.patchFilter(resourceType, {...defaultFilter, type: resourceType }));

    return () => dispatch(actions.clearFilter(resourceType));
  }, [dispatch, resourceType]);
  const filter = useSelector(state => selectors.filter(state, resourceType));

  const selectNewReportType = e => {
    const reportType = e.target.value;
    const reportTypePath = generatePath(match.path, {
      ...match.params,
      reportType,
    });

    history.replace(reportTypePath);
  };

  const list = useSelectorMemo(
    selectors.mkEventReportsFiltered,
    filter
  );

  const selectedReportTypeLabel = () => VALID_REPORT_TYPES.find(({value}) => value === resourceType)?.label;
  const info = infoText[resourceType];

  const reportTypeLabel = VALID_REPORT_TYPES.find(({value}) => value === resourceType)?.label;

  if (!isValidReportType) { return null; }

  return (
    <>
      <ResourceDrawer />
      <ViewReportDetails />
      <PollLatestResourceCollection resourceType={resourceType} />
      <CeligoPageBar
        title="Reports" infoText={infoText.reports}>
        <div>
          <CeligoSelect
            className={classes.reportTypes}
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
        <div className={classes.resultData}>
          <div className={classes.actions}>
            <Typography
              variant="h4"
              component="div"
              className={classes.reportsHeading}
              >
              {reportTypeLabel} report results  {info && <InfoIconButton info={info} title={`${reportTypeLabel} report results`} />}
            </Typography>
            <ActionGroup position="right">
              <TextButton
                data-test="addNewResource"
                component={Link}
                to={buildDrawerUrl({
                  path: drawerPaths.RESOURCE.ADD,
                  baseUrl: location.pathname,
                  params: { resourceType, id: generateNewId() },
                })}
                startIcon={<AddIcon />}>
                Run report
              </TextButton>
              <RefreshPaginationComponent
                resourceType={resourceType} />
            </ActionGroup>
          </div>
          <Loading resourceType={resourceType} />
          <div className={classes.reportsTable}>
            <LoadResources required resources={`${resourceType},integrations,flows`}>
              {list.total === 0 ? (
                <NoResultTypography>
                  {messageStore('NO_RESULT', {message: 'report results'})}
                </NoResultTypography>
              ) : (
                <ResourceTable
                  resourceType={resourceType}
                  resources={list.resources}
                />
              )}
            </LoadResources>
          </div>
        </div>
      </div>
    </>
  );
}
