import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, useHistory, useRouteMatch, useLocation, matchPath, generatePath } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography, IconButton } from '@material-ui/core';
import { selectors } from '../../reducers';
import actions from '../../actions';
import CeligoPageBar from '../../components/CeligoPageBar';
import LoadResources from '../../components/LoadResources';
import ResourceDrawer from '../../components/drawer/Resource';
import AddIcon from '../../components/icons/AddIcon';
import BottomDrawer from './drawers/BottomDrawer';
import useBottomDrawer from './drawers/BottomDrawer/useBottomDrawer';
import ScheduleDrawer from './drawers/Schedule';
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
import CalendarIcon from '../../components/icons/CalendarIcon';
import CloseIcon from '../../components/icons/CloseIcon';
import EditableText from '../../components/EditableText';
import FlowToggle from '../../components/FlowToggle';
import { generateNewId, isNewId } from '../../utils/resource';
import { isIntegrationApp, isFreeFlowResource } from '../../utils/flows';
import FlowEllipsisMenu from '../../components/FlowEllipsisMenu';
import StatusCircle from '../../components/StatusCircle';
import useConfirmDialog from '../../components/ConfirmDialog';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import IconButtonWithTooltip from '../../components/IconButtonWithTooltip';
import CeligoTimeAgo from '../../components/CeligoTimeAgo';
import LastRun from './LastRun';
import MappingDrawerRoute from '../MappingDrawer';
import LineGraphButton from './LineGraphButton';

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
    background: theme.palette.background.paper,
  },
  generatorContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: theme.spacing(0, 0, 3, 3),
    backgroundColor: theme.palette.background.default,
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
    fontSize: 14,
    padding: theme.spacing(4, 0, 6, 0),
    alignItems: 'center',
    marginBottom: theme.spacing(0.5),
    justifyContent: 'center',
    color: theme.palette.secondary.main,
  },
  destinationTitle: {
    marginLeft: 100,
    justifyContent: 'flex-start',
  },
  generatorRoot: {
    backgroundColor: theme.palette.background.default,
    minWidth: 460,
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
    display: 'flex',
    alignItems: 'center',
    marginRight: 12,
    fontSize: '12px',
  },
  divider: {
    width: 1,
    height: 30,
    borderLeft: `1px solid ${theme.palette.secondary.lightest}`,
    margin: 5,
  },
  roundBtn: {
    borderRadius: '50%',
    background: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    padding: 0,
    marginLeft: theme.spacing(2),
  },
  sourceTitle: {
    marginLeft: -100,
  },
  subtitle: {
    display: 'flex',
  },
  flowToggle: {
    marginRight: 12,
    marginLeft: theme.spacing(1),
    '& > div:first-child': {
      padding: '8px 0px',
    },
  },
}));

const tooltipSchedule = {
  title: 'Schedule',
  placement: 'bottom',
};
const tooltipSettings = {
  title: 'Settings',
  placement: 'bottom',
};

