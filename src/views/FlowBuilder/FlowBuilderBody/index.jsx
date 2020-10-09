import { IconButton, makeStyles, Typography, useTheme } from '@material-ui/core';
import clsx from 'clsx';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  useHandleAddGenerator, useHandleAddProcessor,
  useIsDataLoaderFlow, useIsFreeFlowResource,
  useIsViewMode, useShowAddPageProcessor,
} from '../hooks';
import AddIcon from '../../../components/icons/AddIcon';
import { selectors } from '../../../reducers';
import useBottomDrawer from '../drawers/BottomDrawer/useBottomDrawer';
import PageBar from './PageBar';
import PageGenerators from './PageGenerators';
import PageProcessors from './PageProcessors';

const useCalcCanvasStyle = () => {
  const theme = useTheme();
  const [bottomDrawerHeight] = useBottomDrawer();

  const calcCanvasStyle = useMemo(() => ({
    height: `calc(100vh - ${bottomDrawerHeight + theme.appBarHeight + theme.pageBarHeight}px)`,
  }), [bottomDrawerHeight, theme.appBarHeight, theme.pageBarHeight]);

  return calcCanvasStyle;
};

const useStyles = makeStyles(theme => ({
  canvasContainer: {
    // border: 'solid 1px black',
    overflow: 'hidden',
    width: `calc(100vw - ${theme.drawerWidthMinimized}px)`,
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
    background: theme.palette.background.paper,
  },

  title: {
    display: 'flex',
    fontSize: 14,
    padding: theme.spacing(4, 0, 6, 0),
    alignItems: 'center',
    marginBottom: theme.spacing(0.5),
    justifyContent: 'center',
    color: theme.palette.secondary.main,
  },
  destinationTitle: {
    marginLeft: 100,
    justifyContent: 'flex-start',
  },
  generatorRoot: {
    backgroundColor: theme.palette.background.default,
    minWidth: 460,
  },
  processorRoot: {
    padding: theme.spacing(0, 3, 3, 0),
  },
  roundBtn: {
    borderRadius: '50%',
    background: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    padding: 0,
    marginLeft: theme.spacing(2),
  },
  sourceTitle: {
    marginLeft: -100,
  },
}));

function Canvas({flowId, integrationId}) {
  const classes = useStyles();
  const isDataLoaderFlow = useIsDataLoaderFlow(flowId);

  const isFreeFlow = useIsFreeFlowResource(flowId);
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));

  const isViewMode = useIsViewMode(integrationId, flowId);

  const handleAddGenerator = useHandleAddGenerator();
  const handleAddProcessor = useHandleAddProcessor();

  const showAddPageProcessor = useShowAddPageProcessor(flowId);
  const calcCanvasStyle = useCalcCanvasStyle();

  return (

    <div
      className={clsx(classes.canvasContainer, {
        [classes.canvasShift]: drawerOpened,
      })}
      style={calcCanvasStyle}>
      <div className={classes.canvas}>
        {/* CANVAS START */}
        <div
          className={classes.generatorRoot}
        >
          <Typography
            component="div"
            className={clsx(classes.title, classes.sourceTitle)}
            variant="overline">
            {isDataLoaderFlow ? 'SOURCE' : 'SOURCES'}
            {!isDataLoaderFlow && !isFreeFlow && (
            <IconButton
              data-test="addGenerator"
              disabled={isViewMode}
              className={classes.roundBtn}
              onClick={handleAddGenerator}>
              <AddIcon />
            </IconButton>
            )}
          </Typography>
          <PageGenerators
            integrationId={integrationId}
            flowId={flowId}
          />
        </div>
        <div className={classes.processorRoot}>
          <Typography
            component="div"
            className={clsx(classes.title, classes.destinationTitle)}
            variant="overline">
            {isDataLoaderFlow
              ? 'DESTINATION APPLICATION'
              : 'DESTINATIONS & LOOKUPS '}

            {showAddPageProcessor && !isFreeFlow && (
            <IconButton
              disabled={isViewMode}
              data-test="addProcessor"
              className={classes.roundBtn}
              onClick={handleAddProcessor}>
              <AddIcon />
            </IconButton>
            )}
          </Typography>
          <PageProcessors
            integrationId={integrationId}
            flowId={flowId}
          />
        </div>
      </div>
      {/* CANVAS END */}
    </div>
  );
}
export default function FlowBuilderBody(
  {
    flowId, integrationId, setTabValue,
  }
) {
  return (

    <>
      <PageBar
        flowId={flowId} integrationId={integrationId} setTabValue={setTabValue}
      />
      <Canvas
        flowId={flowId} integrationId={integrationId}
      />

    </>
  );
}
