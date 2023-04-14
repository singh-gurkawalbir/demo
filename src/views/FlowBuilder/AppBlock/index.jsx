import React, {
  Fragment,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, IconButton } from '@material-ui/core';
import clsx from 'clsx';
import { selectors } from '../../../reducers';
import AddIcon from '../../../components/icons/AddIcon';
import ActionIconButton from '../ActionIconButton';
import ApplicationImg from '../../../components/icons/ApplicationImg';
import ResourceButton from '../ResourceButton';
import BubbleSvg from '../BubbleSvg';
import CloseIcon from '../../../components/icons/CloseIcon';
import GripperIcon from '../../../components/icons/GripperIcon';
import ErrorStatus from '../ErrorStatus';
import CeligoTruncate from '../../../components/CeligoTruncate';
import actions from '../../../actions';
import {getHttpConnector} from '../../../constants/applications';
import PPDropbox from '../FlowBuilderBody/CustomEdges/PPDropbox';
import itemTypes from '../itemTypes';
import { useSelectorMemo } from '../../../hooks';
import { useIsDragInProgress } from '../hooks';
import { getConnectorId } from '../../../utils/assistant';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import RawHtml from '../../../components/RawHtml';
import { message } from '../../../utils/messageStore';

const blockHeight = 170;
const blockWidth = 275;
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: blockWidth,
  },
  draggable: {
    '&:hover': {
      cursor: ({ noDragInfo }) => noDragInfo ? '' : 'move',
      '& > div:last-child': {
        boxShadow: ({ noDragInfo }) => noDragInfo ? '' : '0 5px 10px rgba(0,0,0,0.19)',
      },
    },
  },
  box: {
    width: blockWidth,
    height: blockHeight,
    position: 'relative',
    zIndex: theme.zIndex.bubble,
  },
  name: {
    height: 150,
    overflow: 'hidden',
    width: '100%',
    justifyContent: 'center',
    display: 'flex',
    textAlign: 'center',
    marginTop: -85,
    background: theme.palette.background.default,
    borderRadius: [[0, 0, 20, 20]],
    position: 'relative',
    zIndex: theme.zIndex.bubbleName,
    padding: theme.spacing(2),

  },
  containerName: {
    fontSize: 15,
    lineHeight: '19px',
    wordBreak: 'break-word',
    paddingTop: 84,
    width: '100%',
    color: theme.palette.secondary.main,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  middleActionContainer: {
    position: 'relative',
    alignSelf: 'center',
  },
  sideActionContainer: {
    position: 'relative',
  },
  leftActions: {
    position: 'absolute',
    display: 'flex',
    left: -16,
    top: 68,
  },
  rightActions: {
    position: 'absolute',
    display: 'flex',
    left: 280,
    top: 68,
  },
  isNotOverActions: {
    width: 0,
    height: 0,
    margin: 0,
    padding: 0,
    opacity: 0,
    '& svg': {
      width: 0,
      height: 0,
    },
  },
  actionIsNew: {
    color: theme.palette.primary.main,
  },
  bubbleContainer: {
    position: 'relative',
    display: 'flex',
  },
  bubble: {
    position: 'absolute',
    fill: theme.palette.secondary.lightest,
    background: 'transparent',
  },
  bubbleBG: {
    fill: 'white',
  },
  bubbleActive: {
    fill: theme.palette.primary.main,
  },
  appLogoContainer: {
    marginTop: theme.spacing(2),
    textAlign: 'center',
    height: 41,
  },
  appLogo: {
    position: 'relative',
    alignSelf: 'center',
    maxWidth: 101,
    maxHeight: theme.spacing(4),
    pointerEvents: 'none',
  },
  deleteButton: {
    position: 'absolute',
    right: -theme.spacing(0.5),
    top: -theme.spacing(0.5),
    zIndex: 1,
    transition: theme.transitions.create('color'),
    color: ({ isHover }) => isHover ? 'unset' : 'rgb(0,0,0,0)',
  },
  grabButton: {
    left: -theme.spacing(0.5),
    position: 'absolute',
    top: -theme.spacing(0.5),
    zIndex: 1,
    transition: theme.transitions.create('color'),
    color: ({ isHover, noDragInfo }) => (isHover && !noDragInfo) ? 'unset' : 'rgb(0,0,0,0)',
    cursor: 'move',
    '&:hover': {
      background: 'none',
    },
  },
  dropbox: {
    top: '77px',
    display: 'flex',
    position: 'absolute',
  },
  left: {
    left: '-80px',
  },
  right: {
    right: '-82px',
  },
  pgContainerName: {
    background: theme.palette.background.paper,
  },
}));

