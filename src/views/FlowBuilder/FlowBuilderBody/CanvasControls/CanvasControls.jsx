import { Tooltip, makeStyles } from '@material-ui/core';
import React from 'react';
import { Controls, ControlButton, useZoomPanHelper } from 'react-flow-renderer';
import ExitIcon from '../../../../components/icons/ExitIcon';
import AddIcon from '../../../../components/icons/AddIcon';
import SubtractIcon from '../../../../components/icons/SubtractIcon';
import FullScreenOpenIcon from '../../../../components/icons/FullScreenOpenIcon';

const useStyles = makeStyles(() => ({
  icon: {
    maxWidth: 'unset !important',
    maxHeight: 'unset !important',
    // width: 18,
    // height: 18,
  },
}));

export default function CanvasControls({ toggleMiniMap }) {
  // eslint-disable-next-line no-unused-vars
  const classes = useStyles();
  const { zoomIn, zoomOut, fitView } = useZoomPanHelper();

  return (
    <Controls showInteractive={false} showZoom={false} showFitView={false}>
      <ControlButton onClick={zoomIn}>
        <Tooltip title="Zoom in">
          <span>
            <AddIcon className={classes.icon} />
          </span>
        </Tooltip>
      </ControlButton>

      <ControlButton onClick={zoomOut}>
        <Tooltip title="Zoom out">
          <span>
            <SubtractIcon className={classes.icon} />
          </span>
        </Tooltip>
      </ControlButton>

      <ControlButton onClick={() => fitView({ padding: 0.1 })}>
        <Tooltip title="Fit to view">
          <span>
            <FullScreenOpenIcon className={classes.icon} />
          </span>
        </Tooltip>
      </ControlButton>

      <ControlButton onClick={() => toggleMiniMap()}>
        <Tooltip title="Toggle mini map">
          <span>
            <ExitIcon className={classes.icon} />
          </span>
        </Tooltip>
      </ControlButton>
    </Controls>
  );
}
