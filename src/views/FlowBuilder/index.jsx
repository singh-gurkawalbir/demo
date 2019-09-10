import { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { withRouter, Route } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import CeligoPageBar from '../../components/CeligoPageBar';
import * as selectors from '../../reducers';
// import actions from '../../actions';
import LoadResources from '../../components/LoadResources';
import ResourceDrawer from '../../components/drawer/Resource';
import BottomDrawer from './BottomDrawer';

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
    // border: 'solid 1px lightgrey',
  },
  generatorContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: 250,
    overflowY: 'auto',
  },
  processorContainer: {
    display: 'flex',
    flexGrow: '1',
    overflowX: 'auto',
  },
  processorBlocks: {
    display: 'flex',
  },
  appBlock: {
    width: '20vw',
    height: '20vh',
    border: 'solid 1px lightblue',
  },
}));
const pageProcessors = [
  { name: 'p1' },
  { name: 'p2' },
  { name: 'p3' },
  { name: 'p4' },
];
const pageGenerators = [
  { name: 'g1' },
  { name: 'g2' },
  { name: 'g3' },
  { name: 'g4' },
];

function FlowBuilder(props) {
  const { match } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [size, setSize] = useState(0);
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));

  return (
    <Fragment>
      <Route
        path={`${match.url}/:operation/:resourceType/:id`}
        // TODO: This <Route> could be moved into the ResourceDrawer
        // component itself, this would prevent the need to use the children
        // prop, and also remove some boilerplate wherever we use this
        // component...
        //
        // Note that we disable the eslint warning since Route
        // uses "children" as a prop and this is the intended
        // use (per their docs)
        // eslint-disable-next-line react/no-children-prop
        children={props => <ResourceDrawer {...props} />}
      />

      <CeligoPageBar title="Flow Builder" infoText="Blah, blah, blah...">
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
            <div className={classes.generatorContainer}>
              {pageGenerators.map(g => (
                <div className={classes.appBlock} key={g.name}>
                  {g.name}
                </div>
              ))}
            </div>
            <div className={classes.processorContainer}>
              <div className={classes.processorBlocks}>
                {pageProcessors.map(p => (
                  <div className={classes.appBlock} key={p.name}>
                    {p.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </LoadResources>
      <BottomDrawer size={size} setSize={setSize} />
    </Fragment>
  );
}

export default withRouter(FlowBuilder);
