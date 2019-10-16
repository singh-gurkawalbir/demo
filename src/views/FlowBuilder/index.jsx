import { Fragment, useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import clsx from 'clsx';
import shortid from 'shortid';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography, Button, IconButton } from '@material-ui/core';
import * as selectors from '../../reducers';
import actions from '../../actions';
import CeligoPageBar from '../../components/CeligoPageBar';
import LoadResources from '../../components/LoadResources';
import ResourceDrawer from '../../components/drawer/Resource';
import AddIcon from '../../components/icons/AddIcon';
import BottomDrawer from './drawers/BottomDrawer';
import WizardDrawer from './drawers/Wizard';
import RunDrawer from './drawers/Run';
import ScheduleDrawer from './drawers/Schedule';
import SettingsDrawer from './drawers/Settings';
import PageProcessor from './PageProcessor';
import PageGenerator from './PageGenerator';
import TrashCan from './TrashCan';
import itemTypes from './itemTypes';
import RunIcon from '../../components/icons/RunIcon';
import SettingsIcon from '../../components/icons/SettingsIcon';
import CalendarIcon from '../../components/icons/CalendarIcon';
import SwitchOnOff from '../../components/SwitchToggle';

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
    borderTop: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
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
  sourceTitle: {
    textAlign: 'center',
    marginBottom: theme.spacing(3),
  },
  destinationTitle: {
    marginLeft: 100,
    marginBottom: theme.spacing(3),
  },
  generatorRoot: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: theme.spacing(0, 0, 3, 3),
  },
  processorRoot: {
    padding: theme.spacing(0, 3, 3, 0),
  },
}));

