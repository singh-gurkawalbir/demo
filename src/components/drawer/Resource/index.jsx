import React from 'react';
import { Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Panel from './Panel';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    padding: 0,
    backgroundColor: theme.palette.background.default,
    zIndex: theme.zIndex.drawer + 1,
  },
  panelContainer: {
    display: 'flex',
    boxShadow: `-5px 0 8px rgba(0,0,0,0.2)`,
  },
}));

function ResourceDrawer(props) {
  const classes = useStyles();
  const { match, history } = props;
  const open = !!match;
  const handleClose = () => {
    history.goBack();
  };

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      elevation={3}
      open={open}
      classes={{
        paper: classes.drawerPaper,
      }}
      onClose={handleClose}>
      <div className={classes.panelContainer}>
        {open && <Panel {...props} zIndex={1} onClose={handleClose} />}
      </div>
    </Drawer>
  );
}

export default function ResourceDrawerRoute({ match }) {
  return (
    <Route
      path={`${match.url}/:operation/:resourceType/:id`}
      // Note that we disable the eslint warning since Route
      // uses "children" as a prop and this is the intended
      // use (per their docs)
      // eslint-disable-next-line react/no-children-prop
      children={props => <ResourceDrawer {...props} />}
    />
  );
}
