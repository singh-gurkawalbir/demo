import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { withRouter, useHistory, useRouteMatch, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography, IconButton } from '@material-ui/core';
import * as selectors from '../../reducers';
import actions from '../../actions';
import CeligoPageBar from '../../components/CeligoPageBar';
import LoadResources from '../../components/LoadResources';
import ResourceDrawer from '../../components/drawer/Resource';
import AddIcon from '../../components/icons/AddIcon';
import BottomDrawer from './drawers/BottomDrawer';
// import WizardDrawer from './drawers/Wizard';
// import RunDrawer from './drawers/Run';
import ScheduleDrawer from './drawers/Schedule';
import ConnectionsDrawer from './drawers/Connections';
import AuditLogDrawer from './drawers/AuditLog';
import QueuedJobsDrawer from '../../components/JobDashboard/QueuedJobs/QueuedJobsDrawer';
import SettingsDrawer from './drawers/Settings';
import ErrorDetailsDrawer from './drawers/ErrorsDetails';
import ChartsDrawer from './drawers/LineGraph';
import PageProcessor from './PageProcessor';
import PageGenerator from './PageGenerator';
import AppBlock from './AppBlock';
import itemTypes from './itemTypes';
import RunFlowButton from '../../components/RunFlowButton';
import SettingsIcon from '../../components/icons/SettingsIcon';
import ConnectionsIcon from '../../components/icons/ConnectionsIcon';
import AuditLogIcon from '../../components/icons/AuditLogIcon';
import CalendarIcon from '../../components/icons/CalendarIcon';
import CloseIcon from '../../components/icons/CloseIcon';
import HelpIcon from '../../components/icons/HelpIcon';
import EditableText from '../../components/EditableText';
import FlowToggle from '../../components/FlowToggle';
import { generateNewId, isNewId } from '../../utils/resource';
import { isIntegrationApp, isFreeFlowResource } from '../../utils/flows';
import FlowEllipsisMenu from '../../components/FlowEllipsisMenu';
import StatusCircle from '../../components/StatusCircle';
import useConfirmDialog from '../../components/ConfirmDialog';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import { isProduction } from '../../forms/utils';
import IconButtonWithTooltip from '../../components/IconButtonWithTooltip';
import CeligoTimeAgo from '../../components/CeligoTimeAgo';

