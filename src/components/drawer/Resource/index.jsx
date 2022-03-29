import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import RightDrawer from '../Right';
import Panel, { redirectURlToParentListing } from './Panel';
import { selectors } from '../../../reducers';
import { DRAWER_URLS } from '../../../utils/drawerURLs';

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
      <Panel
        {...props}
        occupyFullWidth={isPreviewPanelAvailableForResource}
        zIndex={1}
        onClose={handleClose}
            />
      {isAsyncHelper
        ? <ResourceDrawer integrationId={integrationId} />
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
      path={DRAWER_URLS.RESOURCE}
      height="tall"
      flowId={flowId}>
      <ResourceDrawerContent flowId={flowId} integrationId={integrationId} />
    </RightDrawer>
  );
}

