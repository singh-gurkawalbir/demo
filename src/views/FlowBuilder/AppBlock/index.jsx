import React, {
  Fragment,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import ErrorStatus from '../ErrorStatus';
import CeligoTruncate from '../../../components/CeligoTruncate';
import actions from '../../../actions';
import {getHttpConnector} from '../../../constants/applications';

const blockHeight = 170;
const blockWidth = 275;
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: blockWidth,
  },
  box: {
    width: blockWidth,
    height: blockHeight,
    position: 'relative',
    zIndex: theme.zIndex.bubble,
  },
  // draggable: { cursor: 'move' },
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
    // display: 'none',
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
    // border: 'solid 1px',
    color: theme.palette.primary.main,
  },
  bubbleContainer: {
    position: 'relative',
    display: 'flex',
    '&:hover > button': {
      display: 'block',
      color: 'unset',
    },
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
    // width: 101,
    height: 41,
  },
  appLogo: {
    position: 'relative',
    alignSelf: 'center',
    maxWidth: 101,
    maxHeight: theme.spacing(4),
  },
  addButton: {
    // padding: theme.spacing(2),
    // marginTop: -theme.spacing(1),
    // marginLeft: -theme.spacing(1),
  },
  deleteButton: {
    position: 'absolute',
    right: -theme.spacing(0.5),
    top: -theme.spacing(0.5),
    zIndex: 1,
    transition: theme.transitions.create('color'),
    color: 'rgb(0,0,0,0)',
  },
  pgContainerName: {
    background: theme.palette.common.white,
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
  const classes = useStyles();
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const isNew = blockType.startsWith('new');
  const isActive = useSelector(state => {
    const activeConn = selectors.activeConnection(state);

    if (!activeConn || !resource) return false;

    return activeConn === resource?._id || activeConn === resource?._connectionId;
  });
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

      return publishedConnector?.name;
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

  function renderActions(flowActions) {
    if (!flowActions || !flowActions.length) return null;

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
    <div className={clsx(classes.root, className)}>
      <div
        onMouseEnter={handleMouseOver(true)}
        onFocus={handleMouseOver(true)}
        onMouseLeave={handleMouseOver(false)}
        onBlur={handleMouseOver(false)}
        {...rest}
        className={clsx(classes.box, { [classes.draggable]: !isNew })}
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
          <BubbleSvg
            height={blockHeight}
            width={blockWidth}
            classes={{ bubble: clsx(classes.bubble, {[classes.bubbleActive]: isActive}),
              bubbleBG: classes.bubbleBG,
            }}
          />
        </div>
        <div className={classes.sideActionContainer}>
          <div className={classes.leftActions}>
            {renderActions(leftActions)}
          </div>
        </div>
        <div className={classes.sideActionContainer}>
          <div className={classes.rightActions}>
            {renderActions(rightActions)}
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
                className={classes.addButton}
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