function FlowBuilder(props) {
  const newId = () => `new-${shortid.generate()}`;
  const { match, history } = props;
  const { flowId } = match.params;
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [size, setSize] = useState(0);
  const [newGeneratorId, setNewGeneratorId] = useState(newId());
  const [newProcessorId, setNewProcessorId] = useState(newId());
  //
  // #region Selectors
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const { merged: flow = {}, patch } = useSelector(state =>
    selectors.resourceData(state, 'flows', flowId)
  );
  const { pageProcessors = [], pageGenerators = [] } = flow;
  const createdGeneratorId = useSelector(state =>
    selectors.createdResourceId(state, newGeneratorId)
  );
  const createdProcessorId = useSelector(state =>
    selectors.createdResourceId(state, newProcessorId)
  );
  // #endregion
  const patchFlow = useCallback(
    (path, value, commit = false) => {
      const patchSet = [{ op: 'replace', path, value }];

      dispatch(actions.resource.patchStaged(flowId, patchSet, 'value'));
      dispatch(actions.flowData.updateFlow(flowId));

      if (commit) {
        dispatch(actions.resource.commitStaged('flows', flowId, 'value'));
      }
    },
    [dispatch, flowId]
  );
  const undoFlowPatch = useCallback(() => {
    dispatch(actions.resource.undoStaged(flowId, 'value'));
  }, [dispatch, flowId]);
  const commitFlowPatch = useCallback(() => {
    dispatch(actions.resource.commitStaged(flowId, 'value'));
  }, [dispatch, flowId]);
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
    ({ index, type }) => {
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
      setNewGeneratorId(newId());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdGeneratorId, patchFlow]);
  // #endregion

  // #region Add Processor on creation effect
  useEffect(() => {
    if (createdProcessorId) {
      patchFlow('/pageProcessors', [
        ...pageProcessors,
        // do we need to include dummy responseMapping?
        // lets see if the API call succeeds...
        { type: 'import', _importId: createdProcessorId },
      ]);

      setNewProcessorId(newId());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdProcessorId, patchFlow]);
  // #endregion

  const pushOrReplaceHistory = to => {
    if (match.isExact) {
      history.push(to);
    } else {
      history.replace(to);
    }
  };

  function handleAddGenerator() {
    pushOrReplaceHistory(`${match.url}/add/exports/${newGeneratorId}`);
  }

  function handleAddProcessor() {
    pushOrReplaceHistory(`${match.url}/add/pageProcessor/${newProcessorId}`);
  }

  function handleDrawerOpen(path) {
    pushOrReplaceHistory(`${match.url}/${path}`);
  }

  // eslint-disable-next-line
  // console.log(flow);
  const flowData = useSelector(state =>
    selectors.getFlowDataState(state, flowId)
  );

  useEffect(() => {
    if (!flowData) dispatch(actions.flowData.init(flow));
  }, [dispatch, flow, flowData]);

  return (
    <Fragment>
      <ResourceDrawer {...props} />
      <RunDrawer {...props} flowId={flowId} />
      <ScheduleDrawer {...props} flowId={flowId} />
      <SettingsDrawer {...props} flowId={flowId} />
      <WizardDrawer {...props} flowId={flowId} />

      <CeligoPageBar
        title={flowId ? flow.name : 'New flow'}
        subtitle={`Last saved: ${flowId ? flow.lastModified : 'Never'}`}
        infoText={flow.description}>
        <div className={classes.actions}>
          <SwitchOnOff
            disabled={!flowId}
            on={!!flowId && flow.disabled === 'false'}
          />
          <IconButton
            disabled={!flowId}
            onClick={() => handleDrawerOpen('run')}>
            <RunIcon />
          </IconButton>
          <IconButton
            disabled={!flowId}
            onClick={() => handleDrawerOpen('schedule')}>
            <CalendarIcon />
          </IconButton>
          <IconButton
            disabled={!flowId}
            onClick={() => handleDrawerOpen('settings')}>
            <SettingsIcon />
          </IconButton>
        </div>
      </CeligoPageBar>
      <LoadResources required resources="flows, imports, exports">
        <div
          className={clsx(classes.canvasContainer, {
            [classes.canvasShift]: drawerOpened,
          })}
          style={{
            height: `calc(${(4 - size) * 25}vh - ${theme.appBarHeight +
              theme.pageBarHeight +
              (size ? 0 : 64)}px)`,
          }}>
          <div className={classes.canvas}>
            {/* CANVAS START */}
            <div className={classes.generatorRoot}>
              <Typography
                component="div"
                className={classes.sourceTitle}
                variant="overline">
                SOURCE APPLICATIONS
                <IconButton
                  data-test="addGenerator"
                  onClick={handleAddGenerator}>
                  <AddIcon />
                </IconButton>
              </Typography>

              <div className={classes.generatorContainer}>
                {pageGenerators.map((pg, i) => (
                  <PageGenerator
                    {...pg}
                    flowId={flowId}
                    key={
                      pg._exportId ||
                      pg._connectionId ||
                      `${pg.application}${pg.webhookOnly}`
                    }
                    index={i}
                    isLast={pageProcessors.length === i + 1}
                  />
                ))}
              </div>
            </div>
            <div className={classes.processorRoot}>
              <Typography
                component="div"
                className={classes.destinationTitle}
                variant="overline">
                DESTINATION &amp; LOOKUP APPLICATIONS
                <IconButton
                  data-test="addProcessor"
                  onClick={handleAddProcessor}>
                  <AddIcon />
                </IconButton>
              </Typography>
              <div className={classes.processorContainer}>
                {pageProcessors.map((pp, i) => (
                  <PageProcessor
                    {...pp}
                    flowId={flowId}
                    key={pp._importId || pp._exportId || pp._connectionId}
                    index={i}
                    isLast={pageProcessors.length === i + 1}
                    onMove={handleMove}
                  />
                ))}
              </div>
            </div>
          </div>
          {size < 3 && (
            <div
              className={classes.fabContainer}
              style={{
                bottom: size
                  ? `calc(${size * 25}vh + ${theme.spacing(3)}px)`
                  : 64 + theme.spacing(3),
              }}>
              {patch && patch.length > 0 && (
                <Fragment>
                  <Button
                    data-test="commitFlowPatches"
                    variant="outlined"
                    color="primary"
                    onClick={commitFlowPatch}>
                    Commit
                  </Button>
                  &nbsp;
                  <Button
                    data-test="undoFlowPatches"
                    variant="outlined"
                    onClick={undoFlowPatch}>
                    Undo {patch.length} change(s)
                  </Button>
                </Fragment>
              )}
              <TrashCan onDrop={handleDelete} />
            </div>
          )}

          {/* CANVAS END */}
        </div>
      </LoadResources>
      <BottomDrawer size={size} setSize={setSize} />
    </Fragment>
  );
}

export default withRouter(FlowBuilder);
