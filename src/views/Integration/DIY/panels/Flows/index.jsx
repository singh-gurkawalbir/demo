import { Grid, List, ListItem, makeStyles } from '@material-ui/core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useHistory, useRouteMatch } from 'react-router-dom';
import actions from '../../../../../actions';
import AttachFlowsDialog from '../../../../../components/AttachFlows';
import CeligoTable from '../../../../../components/CeligoTable';
import AddIcon from '../../../../../components/icons/AddIcon';
import AttachIcon from '../../../../../components/icons/ConnectionsIcon';
import IconTextButton from '../../../../../components/IconTextButton';
import QueuedJobsDrawer from '../../../../../components/JobDashboard/QueuedJobs/QueuedJobsDrawer';
import KeywordSearch from '../../../../../components/KeywordSearch';
import LoadResources from '../../../../../components/LoadResources';
import PanelHeader from '../../../../../components/PanelHeader';
import flowTableMeta from '../../../../../components/ResourceTable/flows/metadata';
import Spinner from '../../../../../components/Spinner';
import SpinnerWrapper from '../../../../../components/SpinnerWrapper';
import StatusCircle from '../../../../../components/StatusCircle';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../../../reducers';
import { STANDALONE_INTEGRATION } from '../../../../../utils/constants';
import { getTemplateUrlName } from '../../../../../utils/template';
import ScheduleDrawer from '../../../../FlowBuilder/drawers/Schedule';
import MappingDrawerRoute from '../../../../MappingDrawer';
import ErrorsListDrawer from '../../../common/ErrorsList';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  actions: {
    display: 'flex',
  },
  errorStatus: {
    justifyContent: 'center',
    height: 'unset',
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
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
    padding: theme.spacing(3, 2),
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
}));

const getBasePath = match => {
  if (match.params?.sectionId) {
    // if there are sections in the path strip it out the last three segments
    // it would appear like this /flows/sections/someSectionOd
    return match.url
      .split('/')
      .slice(0, -3)
      .join('/');
  }

  // remove just the tab section in the url
  return match.url
    .split('/')
    .slice(0, -1)
    .join('/');
};
const tilesFilterConfig = { type: 'tiles'};

const MISCELLANEOUS_SECTION_ID = 'miscellaneous';
const FlowListingTable = ({
  flows,
  filterKey,
  flowTableMeta,
  actionProps,
  sectionId,
}) => {
  const groupedFlows = useMemo(() => flows.filter(flow => sectionId === MISCELLANEOUS_SECTION_ID ? !flow._flowGroupingId
    : flow._flowGroupingId === sectionId
  ), [flows, sectionId]);

  return (
    <CeligoTable
      data={groupedFlows}
      filterKey={filterKey}
      {...flowTableMeta}
      actionProps={actionProps}
/>
  );
};

