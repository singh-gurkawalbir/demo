import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, IconButton } from '@material-ui/core';
import clsx from 'clsx';
import * as selectors from '../../../reducers';
import AddIcon from '../../../components/icons/AddIcon';
import ActionIconButton from '../ActionIconButton';
import ApplicationImg from '../../../components/icons/ApplicationImg';
import ResourceButton from '../ResourceButton';
// import StatusCircle from '../../../components/StatusCircle';
// import Status from '../../../components/Status/';
import BubbleSvg from '../BubbleSvg';
import CloseIcon from '../../../components/icons/CloseIcon';

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
  },
  draggable: { cursor: 'move' },
  name: {
    margin: theme.spacing(1, 0, 1, 0),
    height: 50,
    overflow: 'hidden',
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    display: 'flex',
    '& > h5': {
      textAlign: 'center',
    },
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
    // border: 'solid 1px blue',
    left: -16,
    top: 68,
  },
  rightActions: {
    position: 'absolute',
    display: 'flex',
    // border: 'solid 1px blue',
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
    // border: 'solid 1px lightBlue',
  },
  bubbleBG: {
    fill: 'white',
  },
  appLogoContainer: {
    marginTop: theme.spacing(1),
    textAlign: 'center',
    // width: 101,
    height: 49,
  },
  appLogo: {
    position: 'relative',
    alignSelf: 'center',
    maxWidth: 101,
    maxHeight: 49,
  },
  addButton: {
    // padding: theme.spacing(2),
    // marginTop: -theme.spacing(1),
    // marginLeft: -theme.spacing(1),
  },
  status: {
    justifyContent: 'center',
    height: 'unset',
    marginTop: theme.spacing(1),
    '& span': {
      fontSize: '12px',
    },
  },
  deleteButton: {
    position: `absolute`,
    right: -theme.spacing(0.5),
    top: -theme.spacing(0.5),
    zIndex: 1,
    transition: theme.transitions.create('color'),
    color: 'rgb(0,0,0,0)',
  },
}));

function AppBlock({
  className,
  onDelete,
  children,
  forwardedRef,
  onBlockClick,
  blockType,
  connectorType,
  assistant,
  name,
  actions,
  resourceIndex,
  opacity = 1,
  flowId,
  resourceType,
  resource,
  integrationId,
  isViewMode,
  isMonitorLevelAccess,
  isPageGenerator,
  schedule,
  index,
  ...rest
}) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const isNew = blockType.startsWith('new');
  const iconType = useSelector(state => {
    if (blockType === 'dataLoader') return;

    if (!connectorType || !connectorType.startsWith('RDBMS')) {
      return connectorType;
    }

    if (!resource || !resource._connectionId) {
      return;
    }

    const connection = selectors.resource(
      state,
      'connections',
      resource._connectionId
    );

    if (!connection || !connection.rdbms || !connection.rdbms.type) return;

    return connection.rdbms.type;
  });

  useEffect(() => {
    if (expanded && !isOver) {
      const timer = setTimeout(setExpanded, 500);

      return () => clearTimeout(timer);
    }
  }, [isOver, expanded]);

  const handleDelete = useCallback(index => () => onDelete(index), [onDelete]);
  const handleExpandClick = useCallback(() => setExpanded(true), []);
  const handleMouseOver = useCallback(
    isOver => () => {
      if (!activeAction) {
        setIsOver(isOver);
      }
    },
    [activeAction]
  );
  const handleActionClose = useCallback(() => setActiveAction(null), []);
  const hasActions = actions && Array.isArray(actions) && actions.length;
  let leftActions = [];
  let middleActions = [];
  let rightActions = [];

  if (hasActions) {
    leftActions = actions.filter(a => a.position === 'left');
    middleActions = actions.filter(a => a.position === 'middle');
    rightActions = actions.filter(a => a.position === 'right');
  }

  function renderActions(actions) {
    if (!actions || !actions.length) return null;

    return actions.map(a => (
      <Fragment key={a.name}>
        <ActionIconButton
          variant={a.position !== 'middle' ? 'contained' : undefined}
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
          onClose={handleActionClose}
          schedule={schedule}
        />
      </Fragment>
    ));
  }

  return (
    <div className={clsx(classes.root, className)}>
      <div className={classes.name}>
        <Typography variant="h5">{name}</Typography>
      </div>
      <div
        onMouseEnter={handleMouseOver(true)}
        onFocus={handleMouseOver(true)}
        onMouseLeave={handleMouseOver(false)}
        onBlur={handleMouseOver(false)}
        {...rest}
        ref={forwardedRef}
        className={clsx(classes.box, { [classes.draggable]: !isNew })}
        style={{ opacity }}>
        <div className={classes.bubbleContainer}>
          {onDelete && !isViewMode && (
            <IconButton
              size="small"
              className={classes.deleteButton}
              onClick={handleDelete(index)}
              data-test={`remove-${isPageGenerator ? 'pg' : 'pp'}`}>
              <CloseIcon />
            </IconButton>
          )}
          <BubbleSvg
            height={blockHeight}
            width={blockWidth}
            classes={{ bubble: classes.bubble, bubbleBG: classes.bubbleBG }}
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
              size="large"
              type={iconType}
              assistant={assistant}
            />
          )}
        </div>
        <div className={classes.buttonContainer}>
          <ResourceButton onClick={onBlockClick} variant={blockType} />
          <div className={classes.middleActionContainer}>
            {renderActions(middleActions)}
            {!expanded && hasActions ? (
              <ActionIconButton
                className={classes.addButton}
                onClick={handleExpandClick}
                data-test="addDataProcessor"
                helpText="Add data processor">
                <AddIcon />
              </ActionIconButton>
            ) : null}
          </div>
        </div>
        {/* connectorType && (
          <Status className={classes.status} label="5324 new errors">
            <StatusCircle variant="error" size="small" />
          </Status>
        ) */}
      </div>
    </div>
  );
}

// TODO: whats the best pattern to address below violation?
// eslint-disable-next-line react/display-name
export default React.forwardRef((props, ref) => (
  <AppBlock {...props} forwardedRef={ref} />
));
