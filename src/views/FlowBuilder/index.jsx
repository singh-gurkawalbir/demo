import { Fragment } from 'react';
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
  canvas: {
    padding: theme.spacing(1),
  },
}));

function FlowBuilder(props) {
  const { match } = props;
  // const { resourceType } = match.params;
  const classes = useStyles();

  return (
    <Fragment>
      <Route
        path={`${match.url}/:operation/:resourceType/:id`}
        // TODO: possibly this route could be moved into the ResourceDrawer
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
      <div className={classes.canvas}>
        <LoadResources required resources="flows, imports, exports">
          This is the canvas area.
        </LoadResources>
      </div>
      <BottomDrawer />
    </Fragment>
  );
}

export default withRouter(FlowBuilder);
