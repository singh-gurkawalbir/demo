import React, { Fragment, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import clsx from 'clsx';
import AddIcon from '../../../components/icons/AddIcon';
import ActionIconButton from '../ActionIconButton';
import ApplicationImg from '../../../components/icons/ApplicationImg';
import ResourceButton from '../ResourceButton';
import StatusCircle from '../../../components/StatusCircle';
import Status from '../../../components/Status/';

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
  actionContainer: {
    position: 'relative',
    alignSelf: 'center',
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
    width: 101,
    height: 49,
  },
  appLogo: {
    position: 'relative',
    alignSelf: 'center',
    maxWidth: 101,
    maxHeight: 49,
  },
  isNotOverActions: {
    left: 0,
    top: 0,
    position: 'absolute',
  },
  addButton: {
    padding: theme.spacing(2),
    marginTop: -theme.spacing(1),
    marginLeft: -theme.spacing(1),
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

  const middleCount = isNew
    ? 0
    : actions.filter(a => a.position === 'middle').length;
  const offset = ((3 - middleCount) * 42) / 2;
  let rightIndex = 0;
  const top = -13;

  function getActionStyle(action) {
    switch (action.position) {
      case 'left':
        return { position: 'absolute', left: -134 - offset, top };
      case 'right':
        rightIndex += 1;

        return {
          position: 'absolute',
          left: 162 - offset + (rightIndex - 1) * 42,
          top,
        };
      default:
        return undefined;
    }
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
          <svg
            height={blockHeight}
            width={blockWidth}
            className={classes.bubble}>
            <path
              d="M255.21,24.73c-13.16-15.48-30.62-24.1-49.02-24.1H58.45c-0.12,0-0.12,0-0.35,0h-0.23
    c-11.41,0-22,6.17-27.59,16.18L10.59,52.32C3.61,64.31,0,77.93,0,91.67c0,19.44,7.22,39.24,19.91,54.02
    c13.27,15.48,30.62,24.1,48.9,24.1h147.75c0.12,0,0.12,0,0.35,0h0.23c11.41,0,22-6.17,27.59-16.18l19.68-35.51
    C271.39,106.11,275,92.49,275,78.75C275,59.19,267.78,39.51,255.21,24.73z"
            />
            <path
              className={classes.bubbleBG}
              d="M263.53,117.61l-19.67,35.51c-5.4,9.67-15.63,15.67-26.72,15.67H68.81c-17.92,0-35.01-8.43-48.14-23.75
    C8.17,130.48,1,111.03,1,91.67C1,78,4.62,64.57,11.47,52.8l19.67-35.5c5.4-9.67,15.63-15.67,26.72-15.67h148.33
    c18.11,0,35.24,8.43,48.25,23.75C266.87,39.99,274,59.44,274,78.75C274,92.42,270.38,105.85,263.53,117.61z"
            />
          </svg>
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
          <div className={classes.actionContainer}>
            {actions &&
              actions.map(a => (
                <Fragment key={a.name}>
                  <ActionIconButton
                    variant={
                      a.position !== 'middle' && expanded
                        ? 'contained'
                        : undefined
                    }
                    helpText={a.helpText}
                    className={clsx({
                      [classes.isNotOverActions]: !expanded,
                    })}
                    style={expanded ? getActionStyle(a) : undefined}
                    onClick={() => setActiveAction(a.name)}
                    data-test={a.name}>
                    <a.Icon />
                  </ActionIconButton>
                  <a.Component
                    open={activeAction === a.name}
                    flowId={flowId}
                    resource={resource}
                    resourceType={resourceType}
                    onClose={() => setActiveAction(null)}
                  />
                </Fragment>
              ))}
            {!expanded && actions && actions.length > 0 && (
              <ActionIconButton
                className={classes.addButton}
                onClick={handleExpandClick}
                helpText="Add data processor">
                <AddIcon />
              </ActionIconButton>
            )}
          </div>
        </div>
        {connectorType && (
          <Status className={classes.status} count="5324" label="new errors">
            <StatusCircle variant="error" size="small" />
          </Status>
        )}
      </div>
    </div>
  );
}

// TODO: whats the best pattern to address below violation?
// eslint-disable-next-line react/display-name
export default React.forwardRef((props, ref) => (
  <AppBlock {...props} forwardedRef={ref} />
));
