import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import RightDrawer from '../Right';
import Panel, { redirectURlToParentListing } from './Panel';
import { selectors } from '../../../reducers';

function ResourceDrawerContent(props) {
  const { flowId, integrationId } = props;
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
      {/* <div className={classes.panelContainer}> */}
      <Panel
        {...props}
        occupyFullWidth={isPreviewPanelAvailableForResource}
        zIndex={1}
        onClose={handleClose}
            />
      {/* </div> */}
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
  return (
    <RightDrawer
      path=":operation(add|edit)/:resourceType/:id"
      variant="temporary"
      height="tall"
      flowId={flowId}>
      <ResourceDrawerContent flowId={flowId} integrationId={integrationId} />
    </RightDrawer>
  );
}

