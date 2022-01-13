import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Panel, { redirectURlToParentListing } from './Panel';
import { selectors } from '../../../reducers';

const DRAWER_PATH = '/:operation(add|edit)/:resourceType/:id';

const useStyles = makeStyles(theme => ({
  resourceDrawerPaper: {
    boxShadow: '-5px 0 8px rgba(0,0,0,0.2)',
    zIndex: theme.zIndex.drawer + 1,
    marginTop: theme.appBarHeight,
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
  const { flowId, integrationId } = props;
  const classes = useStyles();
  const match = useRouteMatch();
  const open = !!match;
  const history = useHistory();
  const { id, resourceType } = (match && match.params) || {};

  // if we pass flowId/integration id to result/status export which we open
  // from asyncHelper, getting sample data preview errors. As result/status export
  // are not related to flow, not passing flowId/integrationId conditionally.
  // TODO: This code need to be revisited as there might be other cases as well where
  // flowId need not to be passed.
  const isAsyncHelper = resourceType === 'asyncHelpers';
  const handleClose = useCallback(() => {
    if (history.length > 2) {
      history.goBack();
    }
    const listingPageUrl = redirectURlToParentListing(match.url);

    history.replace(listingPageUrl);
  }, [history, match.url]);
  const isPreviewPanelAvailableForResource = useSelector(state =>
    // Returns a bool whether the resource has a preview panel or not
    selectors.isPreviewPanelAvailableForResource(
      state,
      id,
      resourceType,
      props.flowId
    )
  );
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));

  return (
    <>
      <Drawer
        variant="persistent"
        anchor="right"
        elevation={3}
        open={open}
        classes={{
          paper: clsx(classes.resourceDrawerPaper, {
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
              zIndex={1}
              onClose={handleClose}
            />
          )}
        </div>
      </Drawer>
      {open && (
      <Route
        path={`${match.url}${DRAWER_PATH}`}>
        {isAsyncHelper ? <ResourceDrawer integrationId={integrationId} /> : (
          <ResourceDrawer
            flowId={flowId}
            integrationId={integrationId}
        />
        )}
      </Route>
      )}

    </>
  );
}

export default function ResourceDrawerRoute({
  flowId,
  integrationId,
}) {
  const match = useRouteMatch();

  return (
    <Route
      path={`${match.url}/:operation(add|edit)/:resourceType/:id`}>
      <ResourceDrawer
        flowId={flowId}
        integrationId={integrationId}
          />
    </Route>
  );
}