const FlowListing = ({integrationId, filterKey, actionProps, flows}) => {
  const match = useRouteMatch();
  const classes = useStyles();
  const history = useHistory();
  const flowGroupingsSections = useSelectorMemo(selectors.mkFlowGroupingsSections, integrationId);
  const allSection = useMemo(() =>
    flowGroupingsSections && [...flowGroupingsSections, {title: 'Miscellaneous', sectionId: MISCELLANEOUS_SECTION_ID}],
  [flowGroupingsSections]);

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
  const sectionId = match.params?.sectionId;

  if (!sectionId) {
    history.replace(`${match.url}/sections/${MISCELLANEOUS_SECTION_ID}`);
  }

  return (
    <Grid container wrap="nowrap">
      <Grid item className={classes.subNav}>
        <List>
          {allSection.map(({ title, sectionId }) => (
            <ListItem key={sectionId} className={classes.flowTitle}>
              <NavLink
                className={classes.listItem}
                activeClassName={classes.activeListItem}
                to={sectionId}
                data-test={sectionId}>
                {title}
              </NavLink>
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid item className={classes.content}>
        <LoadResources required resources="flows">

          <FlowListingTable
            flows={flows}
            filterKey={filterKey}
            flowTableMeta={flowTableMeta}
            actionProps={actionProps}
            sectionId={sectionId}
        />
        </LoadResources>
      </Grid>
    </Grid>
  );
};
const defaultFilter = {
  take: parseInt(process.env.DEFAULT_TABLE_ROW_COUNT, 10) || 10,
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
  const integrationErrorsMap = useSelector(state => selectors.errorMap(state, integrationId)?.data) || {};
  const currentTileErrorCount = isUserInErrMgtTwoDotZero ? allTiles.find(t => t._integrationId === integrationId)?.numError : 0;

  let totalErrors = 0;

  flows.forEach(flow => {
    if (!flow.disabled && integrationErrorsMap[flow._id]) {
      totalErrors += integrationErrorsMap[flow._id];
    }
  });

  return (
    <span className={classes.flowsPanelWithStatus}>
      Integration flows
      {(totalErrors || currentTileErrorCount) ? (
        <>
          <span className={classes.divider} />
          <span className={classes.errorStatus}>
            <StatusCircle variant="error" size="mini" />
            <span>{totalErrors || currentTileErrorCount} errors</span>
          </span>
        </>
      ) : null}
    </span>
  );
};
export default function FlowsPanel({ integrationId, childId }) {
  const isStandalone = integrationId === 'none';
  const classes = useStyles();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const [showDialog, setShowDialog] = useState(false);
  const filterKey = `${integrationId}-flows`;
  const flowFilter = useSelector(state => selectors.filter(state, filterKey));
  const integrationChildren = useSelectorMemo(selectors.mkIntegrationChildren, integrationId);
  const flowsFilterConfig = useMemo(() => ({ ...flowFilter,
    type: 'flows',
    filter: {
      $where() {
        const childIntegrationIds = integrationChildren.map(i => i.value);

        // eslint-disable-next-line react/no-this-in-sfc
        if (integrationId === STANDALONE_INTEGRATION.id) return !this._integrationId;
        // eslint-disable-next-line react/no-this-in-sfc
        if (childId && childId !== integrationId) return this._integrationId === childId;

        // eslint-disable-next-line react/no-this-in-sfc
        return childIntegrationIds.includes(this._integrationId);
      },
    } }), [childId, flowFilter, integrationChildren, integrationId]);
  const isIntegrationApp = useSelector(state => selectors.isIntegrationApp(state, integrationId));
  const flows = useSelectorMemo(
    selectors.makeResourceListSelector,
    flowsFilterConfig
  ).resources;
  const { canCreate, canAttach, canEdit } = useSelector(state => {
    const permission = selectors.resourcePermissions(state, 'integrations', integrationId, 'flows') || {};

    return {
      canCreate: !!permission.create,
      canAttach: !!permission.attach,
      canEdit: !!permission.edit,
    };
  },
  shallowEqual);
  const flowErrorCountStatus = useSelector(state => selectors.errorMap(state, integrationId)?.status);

  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
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
  const flowAttributes = useSelectorMemo(selectors.mkFlowAttributes, flows, integration);
  const appName = useSelectorMemo(selectors.integrationAppName, integrationId);
  const actionProps = useMemo(() => (
    {
      parentId: integrationId,
      storeId: childId,
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
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>
    );
  }
  const infoTextFlow =
    'You can see the status, scheduling info, and when a flow was last modified, as well as mapping fields, enabling, and running your flow. You can view any changes to a flow, as well as what is contained within the flow, and even clone or download a flow.';

  const basePath = getBasePath(match);

  return (
    <div className={classes.root}>
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

      <PanelHeader title={<Title flows={flows} integrationId={integrationId} />} infoText={infoTextFlow}>
        <div className={classes.actions}>
          <KeywordSearch
            filterKey={filterKey}
            defaultFilter={defaultFilter}
        />
          {canCreate && !isIntegrationApp && (
          <IconTextButton
            component={Link}
            to={`${basePath}/flowBuilder/new`}
            data-test="createFlow">
            <AddIcon /> Create flow
          </IconTextButton>
          )}
          {canAttach && !isStandalone && !isIntegrationApp && (
          <IconTextButton
            onClick={() => setShowDialog(true)}
            data-test="attachFlow">
            <AttachIcon /> Attach flow
          </IconTextButton>
          )}
          {/* check if this condition is correct */}
          {canEdit && !isIntegrationApp && (
          <IconTextButton
            component={Link}
            to={`${basePath}/dataLoader/new`}
            data-test="loadData">
            <AddIcon /> Load data
          </IconTextButton>
          )}
        </div>
      </PanelHeader>

      <LoadResources required resources="flows, exports">
        <FlowListing
          integrationId={integrationId}
          filterKey={filterKey}
          actionProps={actionProps}
          flows={flows}
        />
      </LoadResources>
    </div>
  );
}
