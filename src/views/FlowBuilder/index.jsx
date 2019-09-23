import { Fragment, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import CeligoPageBar from '../../components/CeligoPageBar';
import * as selectors from '../../reducers';
// import actions from '../../actions';
import LoadResources from '../../components/LoadResources';
import ResourceDrawer from '../../components/drawer/Resource';
import BottomDrawer from './BottomDrawer';
import PageProcessor from './PageProcessor';
import PageGenerator from './PageGenerator';
import TrashCan from './TrashCan';
import itemTypes from './itemTypes';

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
  },
  canvasContainer: {
    // border: 'solid 1px black',
    overflow: 'hidden',
    width: `calc(100vw - 57px)`,
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
    // border: 'solid 1px lightgrey',
  },
  generatorContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  processorContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    paddingRight: theme.spacing(3),
  },
  trash: {
    position: 'absolute',
    right: theme.spacing(3),
    transition: theme.transitions.create(['bottom', 'width', 'height'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  title: {
    textAlign: 'center',
  },
  generatorRoot: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: theme.spacing(3, 0, 3, 3),
  },
  processorRoot: {
    padding: theme.spacing(3, 3, 3, 0),
  },
}));

function FlowBuilder(props) {
  const classes = useStyles();
  const theme = useTheme();
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const [size, setSize] = useState(0);
  const [pageGenerators, setPageGenerators] = useState([
    { _id: 1, name: 'G1' },
    { _id: 2, name: 'G2' },
    { _id: 3, name: 'G3' },
    { _id: 4, name: 'G4' },
  ]);
  const [pageProcessors, setPageProcessors] = useState([
    { _id: 11, name: 'P1' },
    { _id: 22, name: 'P2' },
    { _id: 33, name: 'P3' },
    { _id: 44, name: 'P4' },
  ]);
  const handleMove = useCallback(
    (dragIndex, hoverIndex) => {
      const dragItem = pageProcessors[dragIndex];
      const newOrder = [...pageProcessors];

      newOrder.splice(dragIndex, 1);
      newOrder.splice(hoverIndex, 0, dragItem);
      setPageProcessors(newOrder);
    },
    [pageProcessors]
  );
  const handleDelete = useCallback(
    ({ index, type }) => {
      if (type === itemTypes.PAGE_PROCESSOR) {
        const newOrder = [...pageProcessors];

        newOrder.splice(index, 1);
        setPageProcessors(newOrder);
      }

      if (type === itemTypes.PAGE_GENERATOR) {
        const newOrder = [...pageGenerators];

        newOrder.splice(index, 1);
        setPageGenerators(newOrder);
      }
    },
    [pageGenerators, pageProcessors]
  );

  return (
    <Fragment>
      <ResourceDrawer {...props} />

      <CeligoPageBar
        title="Flow Builder"
        subtitle=" Last saved: 1/11/11 13:45"
        infoText="Blah, blah, blah...">
        <div className={classes.actions}>Actions!</div>
      </CeligoPageBar>
      <LoadResources required resources="flows, imports, exports">
        <div
          className={clsx(classes.canvasContainer, {
            [classes.canvasShift]: drawerOpened,
          })}
          style={{
            height: `calc(${(4 - size) * 25}vh - ${theme.appBarHeight +
              theme.pageBarHeight +
              (size ? 0 : 64)}px)`,
          }}>
          <div className={classes.canvas}>
            {/* CANVAS START */}
            <div className={classes.generatorRoot}>
              <Typography className={classes.title} variant="h6">
                SOURCE APPLICATIONS
              </Typography>

              <div className={classes.generatorContainer}>
                {pageGenerators.map((pg, i) => (
                  <PageGenerator
                    key={pg.name}
                    name={pg.name}
                    index={i}
                    isLast={pageProcessors.length === i + 1}
                  />
                ))}
              </div>
            </div>
            <div className={classes.processorRoot}>
              <Typography className={classes.title} variant="h6">
                DESTINATION &amp; LOOKUP APPLICATIONS
              </Typography>
              <div className={classes.processorContainer}>
                {pageProcessors.map((pp, i) => (
                  <PageProcessor
                    {...pp}
                    key={pp.name}
                    index={i}
                    isLast={pageProcessors.length === i + 1}
                    onMove={handleMove}
                  />
                ))}
              </div>
            </div>
          </div>
          {size < 3 && (
            <TrashCan
              onDrop={handleDelete}
              className={classes.trash}
              style={{
                bottom: size
                  ? `calc(${size * 25}vh + ${theme.spacing(3)}px)`
                  : 64 + theme.spacing(3),
              }}
            />
          )}

          {/* CANVAS END */}
        </div>
      </LoadResources>
      <BottomDrawer size={size} setSize={setSize} />
    </Fragment>
  );
}

export default withRouter(FlowBuilder);
