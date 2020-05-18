import { useState, useCallback, Fragment, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { withRouter, useHistory, useRouteMatch } from 'react-router-dom';
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
import EditableText from '../../components/EditableText';
import SwitchOnOff from '../../components/OnOff';
import { generateNewId, isNewId } from '../../utils/resource';
import { isIntegrationApp, isFreeFlowResource } from '../../utils/flows';
import FlowEllipsisMenu from '../../components/FlowEllipsisMenu';
import DateTimeDisplay from '../../components/DateTimeDisplay';
import StatusCircle from '../../components/StatusCircle';
import HelpIcon from '../../components/icons/HelpIcon';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import { isProduction } from '../../forms/utils';

// #region FLOW SCHEMA: FOR REFERENCE DELETE ONCE FB IS COMPLETE
/* 
  var FlowSchema = new Schema({
 _userId: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
  schedule: {type: String, cLocked: false, template: true, patch: true},
  timezone: {type: String, cLocked: false, template: true, patch: true},
  name: { type: String, template: true, maxSize: 300, patch: true },
  description: {type: String, template: true, maxSize: 10 * 1024, patch: true},
  lastModified: {type: Date, default: Date.now, index: true},
  free: {type: Boolean, template: true},
  _templateId: {type: Schema.Types.ObjectId, ref: 'Template', template: true},
  externalId: {type: String},
  wizardState: {type: String, enum: ['step1', 'step2', 'step3', 'done'], lowercase: true, template: true},
  __startDateHelper: {type: Date},
  // these are the initial exports that will run at the beginning of a flow and
  // generate all the pages of data that will then flow through all of the pageProcessors
  // defined below
  pageGenerators: {
    type: [{
      application: { type: String },
      _connectionId: {type: Schema.Types.ObjectId, ref: 'Connection'},
      webhookOnly: {type: Boolean},
      _exportId: {type: Schema.Types.ObjectId, ref: 'Export'},
      _keepDeltaBehindFlowId: {type: Schema.Types.ObjectId, ref: 'Flow'},
      _keepDeltaBehindExportId: {type: Schema.Types.ObjectId, ref: 'Export'},
      schedule: {type: String, cLocked: false, patch: true},
      skipRetries: {type: Boolean, patch: true},
      __startDateHelper: {type: Date},
      _id: false
    }],
  },
  // the exports in this array are used to enhance the data, and the imports are used
  // to submit the data.
  pageProcessors: {
    type: [{
      type: {type: String, enum: ['export', 'import'], lowercase: true},
      application: { type: String },
      _connectionId: {type: Schema.Types.ObjectId, ref: 'Connection'},
      _exportId: {type: Schema.Types.ObjectId, ref: 'Export'},
      _importId: {type: Schema.Types.ObjectId, ref: 'Import'},
      proceedOnFailure: {type: Boolean},
      responseMapping: {
        fields: {
          type: [{
            extract: { type: String },
            generate: { type: String },
            _id: false
          }],
          cLocked: false
        },
        lists: {
          type: [{
            generate: { type: String },
            fields: [{
              extract: { type: String },
              generate: { type: String },
              _id: false
            }],
            _id: false
          }],
          cLocked: false
        }
      },
      hooks: {
        postResponseMap: {
          function: { type: String },
          _scriptId: {type: Schema.Types.ObjectId, ref: 'Script'},
          configuration: Schema.Types.Mixed
        }
      },
      _id: false
    }],
  },
  _runNextFlowIds: {type: [{type: Schema.Types.ObjectId, ref: 'Flow'}], template: true},
  // Once the UI changes for IO-8003 are done, _runNextExportIds will be renamed to _runNextFlowIds while existing _runNextFlowIds is removed
  _runNextExportIds: {
    type: [{
      _id: false,
      _flowId: {type: Schema.Types.ObjectId, ref: 'Flow'},
      _exportId: {type: Schema.Types.ObjectId, ref: 'Export'}
    }],
    template: true
  },
  // old schema, not needed. _exportId: {type: Schema.Types.ObjectId, ref: 'Export', template: true},
  // old schema, not needed. _importId: {type: Schema.Types.ObjectId, ref: 'Import', template: true},
  _integrationId: {type: Schema.Types.ObjectId, ref: 'Integration'},
  _connectorId: {type: Schema.Types.ObjectId, ref: 'Connector'},
  disabled: {type: Boolean, patch: true},
  skipRetries: {type: Boolean, patch: true, template: true},
  resolvedAt: {type: Date},
  sandbox: {type: Boolean},
  createdAt: {type: Date, default: Date.now}, // docs created after 17th April 2017 will have this field set
  deletedAt: {type: Date},
  _keepDeltaBehindFlowId: {type: Schema.Types.ObjectId, ref: 'Flow', template: true}, // this field is deprecated
  runPageGeneratorsInParallel: {type: Boolean, patch: true, template: true},
  settingsForm: {
    form: { type: Schema.Types.Mixed },
    init: {
      _scriptId: { type: Schema.Types.ObjectId, ref: 'Script' },
      function: { type: String }
    },
    submit: {
      _scriptId: { type: Schema.Types.ObjectId, ref: 'Script' },
      function: { type: String }
    }
  }
  })
*/
// #endregion

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
  const handleMove = useCallback(
    (dragIndex, hoverIndex) => {
      const dragItem = pageProcessors[dragIndex];
      const newOrder = [...pageProcessors];

      newOrder.splice(dragIndex, 1);
      newOrder.splice(hoverIndex, 0, dragItem);
      patchFlow('/pageProcessors', newOrder);
    },
    [pageProcessors, patchFlow]
  );
  const handleDelete = useCallback(
    type => index => {
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
    [pageGenerators, pageProcessors, patchFlow]
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

  // eslint-disable-next-line
  // console.log('render: <FlowBuilder>');

  return (
    <LoadResources required resources="imports, exports, flows">
      <ResourceDrawer
        flowId={flowId}
        disabled={isViewMode}
        integrationId={integrationId}
      />

      <ScheduleDrawer
        integrationId={integrationId}
        resourceType="flows"
        resourceId={flowId}
        flow={flow}
      />
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
          <Fragment>
            Last saved:{' '}
            {isNewFlow ? (
              'Never'
            ) : (
              <DateTimeDisplay dateTime={flow.lastModified} />
            )}
          </Fragment>
        }
        infoText={flow.description}>
        {totalErrors ? (
          <span className={classes.errorStatus}>
            <StatusCircle variant="error" size="small" />
            {totalErrors} errors
          </span>
        ) : null}
        <div className={classes.actions}>
          {!isProduction() && flowDetails && flowDetails.lastExecutedAt && (
            <IconButton
              disabled={isNewFlow}
              data-test="charts"
              onClick={handleDrawerClick('charts')}>
              <HelpIcon />
            </IconButton>
          )}
          {!isDataLoaderFlow && (
            <SwitchOnOff.component
              resource={flowDetails}
              disabled={isNewFlow || isMonitorLevelAccess}
              isConnector={isIAType}
              data-test="switchFlowOnOff"
            />
          )}

          <RunFlowButton flowId={flowId} onRunStart={handleRunStart} />

          {flowDetails && flowDetails.showScheduleIcon && (
            <IconButton
              disabled={isNewFlow}
              data-test="scheduleFlow"
              onClick={handleDrawerClick('schedule')}>
              <CalendarIcon />
            </IconButton>
          )}

          <IconButton
            disabled={isNewFlow}
            onClick={handleDrawerClick('settings')}
            data-test="flowSettings">
            <SettingsIcon />
          </IconButton>
          {!isIAType && (
            <FlowEllipsisMenu
              flowId={flowId}
              exclude={['mapping', 'detach', 'audit', 'schedule']}
            />
          )}
          {isUserInErrMgtTwoDotZero ? (
            <Fragment>
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
            </Fragment>
          ) : null}
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
                  onMove={handleMove}
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
