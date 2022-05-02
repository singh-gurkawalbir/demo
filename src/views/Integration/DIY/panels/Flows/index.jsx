import { Grid, makeStyles, Typography } from '@material-ui/core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import actions from '../../../../../actions';
import ActionGroup from '../../../../../components/ActionGroup';
import { TextButton } from '../../../../../components/Buttons';
import Status from '../../../../../components/Buttons/Status';
import CeligoTable from '../../../../../components/CeligoTable';
import ActionMenu from '../../../../../components/CeligoTable/ActionMenu';
import AddIcon from '../../../../../components/icons/AddIcon';
import QueuedJobsDrawer from '../../../../../components/JobDashboard/QueuedJobs/QueuedJobsDrawer';
import KeywordSearch from '../../../../../components/KeywordSearch';
import LoadResources from '../../../../../components/LoadResources';
import PanelHeader from '../../../../../components/PanelHeader';
import flowTableMeta from '../../../../../components/ResourceTable/flows/metadata';
import Spinner from '../../../../../components/Spinner';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../../../reducers';
import { UNASSIGNED_SECTION_ID, UNASSIGNED_SECTION_NAME, FLOW_GROUP_FORM_KEY, NO_RESULT_SEARCH_MESSAGE } from '../../../../../constants';
import { redirectToFirstFlowGrouping } from '../../../../../utils/flowgroupingsRedirectTo';
import { getTemplateUrlName } from '../../../../../utils/template';
import ScheduleDrawer from '../../../../FlowBuilder/drawers/Schedule';
import MappingDrawerRoute from '../../../../MappingDrawer';
import ErrorsListDrawer from '../../../common/ErrorsList';
import Attach from '../../../../../components/ResourceTable/flows/actions/Attach';
import CreateFlowGroup from '../../../../../components/ResourceTable/flows/actions/CreateFlowGroup';
import EditFlowGroup from '../../../../../components/ResourceTable/flows/actions/EditFlowGroup';
import FlowgroupDrawer from '../../../../../components/drawer/Flowgroup';
import DragContainer from '../../../../../components/DragContainer';
import FlowGroupRow from './FlowGroupRow';
import { shouldHaveUnassignedSection } from '../../../../../utils/flows';
import NoResultTypography from '../../../../../components/NoResultTypography';
import InfoIcon from '../../../../../components/icons/InfoIcon';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  divider: {
    width: 1,
    height: 18,
    borderLeft: `1px solid ${theme.palette.secondary.lightest}`,
    margin: 5,
  },
  flowsPanelWithStatus: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  content: {
    width: '100%',
  },
  flowTitle: {
    position: 'relative',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    '&:before': {
      content: '""',
      width: '3px',
      top: 0,
      height: '100%',
      position: 'absolute',
      background: 'transparent',
      left: '0px',
    },
    '&:hover': {
      '&:before': {
        background: theme.palette.primary.main,
      },
    },
  },
  subNav: {
    minWidth: 200,
    maxWidth: 240,
    borderRight: `solid 1px ${theme.palette.secondary.lightest}`,
  },
  listItem: {
    color: theme.palette.secondary.main,
    width: '100%',
  },
  activeListItem: {
    color: theme.palette.primary.main,
  },
  flowsGroupContainer: {
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
  },
  flowPanelTitle: {
    overflowX: 'auto',
    '&>h4': {
      minWidth: '300px',
    },
  },
  flowPanelStatusHeader: {
    fontSize: 14,
  },
  // TODO: Azhar (flow group name component)
  flowGroupRowUnassigned: {
    '&>a': {
      padding: 0,
    },
    '&>a>span>span': {
      borderTop: `1px solid ${theme.palette.secondary.lightest}`,
      padding: theme.spacing(1, 0),
    },
  },
  noSearchResults: {
    marginTop: theme.spacing(1),
  },
  // TODO: Azhar (component needed)
  infoFilter: {
    fontStyle: 'italic',
    display: 'flex',
    margin: theme.spacing(-2, 2, 3),
    alignItems: 'center',
    color: theme.palette.secondary.main,
    '& > svg': {
      marginRight: theme.spacing(0.5),
      fontSize: theme.spacing(2),
      color: theme.palette.text.hint,
    },
  },
}));

