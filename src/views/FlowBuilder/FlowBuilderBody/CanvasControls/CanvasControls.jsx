import { Tooltip } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { Controls, ControlButton, useReactFlow } from 'reactflow';
import ToggleMapIcon from '../../../../components/icons/ToggleMapIcon';
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

export default function CanvasControls({ showMiniMap, toggleMiniMap }) {
  // eslint-disable-next-line no-unused-vars
  const classes = useStyles();
  const { zoomIn, zoomOut, fitView } = useReactFlow();

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
        <Tooltip title="Zoom to fit">
          <span>
            <FullScreenOpenIcon className={classes.icon} />
          </span>
        </Tooltip>
      </ControlButton>

      <ControlButton onClick={() => toggleMiniMap()}>
        <Tooltip title={showMiniMap ? 'Hide map' : 'Show map'}>
          <span>
            <ToggleMapIcon className={classes.icon} />
          </span>
        </Tooltip>
      </ControlButton>
    </Controls>
  );
}