const bottomDrawerMin = 41;
const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
    alignItems: 'center',
    margin: [[-7, 0]],
  },
  canvasContainer: {
    // border: 'solid 1px black',
    overflow: 'hidden',
    width: `calc(100vw - ${theme.drawerWidthMinimized}px)`,
    transition: theme.transitions.create(['width', 'height'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  canvasShift: {
    width: `calc(100vw - ${theme.drawerWidth}px)`,
  },
  canvas: {
    width: '100%',
    height: '100%',
    display: 'flex',
    overflow: 'auto',
  },
  generatorContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  processorContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    paddingRight: theme.spacing(3),
  },
  fabContainer: {
    position: 'absolute',
    right: theme.spacing(3),
    transition: theme.transitions.create(['bottom', 'width', 'height'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  title: {
    display: 'flex',
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sourceTitle: {
    marginBottom: theme.spacing(3),
  },
  destinationTitle: {
    width: 320,
    marginLeft: 100,
    marginBottom: theme.spacing(3),
  },
  generatorRoot: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: theme.spacing(0, 0, 3, 3),
    minWidth: 429,
  },
  processorRoot: {
    padding: theme.spacing(0, 3, 3, 0),
  },
  newPP: {
    marginLeft: 100,
  },
  newPG: {
    marginRight: 50,
  },
  dataLoaderHelp: {
    margin: theme.spacing(5, 0, 0, 5),
    maxWidth: 450,
  },
  // NOTE: 52px is collapsed left side bar. 410px is right page header action buttons + padding
  // we use these to force the input to be as large as possible in the pageBar
  // without causing any weird wrapping.
  editableTextInput: {
    width: `calc(100vw - ${52 + 410}px)`,
  },
  editableTextInputShift: {
    width: `calc(100vw - ${theme.drawerWidth + 410}px)`,
  },
  errorStatus: {
    justifyContent: 'center',
    height: 'unset',
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    fontSize: '12px',
  },
  divider: {
    width: 1,
    height: 30,
    borderLeft: `1px solid ${theme.palette.secondary.lightest}`,
    margin: 5,
  },
}));

function FlowBuilder() {
  const match = useRouteMatch();
  const location = useLocation();
  const { flowId, integrationId } = match.params;
  const history = useHistory();
  const isNewFlow = !flowId || flowId.startsWith('new');
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  // Bottom drawer is shown for existing flows and docked for new flow
  const [bottomDrawerSize, setBottomDrawerSize] = useState(isNewFlow ? 0 : 1);
  const [tabValue, setTabValue] = useState(0);
  //
  // #region Selectors
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const newFlowId = useSelector(state =>
    selectors.createdResourceId(state, flowId)
  );
  const { confirmDialog } = useConfirmDialog();
  const flow = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'flows',
    flowId
  ).merged;
  const { pageProcessors = [], pageGenerators = [] } = flow;
  const flowDetails = useSelector(
    state => selectors.flowDetails(state, flowId),
    shallowEqual
  );
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isUserInErrMgtTwoDotZero(state)
  );
  const {
    status: openFlowErrorsStatus,
    data: flowErrorsMap,
    total: totalErrors = 0,
  } = useSelector(state => selectors.errorMap(state, flowId));
  // There are 2 conditions to identify this flow as a Data loader.
  // if it is an existing flow, then we can use the existence of a simple export,
  // else for staged flows, we can test to see if the pending export
  // has an application type matching data loader.
  const isDataLoaderFlow =
    flowDetails.isSimpleImport ||
    (pageGenerators.length && pageGenerators[0].application === 'dataLoader');
  const showAddPageProcessor =
    !isDataLoaderFlow ||
    (pageProcessors.length === 0 &&
      pageGenerators.length &&
      pageGenerators[0]._exportId);
  const isIAType = isIntegrationApp(flow);
  const isFreeFlow = isFreeFlowResource(flow);
  const isMonitorLevelAccess = useSelector(state =>
    selectors.isFormAMonitorLevelAccess(state, integrationId)
  );
  const isViewMode = isMonitorLevelAccess || isIAType;
  // #endregion
  const patchFlow = useCallback(
    (path, value) => {
      const patchSet = [{ op: 'replace', path, value }];

      dispatch(actions.resource.patchStaged(flowId, patchSet, 'value'));
      dispatch(actions.resource.commitStaged('flows', flowId, 'value'));

      if (!isNewFlow) {
        dispatch(actions.flowData.updateFlow(flowId));
      }
    },
    [dispatch, flowId, isNewFlow]
  );
  const handleMovePP = useCallback(
    (dragIndex, hoverIndex) => {
      const dragItem = pageProcessors[dragIndex];
      const newOrder = [...pageProcessors];

      newOrder.splice(dragIndex, 1);
      newOrder.splice(hoverIndex, 0, dragItem);
      patchFlow('/pageProcessors', newOrder);
    },
    [pageProcessors, patchFlow]
  );
  const handleMovePG = useCallback(
    (dragIndex, hoverIndex) => {
      const dragItem = pageGenerators[dragIndex];
      const newOrder = [...pageGenerators];

      newOrder.splice(dragIndex, 1);
      newOrder.splice(hoverIndex, 0, dragItem);
      patchFlow('/pageGenerators', newOrder);
    },
    [pageGenerators, patchFlow]
  );
  const handleDelete = useCallback(
    type => () => index => {
      let resourceType;

      if (type === itemTypes.PAGE_PROCESSOR) {
        resourceType = 'page processor';
      } else {
        resourceType = 'page generator';
      }

      confirmDialog({
        title: 'Confirm remove',
        message: `Are you sure you want to remove this ${resourceType}?`,
        buttons: [
          {
            label: 'Remove',
            color: 'primary',
            onClick: () => {
              if (type === itemTypes.PAGE_PROCESSOR) {
                const newOrder = [...pageProcessors];

                newOrder.splice(index, 1);
                patchFlow('/pageProcessors', newOrder);
              }

              if (type === itemTypes.PAGE_GENERATOR) {
                const newOrder = [...pageGenerators];

                newOrder.splice(index, 1);
                patchFlow('/pageGenerators', newOrder);
              }
            },
          },
          {
            label: 'Cancel',
            color: 'secondary',
          },
        ],
      });
    },
    [pageGenerators, pageProcessors, patchFlow, confirmDialog]
  );
  const pushOrReplaceHistory = useCallback(
    to => {
      if (match.isExact) {
        history.push(to);
      } else {
        history.replace(to);
      }
    },
    [history, match.isExact]
  );
  const handleAddGenerator = useCallback(() => {
    const newTempGeneratorId = generateNewId();

    pushOrReplaceHistory(
      `${match.url}/add/pageGenerator/${newTempGeneratorId}`
    );
  }, [match.url, pushOrReplaceHistory]);
  const handleAddProcessor = useCallback(() => {
    const newTempProcessorId = generateNewId();

    pushOrReplaceHistory(
      `${match.url}/add/pageProcessor/${newTempProcessorId}`
    );
  }, [match.url, pushOrReplaceHistory]);
  const handleDrawerOpen = useCallback(
    path => {
      pushOrReplaceHistory(`${match.url}/${path}`);
    },
    [match.url, pushOrReplaceHistory]
  );
  const handleTitleChange = useCallback(
    title => {
      patchFlow('/name', title);
    },
    [patchFlow]
  );
  const handleErrors = useCallback(
    resourceId => () => {
      handleDrawerOpen(`errors/${resourceId}`);
    },
    [handleDrawerOpen]
  );
  const handleRunStart = useCallback(() => {
    // Highlights Run Dashboard in the bottom drawer
    setTabValue(1);

    // Raise Bottom Drawer height
    setBottomDrawerSize(2);
  }, []);
  const handleDrawerClick = useCallback(
    path => () => {
      handleDrawerOpen(path);
    },
    [handleDrawerOpen]
  );
  const handleExitClick = useCallback(() => {
    // Note that our App init must do some internal redirects since
    // a new browser tab session always has a history depth of 3!
    // if depth is more than 3, we are safe to just go back in the history queue.
    if (history.length > 3) {
      history.goBack();
    }
    // Otherwise parse the location and return the user to the integration details
    // page.
    const parts = location.pathname.split('/');
    const newPath = `${parts.slice(0, 4).join('/')}/flows`;
    history.push(newPath);
  }, [history, location]);
  // #region New Flow Creation logic
  const rewriteUrl = useCallback(
    id => {
      const parts = match.url.split('/');

      parts[parts.length - 1] = id;

      return parts.join('/');
    },
    [match.url]
  );
  // Initializes a new flow (patch, no commit)
  // and replaces the url to reflect the new temp flow id.
  const patchNewFlow = useCallback(
    (newFlowId, newName, newPG) => {
      const startDisabled = !newPG || newPG.application !== 'dataLoader';
      const patchSet = [
        { op: 'add', path: '/name', value: newName || 'New flow' },
        { op: 'add', path: '/pageGenerators', value: newPG ? [newPG] : [] },
        { op: 'add', path: '/pageProcessors', value: [] },
        { op: 'add', path: '/disabled', value: startDisabled },
      ];

      if (integrationId && integrationId !== 'none') {
        patchSet.push({
          op: 'add',
          path: '/_integrationId',
          value: integrationId,
        });
      }

      dispatch(actions.resource.patchStaged(newFlowId, patchSet, 'value'));
    },
    [dispatch, integrationId]
  );

  useEffect(() => {
    if (!openFlowErrorsStatus && !isNewFlow && isUserInErrMgtTwoDotZero) {
      dispatch(actions.errorManager.openFlowErrors.request({ flowId }));
    }
  }, [
    dispatch,
    flowId,
    isNewFlow,
    isUserInErrMgtTwoDotZero,
    openFlowErrorsStatus,
  ]);
  useEffect(() => {
    // NEW DATA LOADER REDIRECTION
    if (isNewId(flowId)) {
      if (match.url.toLowerCase().includes('dataloader')) {
        patchNewFlow(flowId, 'New data loader flow', {
          application: 'dataLoader',
        });
      } else {
        patchNewFlow(flowId);
      }
    }

    return () => {
      dispatch(actions.resource.clearStaged(flowId, 'values'));
    };
  }, [dispatch, flowId, match.url, patchNewFlow]);

  // NEW FLOW REDIRECTION
  if (flowId === 'new') {
    const tempId = generateNewId();

    history.replace(rewriteUrl(tempId));

    return null;
  }

  // Replaces the url once the virtual flow resource is
  // persisted and we have the final flow id.
  if (newFlowId) {
    history.replace(rewriteUrl(newFlowId));

    return null;
  }
  // #endregion

  return (
    <LoadResources required resources="imports, exports, flows">
      <ResourceDrawer
        flowId={flowId}
        integrationId={integrationId}
      />

      <ScheduleDrawer flowId={flowId} />
      <ChartsDrawer flowId={flowId} />
      <SettingsDrawer
        integrationId={integrationId}
        resourceType="flows"
        resourceId={flowId}
        flow={flow}
      />
      <ConnectionsDrawer flowId={flowId} integrationId={integrationId} />
      <AuditLogDrawer flowId={flowId} integrationId={integrationId} />
      <QueuedJobsDrawer />

      <ErrorDetailsDrawer flowId={flowId} />

      <CeligoPageBar
        title={
          <EditableText
            disabled={isViewMode}
            text={flow.name}
            // multiline
            defaultText={isNewFlow ? 'New flow' : `Unnamed (id:${flowId})`}
            onChange={handleTitleChange}
            inputClassName={
              drawerOpened
                ? classes.editableTextInputShift
                : classes.editableTextInput
            }
          />
        }
        subtitle={
          <>
            Last saved:{' '}
            {isNewFlow ? (
              'Never'
            ) : (
              <CeligoTimeAgo date={flow.lastModified} />
            )}
          </>
        }
        infoText={flow.description}>
        {totalErrors ? (
          <span className={classes.errorStatus}>
            <StatusCircle variant="error" size="small" />
            {totalErrors} errors
          </span>
        ) : null}
        <div className={classes.actions}>
          {!isProduction() && isUserInErrMgtTwoDotZero && flowDetails && flowDetails.lastExecutedAt && (
            <IconButton
              disabled={isNewFlow}
              data-test="charts"
              onClick={handleDrawerClick('charts')}>
              <HelpIcon />
            </IconButton>
          )}
          {!isDataLoaderFlow && (
            <FlowToggle
              integrationId={integrationId}
              resource={flowDetails}
              disabled={isNewFlow || isMonitorLevelAccess}
              isConnector={isIAType}
              data-test="switchFlowOnOff"
            />
          )}

          <RunFlowButton flowId={flowId} onRunStart={handleRunStart} />
          {flowDetails && flowDetails.showScheduleIcon && (
            <IconButtonWithTooltip
              tooltipProps={{
                title: 'Schedule',
                placement: 'bottom',
              }}
              disabled={isNewFlow}
              data-test="scheduleFlow"
              onClick={handleDrawerClick('schedule')}>
              <CalendarIcon />
            </IconButtonWithTooltip>
          )}
          <IconButtonWithTooltip
            tooltipProps={{
              title: 'Settings',
              placement: 'bottom',
            }}
            disabled={isNewFlow}
            onClick={handleDrawerClick('settings')}
            data-test="flowSettings">
            <SettingsIcon />
          </IconButtonWithTooltip>

          {!isIAType && (
            <FlowEllipsisMenu
              flowId={flowId}
              exclude={['mapping', 'detach', 'audit', 'schedule']}
            />
          )}
          {isUserInErrMgtTwoDotZero && (
            <>
              <div className={classes.divider} />
              <IconButton
                disabled={isNewFlow}
                onClick={handleDrawerClick('connections')}
                data-test="flowConnections">
                <ConnectionsIcon />
              </IconButton>
              <IconButton
                disabled={isNewFlow}
                onClick={handleDrawerClick('auditlog')}
                data-test="flowAuditLog">
                <AuditLogIcon />
              </IconButton>
            </>
          )}

          <div className={classes.divider} />
          <IconButton onClick={handleExitClick} size="small">
            <CloseIcon />
          </IconButton>
        </div>
      </CeligoPageBar>
      <div
        className={clsx(classes.canvasContainer, {
          [classes.canvasShift]: drawerOpened,
        })}
        style={{
          height: `calc(${(4 - bottomDrawerSize) *
            25}vh - ${theme.appBarHeight +
            theme.pageBarHeight +
            (bottomDrawerSize ? 0 : bottomDrawerMin)}px)`,
        }}>
        <div className={classes.canvas}>
          {/* CANVAS START */}
          <div
            className={classes.generatorRoot}
            style={{
              minHeight: 240 * pageGenerators.length + 70,
            }}>
            <Typography
              component="div"
              className={clsx(classes.title, classes.sourceTitle)}
              variant="overline">
              {isDataLoaderFlow ? 'SOURCE' : 'SOURCE APPLICATIONS'}
              {!isDataLoaderFlow && !isFreeFlow && (
                <IconButton
                  data-test="addGenerator"
                  disabled={isViewMode}
                  onClick={handleAddGenerator}>
                  <AddIcon />
                </IconButton>
              )}
            </Typography>

            <div className={classes.generatorContainer}>
              {pageGenerators.map((pg, i) => (
                <PageGenerator
                  {...pg}
                  onDelete={handleDelete(itemTypes.PAGE_GENERATOR)}
                  onErrors={handleErrors(pg._exportId)}
                  flowId={flowId}
                  integrationId={integrationId}
                  openErrorCount={
                    (flowErrorsMap && flowErrorsMap[pg._exportId]) || 0
                  }
                  key={
                    pg._exportId ||
                    pg._connectionId ||
                    `${pg.application}${pg.webhookOnly}`
                  }
                  index={i}
                  isViewMode={isViewMode || isFreeFlow}
                  isLast={pageGenerators.length === i + 1}
                  onMove={handleMovePG}
                />
              ))}
              {!pageGenerators.length && (
                <AppBlock
                  integrationId={integrationId}
                  className={classes.newPG}
                  isViewMode={isViewMode || isFreeFlow}
                  onBlockClick={handleAddGenerator}
                  blockType="newPG"
                />
              )}
            </div>
          </div>
          <div className={classes.processorRoot}>
            <Typography
              component="div"
              className={clsx(classes.title, classes.destinationTitle)}
              variant="overline">
              {isDataLoaderFlow
                ? 'DESTINATION APPLICATION'
                : 'DESTINATION & LOOKUP APPLICATIONS'}

              {showAddPageProcessor && !isFreeFlow && (
                <IconButton
                  disabled={isViewMode}
                  data-test="addProcessor"
                  onClick={handleAddProcessor}>
                  <AddIcon />
                </IconButton>
              )}
            </Typography>
            <div className={classes.processorContainer}>
              {pageProcessors.map((pp, i) => (
                <PageProcessor
                  {...pp}
                  onDelete={handleDelete(itemTypes.PAGE_PROCESSOR)}
                  onErrors={handleErrors(pp._importId || pp._exportId)}
                  flowId={flowId}
                  integrationId={integrationId}
                  openErrorCount={
                    (flowErrorsMap &&
                      flowErrorsMap[pp._importId || pp._exportId]) ||
                    0
                  }
                  key={
                    pp._importId ||
                    pp._exportId ||
                    pp._connectionId ||
                    `${pp.application}-${i}`
                  }
                  index={i}
                  isViewMode={isViewMode || isFreeFlow}
                  isMonitorLevelAccess={isMonitorLevelAccess}
                  isLast={pageProcessors.length === i + 1}
                  onMove={handleMovePP}
                />
              ))}
              {!pageProcessors.length && showAddPageProcessor && (
                <AppBlock
                  className={classes.newPP}
                  integrationId={integrationId}
                  isViewMode={isViewMode || isFreeFlow}
                  onBlockClick={handleAddProcessor}
                  blockType={isDataLoaderFlow ? 'newImport' : 'newPP'}
                />
              )}
              {!showAddPageProcessor &&
                isDataLoaderFlow &&
                pageProcessors.length === 0 && (
                  <Typography variant="h5" className={classes.dataLoaderHelp}>
                    You can add a destination application once you complete the
                    configuration of your data loader.
                  </Typography>
              )}
            </div>
          </div>
        </div>
        {bottomDrawerSize < 3 && (
          <div
            className={classes.fabContainer}
            style={{
              bottom: bottomDrawerSize
                ? `calc(${bottomDrawerSize * 25}vh + ${theme.spacing(3)}px)`
                : bottomDrawerMin + theme.spacing(3),
            }}
          />
        )}

        {/* CANVAS END */}
      </div>
      <BottomDrawer
        flow={flow}
        size={bottomDrawerSize}
        setSize={setBottomDrawerSize}
        tabValue={tabValue}
        setTabValue={setTabValue}
      />
    </LoadResources>
  );
}

export default withRouter(FlowBuilder);
