import { Fragment, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
import { withRouter, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
// import { Button, Paper } from '@material-ui/core';
import CeligoPageBar from '../../components/CeligoPageBar';
// import CeligoIconButton from '../../components/IconButton';
// import * as selectors from '../../reducers';
// import actions from '../../actions';
import LoadResources from '../../components/LoadResources';
import ResourceDrawer from '../../components/drawer/Resource';
import BottomDrawer from './BottomDrawer';

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
  },
  canvasContainer: {
    width: `calc(100% - ${theme.drawer}px)`,
  },
  canvas: {
    width: '100%',
    padding: theme.spacing(1),
    display: 'flex',
  },
  generatorContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '25%',
    overflowY: 'auto',
  },
  processorContainer: {
    display: 'flex',
    width: '75%',
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
const pageGenerators = [{ name: 'g1' }, { name: 'g2' }, { name: 'g3' }];

function FlowBuilder(props) {
  const { match } = props;
  // const { resourceType } = match.params;
  const classes = useStyles();
  const [size, setSize] = useState(0);

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
          className={classes.canvasContainer}
          style={{ marginBottom: `${size * 25 || 64}` }}>
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
