import { useCallback } from 'react';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Panel from './Panel';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    boxShadow: `-5px 0 8px rgba(0,0,0,0.2)`,
    padding: 0,
    backgroundColor: theme.palette.background.default,
    zIndex: theme.zIndex.drawer + 1,
  },
  panelContainer: {
    display: 'flex',
  },
}));

function ResourceDrawer(props) {
  const classes = useStyles();
  const match = useRouteMatch();
  const open = !!match;
  const history = useHistory();
  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);

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
        {open && (
          <Panel {...props} match={match} zIndex={1} onClose={handleClose} />
        )}
      </div>
    </Drawer>
  );
}

export default function ResourceDrawerRoute({
  flowId,
  integrationId,
  disabled,
}) {
  const match = useRouteMatch();

  return (
    <Route
      path={`${match.url}/:operation(add|edit)/:resourceType/:id`}
      // Note that we disable the eslint warning since Route
      // uses "children" as a prop and this is the intended
      // use (per their docs)
      // eslint-disable-next-line react/no-children-prop
      children={props => (
        <ResourceDrawer
          {...props}
          flowId={flowId}
          integrationId={integrationId}
          disabled={disabled}
        />
      )}
    />
  );
}
