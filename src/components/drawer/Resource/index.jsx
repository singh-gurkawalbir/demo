import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import RightDrawer from '../Right';
import Panel, { redirectURlToParentListing } from './Panel';
import { selectors } from '../../../reducers';

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

function ResourceDrawerContent(props) {
  const { flowId, integrationId } = props;
  const classes = useStyles();
  const match = useRouteMatch();
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

  return (
    <>
      <div className={classes.panelContainer}>
        <Panel
          {...props}
          occupyFullWidth={isPreviewPanelAvailableForResource}
          zIndex={1}
          onClose={handleClose}
            />
      </div>
      {isAsyncHelper
        ? <ResourceDrawer />
        : (
          <ResourceDrawer flowId={flowId} integrationId={integrationId} />
        )}
    </>
  );
}

export default function ResourceDrawer({
  flowId,
  integrationId,
}) {
  const { id, resourceType } = useParams();
  const isPreviewPanelAvailableForResource = useSelector(state =>
    // Returns a bool whether the resource has a preview panel or not
    selectors.isPreviewPanelAvailableForResource(
      state,
      id,
      resourceType,
      flowId
    )
  );

  return (
    <RightDrawer
      path=":operation(add|edit)/:resourceType/:id"
      variant="temporary"
      width={isPreviewPanelAvailableForResource ? 'full' : undefined}
      height="tall">
      <ResourceDrawerContent flowId={flowId} integrationId={integrationId} />
    </RightDrawer>
  );
}