const getBasePath = match => {
  if (match.params?.sectionId) {
    return match.url;
  }

  // remove just the tab section in the url
  return match.url
    .split('/')
    .slice(0, -1)
    .join('/');
};
const tilesFilterConfig = { type: 'tiles'};

const SortableItemComponent = props => (
  <FlowGroupRow {...props} />
);
const LastRowSortableItemComponent = props => {
  const lastRow = {
    title: UNASSIGNED_SECTION_NAME,
    sectionId: UNASSIGNED_SECTION_ID,
  };
  const classes = useStyles();

  return (
    <FlowGroupRow rowData={lastRow} {...props} className={classes.flowGroupRowUnassigned} />
  );
};
const FlowListingTable = ({
  flows,
  filterKey,
  flowTableMeta,
  actionProps,
  integrationId,
  flowGroupingsSections,
}) => {
  const match = useRouteMatch();
  const classes = useStyles();
  const dispatch = useDispatch();

  const sectionId = match?.params?.sectionId;
  const hasUnassignedSection = shouldHaveUnassignedSection(flowGroupingsSections, flows);
  const groupedFlows = useMemo(() => flows.filter(flow => sectionId === UNASSIGNED_SECTION_ID ? !flow._flowGroupingId
    : flow._flowGroupingId === sectionId
  ), [flows, sectionId]);
  const onSortEnd = useCallback(({oldIndex, newIndex}) => {
    dispatch(actions.resource.integrations.flowGroups.shiftOrder(integrationId, flowGroupingsSections[oldIndex].sectionId, newIndex));
  }, [dispatch, flowGroupingsSections, integrationId]);

  return (
    <Grid container wrap="nowrap" className={classes.flowsGroupContainer}>
      <Grid item className={classes.subNav}>
        <DragContainer
          integrationId={integrationId}
          classes={classes}
          SortableItemComponent={SortableItemComponent}
          LastRowSortableItemComponent={LastRowSortableItemComponent}
          items={flowGroupingsSections}
          onSortEnd={onSortEnd}
          flows={flows}
          hasUnassignedSection={hasUnassignedSection}
        />
      </Grid>
      <Grid item className={classes.content}>
        <LoadResources required integrationId={integrationId} resources="flows">
          <CeligoTable
            data={groupedFlows}
            filterKey={filterKey}
            {...flowTableMeta}
            actionProps={actionProps}
          />
        </LoadResources>
      </Grid>
    </Grid>
  );
};

const FlowListing = ({integrationId, filterKey, searchFilterKey, actionProps, flows}) => {
  const match = useRouteMatch();
  const history = useHistory();
  const integrationIsAvailable = useSelector(state => selectors.resource(state, 'integrations', integrationId)?._id);

  const flowGroupingsSections = useSelectorMemo(selectors.mkFlowGroupingsSections, integrationId);
  const hasUnassignedSection = shouldHaveUnassignedSection(flowGroupingsSections, flows);
  const flowGroupFormSaveStatus = useSelector(state => selectors.asyncTaskStatus(state, FLOW_GROUP_FORM_KEY));
  const searchFilter = useSelector(state => selectors.filter(state, searchFilterKey));
  const filteredFlowGroups = useMemo(() => {
    if (flowGroupingsSections && searchFilter.keyword) {
      return flowGroupingsSections.filter(({ title, sectionId }) =>
        title.toUpperCase().includes(searchFilter.keyword.toUpperCase()) || flows.some(flow => (flow._flowGroupingId === sectionId))
      );
    }

    return flowGroupingsSections;
  }, [searchFilter, flowGroupingsSections, flows]);

  const redirectTo = redirectToFirstFlowGrouping(filteredFlowGroups, match, hasUnassignedSection);

  useEffect(() => {
    // redirect should only happen if integration is still present and not deleted
    const shouldRedirect = !!redirectTo && !!integrationIsAvailable && !flowGroupFormSaveStatus;

    if (shouldRedirect) {
      history.replace(redirectTo);
    }
  }, [history, redirectTo, integrationIsAvailable, flowGroupFormSaveStatus]);

  if (!flowGroupingsSections) {
    return (
      <CeligoTable
        data={flows}
        filterKey={filterKey}
        {...flowTableMeta}
        actionProps={actionProps}
      />
    );
  }

  return (
    <FlowListingTable
      flows={flows}
      filterKey={filterKey}
      flowTableMeta={flowTableMeta}
      actionProps={actionProps}
      integrationId={integrationId}
      flowGroupingsSections={filteredFlowGroups}
    />
  );
};
const defaultFilter = {
  take: parseInt(process.env.DEFAULT_TABLE_ROW_COUNT, 10) || 10,
  sort: { orderBy: 'name', order: 'asc' },
  searchBy: [
    'name',
    'description',
  ],
};
const Title = ({flows, integrationId}) => {
  const classes = useStyles();
  const allTiles = useSelectorMemo(
    selectors.makeResourceListSelector,
    tilesFilterConfig
  ).resources;
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  const yetToLoadOpenErrors = useSelector(state => {
    const status = selectors.openErrorsStatus(state, integrationId);
    const data = selectors.openErrorsDetails(state, integrationId);

    return !status || (status === 'requested' && !data);
  });
  const integrationErrorsMap = useSelector(state => selectors.openErrorsMap(state, integrationId));
  const currentTileErrorCount = isUserInErrMgtTwoDotZero ? allTiles.find(t => t._integrationId === integrationId)?.numError : 0;

  const totalCount = flows.reduce((count, flow) => {
    if (!flow.disabled && integrationErrorsMap[flow._id]) {
      return count + integrationErrorsMap[flow._id];
    }

    return count;
  }, 0);

  const errorCount = yetToLoadOpenErrors ? currentTileErrorCount : totalCount;

  return (
    <div className={classes.flowsPanelWithStatus}>
      Integration flows
      {errorCount ? (
        <>
          <span className={classes.divider} />
          <Status size="mini" variant="error" className={classes.flowPanelStatusHeader}>
            {errorCount === 1 ? `${errorCount} error` : `${errorCount} errors`}
          </Status>
        </>
      ) : null}
    </div>
  );
};

