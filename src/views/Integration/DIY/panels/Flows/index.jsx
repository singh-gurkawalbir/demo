import { Grid, makeStyles } from '@material-ui/core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import actions from '../../../../../actions';
import ActionGroup from '../../../../../components/ActionGroup';
import AttachFlowsDialog from '../../../../../components/AttachFlows';
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
import { UNASSIGNED_SECTION_ID } from '../../../../../utils/constants';
import { redirectToFirstFlowGrouping } from '../../../../../utils/flowgroupingsRedirectTo';
import { getTemplateUrlName } from '../../../../../utils/template';
import ScheduleDrawer from '../../../../FlowBuilder/drawers/Schedule';
import MappingDrawerRoute from '../../../../MappingDrawer';
import ErrorsListDrawer from '../../../common/ErrorsList';
import Attach from '../../../../../components/ResourceTable/flows/actions/Attach';
import CreateFlowGroup from '../../../../../components/ResourceTable/flows/actions/CreateFlowGroup';
import EditFlowGroup from '../../../../../components/ResourceTable/flows/actions/EditFlowGroup';
import FlowgroupDrawer from '../../../../../components/drawer/Flowgroup';
import DragContainer from '../../../../../components/Mapping/DragContainer';
import FlowGroupRow from './FlowGroupRow';
import { shouldHaveUnassignedSection } from '../../../../../utils/resource';

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
  flowGroupRowUnassigned: {
    '&>a': {
      borderTop: `1px solid ${theme.palette.secondary.lightest}`,
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
    title: 'Unassigned',
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
  const integration = useSelector(state => selectors.resource(state, 'integrations', integrationId));
  const hasUnassignedSection = shouldHaveUnassignedSection(flowGroupingsSections, flows);
  const groupedFlows = useMemo(() => flows.filter(flow => sectionId === UNASSIGNED_SECTION_ID ? !flow._flowGroupingId
    : flow._flowGroupingId === sectionId
  ), [flows, sectionId]);
  const onSortEnd = useCallback(({oldIndex, newIndex}) => {
    dispatch(actions.resource.integrations.flowGroups.shiftOrder(integration, flowGroupingsSections[oldIndex].title, newIndex));
  }, [dispatch, flowGroupingsSections, integration]);

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
        <LoadResources required resources="flows">
          <CeligoTable
            data-public
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

const FlowListing = ({integrationId, filterKey, actionProps, flows}) => {
  const match = useRouteMatch();
  const history = useHistory();
  const integrationIsAvailable = useSelector(state => selectors.resource(state, 'integrations', integrationId)?._id);

  const flowGroupingsSections = useSelector(state => selectors.flowGroupingsSections(state, integrationId));

  const redirectTo = redirectToFirstFlowGrouping(flows, flowGroupingsSections, match);

  useEffect(() => {
    // redirect should only happen if integration is still present and not deleted
    const shouldRedirect = !!redirectTo && !!integrationIsAvailable;

    if (shouldRedirect) {
      history.replace(redirectTo);
    }
  }, [history, redirectTo, integrationIsAvailable]);

  if (!flowGroupingsSections) {
    return (
      <CeligoTable
        data-public
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
      flowGroupingsSections={flowGroupingsSections}
    />
  );
};
const defaultFilter = {
  take: parseInt(process.env.DEFAULT_TABLE_ROW_COUNT, 10) || 10,
  sort: { orderBy: 'name', order: 'asc' },
  searchBy: [
    'name',
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

  if (resource.flowGroupings?.length > 0) {
    actions.push(EditFlowGroup);
  }

  return actions;
};
export default function FlowsPanel({ integrationId, childId }) {
  const isStandalone = integrationId === 'none';
  const classes = useStyles();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const [showDialog, setShowDialog] = useState(false);
  const sectionId = match?.params?.sectionId;
  const currentIntegrationId = childId || integrationId;
  const filterKey = `${currentIntegrationId}-flows${sectionId ? `-${sectionId}` : ''}`;

  // Celigo table and Keyword components are patching the same time...the order of
  // execution isn't consistent...we have to consider refactoring the code to patch only
  // one config
  useEffect(() => {
    dispatch(actions.patchFilter(filterKey, defaultFilter));
  }, [dispatch, filterKey]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const flowFilter = useSelector(state => selectors.filter(state, filterKey));

  const integrationChildren = useSelectorMemo(selectors.mkIntegrationChildren, integrationId);
  const isIntegrationApp = useSelector(state => selectors.isIntegrationApp(state, integrationId));
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  const isMonitorLevelUser = useSelector(state => selectors.isFormAMonitorLevelAccess(state, integrationId));
  const flows = useSelectorMemo(selectors.mkDIYIntegrationFlowList, integrationId, childId, isUserInErrMgtTwoDotZero, flowFilter);

  const { canCreate, canAttach, canEdit } = useSelector(state => {
    const permission = selectors.resourcePermissions(state, 'integrations', integrationId, 'flows') || {};

    return {
      canCreate: !!permission.create,
      canAttach: !!permission.attach,
      canEdit: !!permission.edit,
    };
  },
  shallowEqual);
  const flowErrorCountStatus = useSelector(state => selectors.openErrorsStatus(state, integrationId));

  const handleClose = useCallback(() => {
    setShowDialog();
  }, [setShowDialog]);

  useEffect(() => {
    if (!isUserInErrMgtTwoDotZero) return;

    dispatch(actions.errorManager.integrationLatestJobs.requestPoll({ integrationId }));
    dispatch(actions.errorManager.integrationErrors.requestPoll({ integrationId }));

    return () => {
      dispatch(actions.errorManager.integrationLatestJobs.cancelPoll());
      dispatch(actions.errorManager.integrationErrors.cancelPoll());
    };
  }, [dispatch, integrationId, isUserInErrMgtTwoDotZero]);

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
    }), [integrationId, childId, isIntegrationApp, isUserInErrMgtTwoDotZero, integrationChildren, appName, flowAttributes, integration, templateName]);

  if (!flowErrorCountStatus && isUserInErrMgtTwoDotZero) {
    return (
      <Spinner centerAll />
    );
  }
  const infoTextFlow =
    'You can see the status, scheduling info, and when a flow was last modified, as well as mapping fields, enabling, and running your flow. You can view any changes to a flow, as well as what is contained within the flow, and even clone or download a flow.';

  const basePath = getBasePath(match);
  const rowData = { ...integration, canAttach };

  return (
    <div className={classes.root}>
      {selectedComponent}
      {showDialog && (
        <AttachFlowsDialog
          integrationId={integrationId}
          onClose={handleClose}
        />
      )}
      <MappingDrawerRoute integrationId={integrationId} />
      {isUserInErrMgtTwoDotZero && <ErrorsListDrawer integrationId={integrationId} childId={childId} />}
      <ScheduleDrawer />
      <QueuedJobsDrawer />
      <FlowgroupDrawer integrationId={integrationId} />

      <PanelHeader title={<Title flows={flows} integrationId={currentIntegrationId} />} infoText={infoTextFlow} className={classes.flowPanelTitle}>
        <ActionGroup>
          <KeywordSearch
            filterKey={filterKey}
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
          {!isStandalone && !isMonitorLevelUser && (
            <ActionMenu
              setSelectedComponent={setSelectedComponent}
              useRowActions={useRowActions}
              rowData={rowData}
              isIntegrationPage
            />
          )}
        </ActionGroup>
      </PanelHeader>

      <LoadResources required resources="flows, exports">
        <FlowListing
          integrationId={currentIntegrationId}
          filterKey={filterKey}
          actionProps={actionProps}
          flows={flows}
        />
      </LoadResources>
    </div>
  );
}
