import { useCallback } from 'react';
import { Route, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    marginTop: theme.appBarHeight + theme.pageBarHeight,
    // minWidth: 400,
    width: 475,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: `-4px 4px 8px rgba(0,0,0,0.15)`,
    zIndex: theme.zIndex.drawer + 1,
  },
}));

export function RightDrawer({ open, match, history, children }) {
  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);
  const isOpen = open || !!match;
  const classes = useStyles();

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={isOpen}
      classes={{
        paper: classes.drawerPaper,
      }}
      onClose={handleClose}>
      {isOpen && children}
    </Drawer>
  );
}

export default function RightDrawerRoute({ path, children }) {
  const match = useRouteMatch();

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