export default function AppBlock({
  className,
  onDelete,
  onErrors,
  children,
  onBlockClick,
  blockType,
  connectorType,
  assistant,
  name,
  actions: flowActions,
  resourceIndex,
  flowId,
  resourceType,
  resource,
  resourceId,
  integrationId,
  isViewMode,
  isMonitorLevelAccess,
  isPageGenerator,
  schedule,
  index,
  openErrorCount,
  id,
  ...rest
}) {
  const [isHover, setIsHover] = useState(false);
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const isNew = blockType.startsWith('new');
  const isActive = useSelector(state => {
    const activeConn = selectors.activeConnection(state);

    if (!activeConn || !resource) return false;

    return activeConn === resource?._id || activeConn === resource?._connectionId;
  });
  const flowOriginal =
  useSelectorMemo(selectors.makeResourceDataSelector, 'flows', flowId)
    ?.merged || {};
  const isLinearFlow = !flowOriginal.routers?.length;
  let noDragInfo = '';

  if (
    (!isPageGenerator && flowOriginal.pageProcessors?.length <= 1) ||
    (isPageGenerator && flowOriginal.pageGenerators?.length <= 1)
  ) {
    noDragInfo = 'There are no available locations this step can be moved to.';
  } else if (!isLinearFlow) {
    noDragInfo = <RawHtml html={message.FLOWS.NO_DRAG_FLOW_BRANCHING_INFO} />;
  }

  const classes = useStyles({ isHover, noDragInfo });
  const isFlowSaveInProgress = useSelector(state => selectors.isFlowSaveInProgress(state, flowId));
  const iconType = useSelector(state => {
    if (blockType === 'dataLoader') return;

    if (!connectorType ||
      !(connectorType.toUpperCase().startsWith('RDBMS') || connectorType.toUpperCase().startsWith('JDBC'))
    ) {
      if (connectorType && connectorType.toUpperCase().startsWith('HTTP') && resource?.http?.formType === 'rest') {
        return connectorType.replace(/HTTP/, 'REST');
      }

      return connectorType;
    }

    if (!resource) return;

    /**
     * resource can be an export or import or a connection based on the logic implemented
     * in PageGenerator and PageProcessor components.
     */

    if (resource._connectionId) {
      if (connectorType.toUpperCase().startsWith('JDBC')) {
        return selectors.jdbcConnectionType(state, resource._connectionId);
      }

      return selectors.rdbmsConnectionType(state, resource._connectionId);
    }

    if (resource.type && resource.type === 'rdbms' && resource.rdbms) {
      return resource.rdbms.type;
    }

    if (resource.type && resource.type === 'jdbc' && resource.jdbc) {
      return resource.jdbc.type;
    }
  });

  const isDragInProgress = useIsDragInProgress();

  const connAssistant = useSelector(state => {
    if (blockType === 'dataLoader' || !resource || !resource._connectionId) return;

    const connection = selectors.resource(
      state,
      'connections',
      resource._connectionId
    );

    if (!connection) return '';
    const {assistant, http} = connection;

    if (assistant) return assistant;
    if (http?.formType === 'graph_ql') return 'graph_ql';

    if (getHttpConnector(http?._httpConnectorId)) {
      const publishedConnector = getHttpConnector(http._httpConnectorId);

      return getConnectorId(publishedConnector?.legacyId, publishedConnector?.name);
    }
  });

  useEffect(() => {
    if (expanded && !isOver) {
      const timer = setTimeout(setExpanded, 500);

      return () => clearTimeout(timer);
    }
  }, [isOver, expanded]);

  useEffect(() => {
    dispatch(actions.resource.validate(resourceType, resourceId));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = useCallback(id => () => onDelete(id), [onDelete]);
  const handleExpandClick = useCallback(() => setExpanded(true), []);
  const handleMouseOver = useCallback(
    isOver => () => {
      if (!activeAction) {
        setIsOver(isOver);
      }
    },
    [activeAction]
  );
  const handleActionClose = useCallback(() => {
    setActiveAction(null);
    setExpanded();
  }, []);
  const handleMouseHover = useCallback(val => () => setIsHover(val), []);

  const hasActions = resourceId && flowActions && Array.isArray(flowActions) && flowActions.length;
  const { leftActions, middleActions, rightActions } = useMemo(() => {
    let leftActions = [];
    let middleActions = [];
    let rightActions = [];

    if (hasActions) {
      leftActions = flowActions.filter(a => a.position === 'left');
      middleActions = flowActions.filter(a => a.position === 'middle');
      rightActions = flowActions.filter(a => a.position === 'right');
    }

    return { leftActions, middleActions, rightActions };
  }, [flowActions, hasActions]);
  const isDraggable = !isViewMode && !isFlowSaveInProgress;
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: isPageGenerator ? itemTypes.PAGE_GENERATOR : itemTypes.PAGE_PROCESSOR,
    item: () => {
      if (noDragInfo) {
        enqueueSnackbar({
          message: noDragInfo,
          variant: 'info',
        });
      }

      return ({
        ...rest,
        index,
        id,
        type: iconType,
        name,
        assistant: connAssistant || assistant,
        noDrag: !!noDragInfo,
      });
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();

      if (dropResult) {
        // if it is a valid drop
        dispatch(actions.flow.moveStep(flowId, dropResult));
      }
    },
    canDrag: isDraggable,
  }), [id, iconType, connAssistant, assistant, isFlowSaveInProgress, index, rest.pageProcessorIndex, noDragInfo]);

  const opacity = isDragging ? 0.7 : 1;

  useEffect(() => {
    // This disables the default preview image, so that we can render our own custom drag layer.
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  function renderActions(flowActions, hide) {
    if (!flowActions || !flowActions.length || hide) return null;

    return flowActions.map(a => (
      <Fragment key={a.name}>
        <ActionIconButton
          variant={a.position !== 'middle' ? 'contained' : undefined}
          helpKey={a.helpKey}
          helpText={a.helpText}
          className={clsx({
            [classes.isNotOverActions]: !expanded && !a.isUsed,
            [classes.actionIsNew]: expanded && !a.isUsed,
          })}
          onClick={() => setActiveAction(a.name)}
          data-test={a.name}>
          <a.Icon />
        </ActionIconButton>
        <a.Component
          open={activeAction === a.name}
          flowId={flowId}
          isViewMode={isViewMode}
          isMonitorLevelAccess={isMonitorLevelAccess}
          resource={resource}
          resourceIndex={resourceIndex}
          resourceId={resource._id}
          resourceType={resourceType}
          index={index}
          routerIndex={rest.routerIndex}
          branchIndex={rest.branchIndex}
          pageProcessorIndex={rest.pageProcessorIndex}
          onClose={handleActionClose}
          schedule={schedule}
        />
      </Fragment>
    ));
  }

  return (
    <div
      ref={drag}
      className={clsx(classes.root, className, { [classes.draggable]: isDraggable })}
      style={{ opacity }}
      onMouseEnter={handleMouseHover(true)}
      onMouseLeave={handleMouseHover(false)}
      >
      <div
        onMouseEnter={handleMouseOver(true)}
        onFocus={handleMouseOver(true)}
        onMouseLeave={handleMouseOver(false)}
        onBlur={handleMouseOver(false)}
        {...rest}
        data-test={`${isPageGenerator ? 'pg' : 'pp'}-${id}`}
        className={classes.box}
      >
        <div className={classes.bubbleContainer}>
          {onDelete && !isViewMode && !resource._connectorId && (
            <IconButton
              size="small"
              className={classes.deleteButton}
              onClick={handleDelete(id)}
              data-test={`remove-${isPageGenerator ? 'pg' : 'pp'}`}>
              <CloseIcon />
            </IconButton>
          )}
          {isDraggable && (
            <IconButton
              size="small"
              className={clsx(classes.grabButton)}
              data-test={`move-${isPageGenerator ? 'pg' : 'pp'}`}>
              <GripperIcon />
            </IconButton>
          )}
          <div className={clsx(classes.dropbox, classes.left)}>
            <PPDropbox
              show={rest.showLeft}
              position="left"
              targetIndex={rest.pageProcessorIndex}
              id={id}
              path={rest.path} />
          </div>
          <BubbleSvg
            height={blockHeight}
            width={blockWidth}
            classes={{ bubble: clsx(classes.bubble, {[classes.bubbleActive]: isActive}),
              bubbleBG: classes.bubbleBG,
            }}
          />
          <div className={clsx(classes.dropbox, classes.right)}>
            <PPDropbox
              show={rest.showRight}
              position="right"
              targetIndex={rest.pageProcessorIndex}
              id={id}
              path={rest.path}
              />
          </div>
        </div>
        <div className={classes.sideActionContainer}>
          <div className={classes.leftActions}>
            {renderActions(leftActions, isDragInProgress)}
          </div>
        </div>
        <div className={classes.sideActionContainer}>
          <div className={classes.rightActions}>
            {renderActions(rightActions, isDragInProgress)}
          </div>
        </div>
        <div className={classes.appLogoContainer}>
          {iconType && (
            <ApplicationImg
              className={classes.appLogo}
              type={iconType}
              assistant={connAssistant || assistant}
            />
          )}
        </div>
        <div className={classes.buttonContainer}>
          <ResourceButton onClick={onBlockClick} variant={blockType} disabled={isFlowSaveInProgress} />
          <div className={classes.middleActionContainer}>
            {renderActions(middleActions)}
            {!expanded && hasActions ? (
              <ActionIconButton
                onClick={handleExpandClick}
                data-test="addDataProcessor"
                helpText="Define options">
                <AddIcon />
              </ActionIconButton>
            ) : null}
          </div>
        </div>
        <ErrorStatus
          count={openErrorCount}
          isNew={isNew}
          flowId={flowId}
          resourceId={resource?._id} />
      </div>
      <div className={clsx(classes.name, {[classes.pgContainerName]: isPageGenerator})}>
        <Typography className={classes.containerName}>
          <CeligoTruncate isLoggable lines={2}>{name}</CeligoTruncate>
        </Typography>
      </div>
    </div>
  );
}
