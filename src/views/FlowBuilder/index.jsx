import { useState, useCallback, useEffect } from 'react';
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
import SettingsDrawer from './drawers/Settings';
import PageProcessor from './PageProcessor';
import PageGenerator from './PageGenerator';
import AppBlock from './AppBlock';
import itemTypes from './itemTypes';
import RunFlowButton from '../../components/RunFlowButton';
import SettingsIcon from '../../components/icons/SettingsIcon';
import CalendarIcon from '../../components/icons/CalendarIcon';
import EditableText from '../../components/EditableText';
import SwitchOnOff from '../../components/OnOff';
import { generateNewId } from '../../utils/resource';
import { isConnector } from '../../utils/flows';
import FlowEllipsisMenu from '../../components/FlowEllipsisMenu';

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
  const [newGeneratorId, setNewGeneratorId] = useState(generateNewId());
  const [newProcessorId, setNewProcessorId] = useState(generateNewId());
  //
  // #region Selectors
  const newFlowId = useSelector(state =>
    selectors.createdResourceId(state, flowId)
  );
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const flow = useSelector(
    state => selectors.resourceData(state, 'flows', flowId).merged,
    shallowEqual
  );
  const flowDetails = useSelector(
    state => selectors.flowDetails(state, flowId),
    shallowEqual
  );
  // There are 2 conditions to identify this flow as a Data loader.
  // if it is an existing flow, then we can use the existence of a simple export,
  // else for staged flows, we can test to see if the pending export
  // has an application type matching data loader.
  const isDataLoaderFlow =
    flowDetails.isSimpleImport ||
    (flow &&
      flow.pageGenerators &&
      flow.pageGenerators.length &&
      flow.pageGenerators[0].application === 'dataLoader');
  const { pageProcessors = [], pageGenerators = [] } = flow;
  const createdGeneratorId = useSelector(state =>
    selectors.createdResourceId(state, newGeneratorId)
  );
  const createdProcessorId = useSelector(state =>
    selectors.createdResourceId(state, newProcessorId)
  );
  const createdProcessorResourceType = useSelector(state => {
    if (!createdProcessorId) return;

    const imp = selectors.resource(state, 'imports', createdProcessorId);

    return imp ? 'import' : 'export';
  });
  const isConnectorType = isConnector(flow);
  const isMonitorLevelAccess = useSelector(state =>
    selectors.isFormAMonitorLevelAccess(state, integrationId)
  );
  const isViewMode = isMonitorLevelAccess || isConnectorType;
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

  // #region Add Generator on creation effect
  useEffect(() => {
    if (createdGeneratorId) {
      patchFlow('/pageGenerators', [
        ...pageGenerators,
        { _exportId: createdGeneratorId },
      ]);
      // in case someone clicks + again to add another resource...
      setNewGeneratorId(generateNewId());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdGeneratorId, patchFlow]);
  // #endregion

  // #region Add Processor on creation effect
  useEffect(() => {
    if (createdProcessorId) {
      const newProcessor =
        createdProcessorResourceType === 'import'
          ? { type: 'import', _importId: createdProcessorId }
          : { type: 'export', _exportId: createdProcessorId };

      patchFlow('/pageProcessors', [...pageProcessors, newProcessor]);

      setNewProcessorId(generateNewId());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdProcessorResourceType, createdProcessorId, patchFlow]);
  // #endregion

  const pushOrReplaceHistory = to => {
    if (match.isExact) {
      history.push(to);
    } else {
      history.replace(to);
    }
  };

  function handleAddGenerator() {
    const newTempGeneratorId = generateNewId();

    setNewGeneratorId(newTempGeneratorId);
    pushOrReplaceHistory(
      `${match.url}/add/pageGenerator/${newTempGeneratorId}`
    );
  }

  function handleAddProcessor() {
    const newTempProcessorId = generateNewId();

    setNewProcessorId(newTempProcessorId);
    pushOrReplaceHistory(
      `${match.url}/add/pageProcessor/${newTempProcessorId}`
    );
  }

  function handleDrawerOpen(path) {
    pushOrReplaceHistory(`${match.url}/${path}`);
  }

  function handleTitleChange(title) {
    patchFlow('/name', title);
  }

  const handleRunStart = useCallback(() => {
    // Highlights Run Dashboard in the bottom drawer
    setTabValue(1);

    // Raise Bottom Drawer height
    setBottomDrawerSize(2);
  }, []);

  // #region New Flow Creation logic
  function rewriteUrl(id) {
    const parts = match.url.split('/');

    parts[parts.length - 1] = id;

    return parts.join('/');
  }

  // Initializes a new flow (patch, no commit)
  // and replaces the url to reflect the new temp flow id.
  function patchNewFlow(newFlowId, newName, newPG) {
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
  }

  // NEW FLOW REDIRECTION
  if (flowId === 'new') {
    const tempId = generateNewId();

    patchNewFlow(tempId);
    history.replace(rewriteUrl(tempId));

    return null;
  }

  // NEW DATA LOADER REDIRECTION
  if (flowId && flowId.toLowerCase() === 'dataloader') {
    const tempId = generateNewId();

    patchNewFlow(tempId, 'New data loader flow', { application: 'dataLoader' });

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
        isViewMode={isMonitorLevelAccess}
        isConnector={isConnectorType}
        flow={flow}
      />
      <SettingsDrawer isViewMode={isViewMode} flow={flow} />

      <CeligoPageBar
        title={
          <EditableText
            disabled={isViewMode}
            text={flow.name}
            defaultText={isNewFlow ? 'New flow' : `Unnamed (id:${flowId})`}
            onChange={handleTitleChange}
          />
        }
        subtitle={`Last saved: ${isNewFlow ? 'Never' : flow.lastModified}`}
        infoText={flow.description}>
        <div className={classes.actions}>
          {!isDataLoaderFlow && (
            <SwitchOnOff.component
              resource={flowDetails}
              disabled={isNewFlow || isMonitorLevelAccess}
              isConnector={isConnectorType}
              data-test="switchFlowOnOff"
            />
          )}

          <RunFlowButton flowId={flowId} onRunStart={handleRunStart} />

          {flowDetails && flowDetails.showScheduleIcon && (
            <IconButton
              disabled={isNewFlow}
              data-test="scheduleFlow"
              onClick={() => handleDrawerOpen('schedule')}>
              <CalendarIcon />
            </IconButton>
          )}

          <IconButton
            disabled={isNewFlow}
            onClick={() => handleDrawerOpen('settings')}
            data-test="flowSettings">
            <SettingsIcon />
          </IconButton>
          {!isConnectorType && (
            <FlowEllipsisMenu
              flowId={flowId}
              exclude={['mapping', 'detach', 'audit', 'schedule']}
            />
          )}
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
          <div className={classes.generatorRoot}>
            <Typography
              component="div"
              className={clsx(classes.title, classes.sourceTitle)}
              variant="overline">
              {isDataLoaderFlow ? 'SOURCE' : 'SOURCE APPLICATIONS'}
              {!isDataLoaderFlow && (
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
                  flowId={flowId}
                  integrationId={integrationId}
                  key={
                    pg._exportId ||
                    pg._connectionId ||
                    `${pg.application}${pg.webhookOnly}`
                  }
                  index={i}
                  isViewMode={isViewMode}
                  isLast={pageGenerators.length === i + 1}
                />
              ))}
              {!pageGenerators.length && (
                <AppBlock
                  integrationId={integrationId}
                  className={classes.newPG}
                  isViewMode={isViewMode}
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
                ? 'DESTINATION'
                : 'DESTINATION & LOOKUP APPLICATIONS'}

              {(!isDataLoaderFlow || pageProcessors.length === 0) && (
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
                  flowId={flowId}
                  integrationId={integrationId}
                  key={
                    pp._importId ||
                    pp._exportId ||
                    pp._connectionId ||
                    `${pp.application}-${i}`
                  }
                  index={i}
                  isViewMode={isViewMode}
                  isMonitorLevelAccess={isMonitorLevelAccess}
                  isLast={pageProcessors.length === i + 1}
                  onMove={handleMove}
                />
              ))}
              {!pageProcessors.length && (
                <AppBlock
                  className={classes.newPP}
                  integrationId={integrationId}
                  isViewMode={isViewMode}
                  onBlockClick={handleAddProcessor}
                  blockType="newPP"
                />
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
