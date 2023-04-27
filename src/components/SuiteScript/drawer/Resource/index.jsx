import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import Drawer from '@mui/material/Drawer';
import Panel from './Panel';
import { selectors } from '../../../../reducers';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    boxShadow: '-5px 0 8px rgba(0,0,0,0.2)',
    padding: 0,
    zIndex: theme.zIndex.drawer + 1,
  },
  panelContainer: {
    display: 'flex',
  },
  fullWidthDrawerClose: {
    width: 'calc(100% - 60px)',
  },
  fullWidthDrawerOpen: {
    width: `calc(100% - ${theme.drawerWidth}px)`,
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
  const isPreviewPanelAvailableForResource = useSelector(state => {
    const { id, resourceType } = (props.match && props.match.params) || {};

    // Returns a bool whether the resource has a preview panel or not
    return selectors.isPreviewPanelAvailableForResource(
      state,
      id,
      resourceType,
      props.flowId
    );
  });
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      elevation={3}
      open={open}
      classes={{
        paper: clsx(classes.drawerPaper, {
          [classes.fullWidthDrawerClose]:
            !drawerOpened && isPreviewPanelAvailableForResource,
          [classes.fullWidthDrawerOpen]:
            drawerOpened && isPreviewPanelAvailableForResource,
        }),
      }}
      onClose={handleClose}>
      <div className={classes.panelContainer}>
        {open && (
          <Panel
            {...props}
            occupyFullWidth={isPreviewPanelAvailableForResource}
            match={match}
            zIndex={1}
            onClose={handleClose}
          />
        )}
      </div>
    </Drawer>
  );
}

export default function ResourceDrawerRoute() {
  const match = useRouteMatch();
  const {
    ssLinkedConnectionId,
    integrationId,
    flowId,
  } = match.params;

  return (
    <Route
      path={`${match.url}/:operation(edit)/:resourceType/:id`}
      // Note that we disable the eslint warning since Route
      // uses "children" as a prop and this is the intended
      // use (per their docs)
      // eslint-disable-next-line react/no-children-prop
      children={props => (
        <ResourceDrawer
          {...props}
          flowId={flowId}
          integrationId={integrationId}
          ssLinkedConnectionId={ssLinkedConnectionId}
          />
      )}
    />
  );
}
