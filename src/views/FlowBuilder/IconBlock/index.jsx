import React, {
  Fragment,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useDrag } from 'react-dnd';
import { IconButton } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import ArrowPopper from '../../../components/ArrowPopper';
import { selectors } from '../../../reducers';
import ActionIconButton from '../ActionIconButton';
import ApplicationImg from '../../../components/icons/ApplicationImg';
import IconViewResourceButton from '../IconViewResourceButton';
import EmptyResourceButton from '../EmptyResourceButton';
import CloseIcon from '../../../components/icons/CloseIcon';
import BranchIcon from '../../../components/icons/BranchIcon';
import actions from '../../../actions';
import {getHttpConnector} from '../../../constants/applications';
import itemTypes from '../itemTypes';
import { useSelectorMemo } from '../../../hooks';
import { useIsDragInProgress } from '../hooks';
import { getConnectorId } from '../../../utils/assistant';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import RawHtml from '../../../components/RawHtml';
import { message } from '../../../utils/messageStore';
import { useFlowContext } from '../FlowBuilderBody/Context';
import PPDropbox from '../FlowBuilderBody/CustomEdges/PPDropbox';

const blockWidth = 50;
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
    position: 'relative',
    zIndex: theme.zIndex.bubble,
    background: 'transparent',
    display: 'flex',
    alignItems: 'flex-end',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  isNotOverActions: {
    width: 0,
    height: 0,
    margin: 0,
    padding: 0,
    opacity: 0,
    color: theme.palette.primary.main,
    '& svg': {
      width: 0,
      height: 0,
    },
  },
  actionIsNew: {
    color: theme.palette.primary.main,
  },
  invert: {
    transform: 'scaleX(-1)',
    color: theme.palette.primary.main,
  },
  actionUsed: {
    color: theme.palette.primary.main,
    '&:before': {
      content: '""',
      height: theme.spacing(1),
      width: theme.spacing(1),
      borderRadius: '50%',
      backgroundColor: theme.palette.primary.main,
      position: 'absolute',
      top: theme.spacing(0.6),
      right: theme.spacing(0.2),
      display: 'block',
      zIndex: 1,
    },
  },
  appLogoContainer: {
    marginTop: theme.spacing(1),
    textAlign: 'center',
    fill: 'blue',
  },
  appLogo: {
    position: 'relative',
    alignSelf: 'center',
    maxWidth: theme.spacing(7),
    maxHeight: theme.spacing(4),
    pointerEvents: 'none',
  },
  deleteButton: {
    position: 'absolute',
    right: -theme.spacing(0.5),
    top: -theme.spacing(3),
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
  applicationsMenuPaperPlaceholder: {
    position: 'relative',
    maxHeight: styleProps => styleProps.pxSize * 4,
    overflowY: 'auto',
    '& .MuiButtonBase-root': {
      border: 'none',
    },
  },
  resourceIconButtons: {
    color: theme.palette.primary.main,
    '& .MuiButton-startIcon': {
      margin: 0,
    },
  },
  downStreamIconButton: {
    color: theme.palette.primary.main,
  },
}));

export default function IconBlock({
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
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeAction, setActiveAction] = useState(null);
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const {downstreamHighlighter, upstreamHighlighter} = useFlowContext();
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

    if (!connectorType || !connectorType.toUpperCase().startsWith('RDBMS')) {
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
      return selectors.rdbmsConnectionType(state, resource._connectionId);
    }

    if (resource.type && resource.type === 'rdbms' && resource.rdbms) {
      return resource.rdbms.type;
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

  const handleClick = useCallback(
    event => {
      handleExpandClick();
      setAnchorEl(!anchorEl ? event.currentTarget : null);
    },
    [anchorEl, handleExpandClick]
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  const open = !!anchorEl;
  const handleMouseOver = useCallback(
    isOver => () => {
      if (!activeAction) {
        setIsOver(isOver);
      }
    },
    [activeAction]
  );
  const handleActionClose = useCallback(() => {
    handleClose();
    setActiveAction(null);
    setExpanded();
  }, [handleClose]);
  const handleMouseHover = useCallback(val => () => {
    if (!val) {
      setAnchorEl(null);
    }
    setIsHover(val);
  }, []);

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
            [classes.actionUsed]: expanded && a.isUsed,
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
        <div className={classes.appLogoContainer}>
          {onDelete && !isViewMode && !resource._connectorId && (
          <IconButton
            size="small"
            className={classes.deleteButton}
            onClick={handleDelete(id)}
            data-test={`remove-${isPageGenerator ? 'pg' : 'pp'}`}>
            <CloseIcon />
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
          {iconType && (
            <ApplicationImg
              className={classes.appLogo}
              type={iconType}
              markOnly={!(['http', 'ftp'].includes(iconType))}
              assistant={connAssistant || assistant} />
          )}
          {!iconType && (
            <EmptyResourceButton variant={blockType} onClick={onBlockClick} />
          )}

        </div>
        <div className={classes.buttonContainer}>
          {iconType && <IconViewResourceButton onClick={!iconType ? onBlockClick : handleClick} variant={blockType} disabled={isFlowSaveInProgress} />}
          <ArrowPopper
            placement="bottom"
            open={open}
            anchorEl={anchorEl}
            restrictToParent={false}
            classes={{paper: classes.applicationsMenuPaperPlaceholder}}
            id="bubbleActions"
            onClose={handleClose} >
            <div>
              {renderActions(leftActions, isDragInProgress)}
              {renderActions(rightActions, isDragInProgress)}
              {renderActions(middleActions)}
              <IconViewResourceButton
                title={`Open ${blockType}`} showTooltip onClick={onBlockClick} variant={blockType}
                disabled={isFlowSaveInProgress}
                className={classes.resourceIconButtons} />
              <ActionIconButton
                onClick={() => downstreamHighlighter(id)}
                data-test="flowBranching"
                helpText="DownStream expansion"
                className={classes.downStreamIconButton}>
                <BranchIcon />
              </ActionIconButton>
              <ActionIconButton
                onClick={() => upstreamHighlighter(id)}
                data-test="flowBranching1"
                helpText="Upstream expansion"
                className={classes.invert}>
                <BranchIcon />
              </ActionIconButton>
            </div>
          </ArrowPopper>
        </div>
      </div>
    </div>
  );
}