function FlowBuilder() {
  const match = useRouteMatch();
  const location = useLocation();
  const { flowId, integrationId } = match.params;
  const history = useHistory();
  const isNewFlow = !flowId || flowId.startsWith('new');
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [bottomDrawerHeight, setBottomDrawerHeight] = useBottomDrawer();
  const [tabValue, setTabValue] = useState(0);
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
  const flowDetails = useSelectorMemo(selectors.mkFlowDetails, flowId);
  const allowSchedule = useSelectorMemo(selectors.mkFlowAllowsScheduling, flowId);
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  const {
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
  const calcCanvasStyle = useMemo(() => ({
    height: `calc(100vh - ${bottomDrawerHeight + theme.appBarHeight + theme.pageBarHeight}px)`,
  }), [bottomDrawerHeight, theme.appBarHeight, theme.pageBarHeight]);

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
      confirmDialog({
        title: 'Confirm remove',
        message: 'Are you sure you want to remove this resource?',
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
    setTabValue(0);

    // Raise Bottom Drawer height
    setBottomDrawerHeight(500);
  }, [setBottomDrawerHeight]);
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
      return history.goBack();
    }

    // Otherwise parse the location and return the user to the integration
    // details page.
    const parts = location.pathname.split('/');

    if (parts[1].toLowerCase() === 'integrationapps') {
      // if user is editing an IA flow, the url is 1 segment longer.
      return history.push(parts.slice(0, 4).join('/'));
    }

    return history.push(parts.slice(0, 3).join('/'));
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

  const calcPageBarTitle = useMemo(() => (
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
  ), [classes.editableTextInput, classes.editableTextInputShift, drawerOpened, flow.name, flowId, handleTitleChange, isNewFlow, isViewMode]);

  const calcPageBarSubtitle = useMemo(() => (
    <div className={classes.subtitle}>
      Last saved:{' '}
      {isNewFlow ? (
        'Never'
      ) : (
        <CeligoTimeAgo date={flow.lastModified} />
      )}
      {isUserInErrMgtTwoDotZero && <LastRun />}
    </div>
  ), [classes.subtitle, flow.lastModified, isNewFlow, isUserInErrMgtTwoDotZero]);

  const pageBarChildren = useMemo(() => {
    const excludes = ['mapping', 'detach', 'audit', 'schedule'];

    return (
      <div className={classes.actions}>
        {isUserInErrMgtTwoDotZero && (
          <LineGraphButton flowId={flowId} onClickHandler={handleDrawerClick} />
        )}
        {!isDataLoaderFlow && (
        <div className={clsx(classes.chartsIcon, classes.flowToggle)}>
          <FlowToggle
            integrationId={integrationId}
            resource={flowDetails}
            disabled={isNewFlow || isMonitorLevelAccess}
            isConnector={isIAType}
            data-test="switchFlowOnOff"
        />
        </div>
        )}

        <RunFlowButton flowId={flowId} onRunStart={handleRunStart} />
        {allowSchedule && (
        <IconButtonWithTooltip
          tooltipProps={tooltipSchedule}
          disabled={isNewFlow}
          data-test="scheduleFlow"
          onClick={handleDrawerClick('schedule')}>
          <CalendarIcon />
        </IconButtonWithTooltip>
        )}
        <IconButtonWithTooltip
          tooltipProps={tooltipSettings}
          disabled={isNewFlow}
          onClick={handleDrawerClick('settings')}
          data-test="flowSettings">
          <SettingsIcon />
        </IconButtonWithTooltip>

        {!isIAType && (
        <FlowEllipsisMenu
          flowId={flowId}
          exclude={excludes}
        />
        )}
        <div className={classes.divider} />
        <IconButton onClick={handleExitClick} size="small">
          <CloseIcon />
        </IconButton>
      </div>
    );
  },
  [allowSchedule, classes.actions, classes.chartsIcon, classes.flowToggle, classes.divider, flowDetails, flowId, handleDrawerClick, handleExitClick, handleRunStart, integrationId, isDataLoaderFlow, isIAType, isMonitorLevelAccess, isNewFlow, isUserInErrMgtTwoDotZero]);

  const pageBar = useMemo(() => (
    <CeligoPageBar
      title={calcPageBarTitle}
      subtitle={calcPageBarSubtitle}
      infoText={flow.description}>
      {totalErrors ? (
        <span className={classes.errorStatus}>
          <StatusCircle variant="error" size="small" />
          <span>{totalErrors} errors</span>
        </span>
      ) : null}
      {pageBarChildren}
    </CeligoPageBar>
  ), [calcPageBarTitle, calcPageBarSubtitle, flow.description, totalErrors, classes.errorStatus, pageBarChildren]);

  const pgs = useMemo(() => (
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
  ), [classes.generatorContainer, classes.newPG, flowErrorsMap, flowId, handleAddGenerator, handleDelete, handleErrors, handleMovePG, integrationId, isFreeFlow, isViewMode, pageGenerators]);

  const pps = useMemo(() => (
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
  ), [classes.dataLoaderHelp, classes.newPP, classes.processorContainer, flowErrorsMap, flowId, handleAddProcessor, handleDelete, handleErrors, handleMovePP, integrationId, isDataLoaderFlow, isFreeFlow, isMonitorLevelAccess, isViewMode, pageProcessors, showAddPageProcessor]);

  useEffect(() => {
    if (!isUserInErrMgtTwoDotZero || isNewFlow) return;

    dispatch(actions.errorManager.openFlowErrors.requestPoll({ flowId }));

    return () => {
      dispatch(actions.errorManager.openFlowErrors.cancelPoll());
    };
  }, [
    dispatch,
    flowId,
    isNewFlow,
    isUserInErrMgtTwoDotZero,
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
    const nestedPgOrPpPath = matchPath(location.pathname, {
      path: `${match.path}/:mode/:resourceType/:resourceId`,
    });

    if (nestedPgOrPpPath && nestedPgOrPpPath.isExact) {
      // Incase of a pg or pp opened ... replace url flowId with newFlowId
      // @BugFix: IO-16074
      history.replace(generatePath(nestedPgOrPpPath.path, {
        ...nestedPgOrPpPath.params,
        flowId: newFlowId,
      }));
    } else {
      // In all other cases go back to flow url with new FlowId
      history.replace(rewriteUrl(newFlowId));
    }

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
      <QueuedJobsDrawer />

      <ErrorDetailsDrawer flowId={flowId} />
      {pageBar}
      <div
        className={clsx(classes.canvasContainer, {
          [classes.canvasShift]: drawerOpened,
        })}
        style={calcCanvasStyle}>
        <div className={classes.canvas}>
          {/* CANVAS START */}
          <div
            className={classes.generatorRoot}
            >
            <Typography
              component="div"
              className={clsx(classes.title, classes.sourceTitle)}
              variant="overline">
              {isDataLoaderFlow ? 'SOURCE' : 'SOURCES'}
              {!isDataLoaderFlow && !isFreeFlow && (
                <IconButton
                  data-test="addGenerator"
                  disabled={isViewMode}
                  className={classes.roundBtn}
                  onClick={handleAddGenerator}>
                  <AddIcon />
                </IconButton>
              )}
            </Typography>
            {pgs}
          </div>
          <div className={classes.processorRoot}>
            <Typography
              component="div"
              className={clsx(classes.title, classes.destinationTitle)}
              variant="overline">
              {isDataLoaderFlow
                ? 'DESTINATION APPLICATION'
                : 'DESTINATIONS & LOOKUPS '}

              {showAddPageProcessor && !isFreeFlow && (
                <IconButton
                  disabled={isViewMode}
                  data-test="addProcessor"
                  className={classes.roundBtn}
                  onClick={handleAddProcessor}>
                  <AddIcon />
                </IconButton>
              )}
            </Typography>
            {pps}
          </div>
        </div>
        {/* CANVAS END */}
      </div>
      <BottomDrawer
        flow={flow}
        tabValue={tabValue}
        setTabValue={setTabValue}
      />
      <MappingDrawerRoute
        integrationId={integrationId}
      />
    </LoadResources>
  );
}

export default withRouter(FlowBuilder);
