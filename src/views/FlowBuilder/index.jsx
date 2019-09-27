import { Fragment, useState, useCallback } from 'react';
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
import BottomDrawer from './BottomDrawer';
import PageProcessor from './PageProcessor';
import PageGenerator from './PageGenerator';
import TrashCan from './TrashCan';
import itemTypes from './itemTypes';

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
  _exportId: {type: Schema.Types.ObjectId, ref: 'Export', template: true},
  _importId: {type: Schema.Types.ObjectId, ref: 'Import', template: true},
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

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
  },
  canvasContainer: {
    // border: 'solid 1px black',
    overflow: 'hidden',
    width: `calc(100vw - 57px)`,
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
    // border: 'solid 1px lightgrey',
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
    textAlign: 'center',
  },
  generatorRoot: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: theme.spacing(3, 0, 3, 3),
  },
  processorRoot: {
    padding: theme.spacing(3, 3, 3, 0),
  },
}));

function FlowBuilder(props) {
  const { match, history } = props;
  const { flowId } = match.params;
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const { merged: flow = {}, patch } = useSelector(state =>
    selectors.resourceData(state, 'flows', flowId)
  );
  const { pageProcessors = [], pageGenerators = [] } = flow;
  const [size, setSize] = useState(0);
  const patchFlow = useCallback(
    (path, value, commit = false) => {
      const patchSet = [{ op: 'replace', path, value }];

      dispatch(actions.resource.patchStaged(flowId, patchSet, 'value'));

      if (commit) {
        dispatch(actions.resource.commitStaged(flowId, 'value'));
      }
    },
    [dispatch, flowId]
  );
  const undoFlowPatch = useCallback(() => {
    dispatch(actions.resource.undoStaged(flowId, 'value'));
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

  function handleAddSource() {
    const newId = shortid.generate();
    const to = `${match.url}/add/exports/new-${newId}`;

    if (match.isExact) {
      history.push(to);
    } else {
      history.replace(to);
    }
  }

  // eslint-disable-next-line
  console.log(flow, patch);

  return (
    <Fragment>
      <ResourceDrawer {...props} />

      <CeligoPageBar
        title={flow.name}
        subtitle={`Last saved: ${flow.lastModified}`}
        infoText={flow.description}>
        <div className={classes.actions}>Actions!</div>
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
              <Typography className={classes.title} variant="h6">
                SOURCE APPLICATIONS
                <IconButton onClick={handleAddSource}>
                  <AddIcon />
                </IconButton>
              </Typography>

              <div className={classes.generatorContainer}>
                {pageGenerators.map((pg, i) => (
                  <PageGenerator
                    {...pg}
                    key={pg._exportId}
                    index={i}
                    isLast={pageProcessors.length === i + 1}
                  />
                ))}
              </div>
            </div>
            <div className={classes.processorRoot}>
              <Typography className={classes.title} variant="h6">
                DESTINATION &amp; LOOKUP APPLICATIONS
                <IconButton>
                  <AddIcon />
                </IconButton>
              </Typography>
              <div className={classes.processorContainer}>
                {pageProcessors.map((pp, i) => (
                  <PageProcessor
                    {...pp}
                    key={pp.type === 'import' ? pp._importId : pp._exportId}
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
                <Button variant="outlined" onClick={undoFlowPatch}>
                  Undo {patch.length} change(s)
                </Button>
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
