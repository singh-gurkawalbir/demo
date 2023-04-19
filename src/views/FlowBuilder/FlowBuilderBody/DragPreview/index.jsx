import { useDragLayer, XYCoord } from 'react-dnd';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import clsx from 'clsx';
import Background from './Background';
import ApplicationImg from '../../../../components/icons/ApplicationImg';
import ImportsIcon from '../../../../components/icons/ImportsIcon';
import CeligoTruncate from '../../../../components/CeligoTruncate';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: 150,
  },
  dragLayer: {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100,
    left: 0,
    top: 0,
  },
  box: {
    width: 150,
    height: 94,
    position: 'relative',
    zIndex: theme.zIndex.bubble,
  },
  appLogoContainer: {
    position: 'absolute',
    width: '110px',
    height: '30px',
    background: theme.palette.secondary.lightest,
    zIndex: theme.zIndex.bubbleName,
    top: 10,
    left: 20,
    display: 'flex',
    justifyContent: 'center',
  },
  containerName: {
    display: 'flex',
    justifyContent: 'center',
    width: '110px',
    height: '36px',
    fontSize: 14,
    lineHeight: '17px',
    wordBreak: 'break-word',
    color: theme.palette.secondary.main,
  },
  bubbleContainer: {
    backgroundSize: '20px 30px',
    position: 'relative',
    display: 'flex',
    '&:hover > button': {
      display: 'block',
      color: 'unset',
    },
  },
  name: {
    background: theme.palette.secondary.lightest,
    position: 'absolute',
    zIndex: theme.zIndex.bubbleName,
    top: '50px',
    left: 20,
  },
}));

function getDragLayerStyles(
  initialOffset = XYCoord,
  clientOffset = XYCoord
) {
  if (!initialOffset || !clientOffset) {
    return {
      display: 'none',
    };
  }

  const { x, y } = clientOffset;

  const transform = `translate(${x}px, ${y}px)`;

  return {
    transform,
    WebkitTransform: transform,
  };
}
export default function CustomDragLayer() {
  const classes = useStyles();
  const {
    item,
    isDragging,
    initialOffset,
    clientOffset,
  } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || item.noDrag) {
    return null;
  }

  return (
    <div className={classes.dragLayer}>
      <div style={getDragLayerStyles(initialOffset, clientOffset)}>
        <div className={classes.root}>
          <div
            className={clsx(classes.box, { [classes.draggable]: true })}
            >
            <div className={classes.bubbleContainer}>
              <Background />
              <div className={classes.appLogoContainer}>

                {item.type ? (
                  <ApplicationImg
                    className={classes.appLogo}
                    type={item.type}
                    assistant={item.assistant}
                  />
                ) : <ImportsIcon />}

              </div>
              <div className={classes.name}>
                <Typography className={classes.containerName}>
                  <CeligoTruncate isLoggable lines={2}>{item.name || 'Add destination / lookup'}</CeligoTruncate>
                </Typography>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
