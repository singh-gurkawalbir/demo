import React, { Fragment, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import clsx from 'clsx';
import AddIcon from '../../../components/icons/AddIcon';
import ActionIconButton from '../ActionIconButton';
import ApplicationImg from '../../../components/icons/ApplicationImg';
import ResourceButton from '../ResourceButton';
// import StatusCircle from '../../../components/StatusCircle';
// import Status from '../../../components/Status/';
import BubbleSvg from '../BubbleSvg';

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
    border: 'solid 1px',
    borderColor: theme.palette.primary.main,
  },
  bubbleContainer: {
    position: 'relative',
    display: 'flex',
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
}));

function AppBlock({
  className,
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
  ...rest
}) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const isNew = blockType.startsWith('new');

  useEffect(() => {
    if (expanded && !isOver) {
      const timer = setTimeout(setExpanded, 500);

      return () => clearTimeout(timer);
    }
  }, [isOver, expanded]);

  function handleExpandClick() {
    setExpanded(true);
  }

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
          resource={resource}
          resourceIndex={resourceIndex}
          resourceType={resourceType}
          onClose={() => setActiveAction(null)}
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
        onMouseEnter={() => setIsOver(true)}
        onFocus={() => setIsOver(true)}
        onMouseLeave={() => setIsOver(false)}
        onBlur={() => setIsOver(false)}
        {...rest}
        ref={forwardedRef}
        className={clsx(classes.box, { [classes.draggable]: !isNew })}
        style={{ opacity }}>
        <div className={classes.bubbleContainer}>
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
          {connectorType && (
            <ApplicationImg
              className={classes.appLogo}
              size="large"
              type={connectorType}
              assistant={assistant}
            />
          )}
        </div>
        <div className={classes.buttonContainer}>
          <ResourceButton onClick={onBlockClick} variant={blockType} />
          <div className={classes.middleActionContainer}>
            {renderActions(middleActions)}
            {!expanded && hasActions && (
              <ActionIconButton
                className={classes.addButton}
                onClick={handleExpandClick}
                helpText="Add data processor">
                <AddIcon />
              </ActionIconButton>
            )}
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
