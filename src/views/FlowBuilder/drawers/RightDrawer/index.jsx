import React from 'react';
import { Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    marginTop: theme.appBarHeight + theme.pageBarHeight,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    // boxShadow: `-5px 0 8px rgba(0,0,0,0.2)`,
    padding: theme.spacing(3),
    // backgroundColor: theme.palette.background.default,
    zIndex: theme.zIndex.drawer + 1,
    minWidth: 400,
  },
}));

function RightDrawer({ match, history, children }) {
  const classes = useStyles();
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
      {children}
    </Drawer>
  );
}

export default function RightDrawerRoute({ path, match, children }) {
  return (
    <Route
      path={`${match.url}/${path}`}
      // Note that we disable the eslint warning since Route
      // uses "children" as a prop and this is the intended
      // use (per their docs)
      // eslint-disable-next-line react/no-children-prop
      children={props => <RightDrawer {...props} children={children} />}
    />
  );
}