const useRowActions = resource => {
  let actions = [];

  if (resource && !resource._connectorId && resource.canAttach) {
    actions.push(Attach);
  }

  actions = [...actions, CreateFlowGroup];

  if (resource.flowGroupings?.length) {
    actions.push(EditFlowGroup);
  }

  return actions;
};
export default function FlowsPanel({ integrationId, childId }) {
  const isStandalone = integrationId === 'none';
  const classes = useStyles();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const sectionId = match?.params?.sectionId;
  const currentIntegrationId = childId || integrationId;
  const searchFilterKey = `${currentIntegrationId}-flows`;
  const filterKey = `${currentIntegrationId}-flows${sectionId ? `-${sectionId}` : ''}`;

  // Celigo table and Keyword components are patching the same time...the order of
  // execution isn't consistent...we have to consider refactoring the code to patch only
  // one config
  useEffect(() => {
    dispatch(actions.patchFilter(filterKey, defaultFilter));
  }, [dispatch, filterKey]);
  const [selectedComponent, setSelectedComponent] = useState(null);

  const finalFilter = useSelector(state => {
    const flowFilter = selectors.filter(state, filterKey);
    const searchFilter = selectors.filter(state, searchFilterKey);

    return {
      ...flowFilter,
      keyword: searchFilter.keyword,
    };
  }, shallowEqual);

  const integrationChildren = useSelectorMemo(selectors.mkIntegrationChildren, integrationId);
  const isIntegrationApp = useSelector(state => selectors.isIntegrationApp(state, integrationId));
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  const isMonitorLevelUser = useSelector(state => selectors.isFormAMonitorLevelAccess(state, integrationId));
  const flows = useSelectorMemo(selectors.mkDIYIntegrationFlowList, integrationId, childId, isUserInErrMgtTwoDotZero, finalFilter);
  const flowGroupingsSections = useSelectorMemo(selectors.mkFlowGroupingsSections, integrationId);

  const { canCreate, canAttach, canEdit } = useSelector(state => {
    const permission = selectors.resourcePermissions(state, 'integrations', integrationId, 'flows') || {};

    return {
      canCreate: !!permission.create,
      canAttach: !!permission.attach,
      canEdit: !!permission.edit,
    };
  },
  shallowEqual);
  const flowErrorCountStatus = useSelector(state => selectors.openErrorsStatus(state, childId || integrationId));

  useEffect(() => {
    if (!isUserInErrMgtTwoDotZero) return;

    dispatch(actions.errorManager.integrationLatestJobs.requestPoll({ integrationId: childId || integrationId }));
    dispatch(actions.errorManager.integrationErrors.requestPoll({ integrationId: childId || integrationId }));

    return () => {
      dispatch(actions.errorManager.integrationLatestJobs.cancelPoll());
      dispatch(actions.errorManager.integrationErrors.cancelPoll());
    };
  }, [childId, dispatch, integrationId, isUserInErrMgtTwoDotZero]);

  const integration = useSelectorMemo(selectors.makeResourceSelector, 'integrations', integrationId);
  const templateName = useSelector(state => {
    if (!integration || !integration._templateId) return null;
    const t = selectors.resource(state, 'marketplacetemplates', integration._templateId);

    return getTemplateUrlName(t && t.applications);
  });
  const flowAttributes = useSelectorMemo(selectors.mkFlowAttributes, flows, integration, childId);
  const appName = useSelectorMemo(selectors.integrationAppName, integrationId);
  const actionProps = useMemo(() => (
    {
      parentId: integrationId,
      childId,
      isIntegrationApp,
      resourceType: 'flows',
      isUserInErrMgtTwoDotZero,
      appName,
      flowAttributes,
      integration,
      showChild: (isIntegrationApp && childId === integrationId),
      integrationChildren,
      templateName,
      sectionId,
    }), [integrationId, childId, isIntegrationApp, isUserInErrMgtTwoDotZero, integrationChildren, appName, flowAttributes, integration, templateName, sectionId]);

  const rowData = useMemo(() => ({
    ...integration,
    canAttach,
    sectionId,
  }), [integration, canAttach, sectionId]);

  if (!flowErrorCountStatus && isUserInErrMgtTwoDotZero) {
    return (
      <Spinner centerAll />
    );
  }
  const infoTextFlow =
    'You can see the status, scheduling info, and when a flow was last modified, as well as mapping fields, enabling, and running your flow. You can view any changes to a flow, as well as what is contained within the flow, and even clone or download a flow.';

  const infoSearchFilter =
    'Showing all flow groups that contain search matches.';

  const basePath = getBasePath(match);

  return (
    <>
      <div className={classes.root}>
        {selectedComponent}
        <MappingDrawerRoute integrationId={integrationId} />
        {isUserInErrMgtTwoDotZero && <ErrorsListDrawer integrationId={integrationId} childId={childId} />}
        <ScheduleDrawer />
        <QueuedJobsDrawer integrationId={integrationId} />
        <FlowgroupDrawer integrationId={integrationId} />

        <PanelHeader title={<Title flows={flows} integrationId={currentIntegrationId} />} infoText={infoTextFlow} className={classes.flowPanelTitle}>
          <ActionGroup>
            <KeywordSearch
              filterKey={searchFilterKey}
            />
            {canCreate && !isIntegrationApp && (
            <TextButton
              component={Link}
              startIcon={<AddIcon />}
              to={`${basePath}/flowBuilder/new`}
              data-test="createFlow">
              Create flow
            </TextButton>
            )}
            {/* check if this condition is correct */}
            {canEdit && !isIntegrationApp && (
            <TextButton
              startIcon={<AddIcon />}
              component={Link}
              to={`${basePath}/dataLoader/new`}
              data-test="loadData">
              Load data
            </TextButton>
            )}
            {!isStandalone && !isMonitorLevelUser && !isIntegrationApp && (
            <ActionMenu
              setSelectedComponent={setSelectedComponent}
              useRowActions={useRowActions}
              rowData={rowData}
              iconLabel="More"
            />
            )}
          </ActionGroup>
        </PanelHeader>
        {(finalFilter.keyword && flows.length && flowGroupingsSections) ? (
          <Typography component="div" variant="caption" className={classes.infoFilter}>
            <InfoIcon />
            {infoSearchFilter}
          </Typography>
        ) : ''}

        <LoadResources required integrationId={integrationId} resources="flows,exports">
          <FlowListing
            integrationId={currentIntegrationId}
            filterKey={filterKey}
            searchFilterKey={searchFilterKey}
            actionProps={actionProps}
            flows={flows}
        />
        </LoadResources>
      </div>
      <div className={classes.noSearchResults}>
        {(finalFilter.keyword && !flows.length && !flowGroupingsSections?.some(({title}) => title.toUpperCase().includes(finalFilter.keyword.toUpperCase()))) ? (
          <NoResultTypography>{NO_RESULT_SEARCH_MESSAGE}</NoResultTypography>
        ) : ''}
      </div>
    </>
  );
}
