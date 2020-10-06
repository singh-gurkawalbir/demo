import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatePath, Redirect, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import actions from '../../../../actions';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../../reducers';
import { getIntegrationAppUrlName } from '../../../../utils/integrationApps';
import getRoutePath from '../../../../utils/routePaths';

export default function TabRedirection({children}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const match = useRouteMatch();
  const { integrationId, storeId, tab} = match.params;

  // TODO: Note this selector should return undefined/null if no
  // integration exists. not a stubbed out complex object.
  const integration = useSelectorMemo(selectors.mkIntegrationAppSettings, integrationId);

  const defaultStoreId = useSelector(state =>
    selectors.defaultStoreId(state, integrationId, storeId)
  );
  const currentStore = useSelectorMemo(selectors.mkIntegrationAppStore, integrationId, storeId);

  const redirectTo = useSelector(state =>
    selectors.shouldRedirect(state, integrationId)
  );
  const integrationAppName = getIntegrationAppUrlName(integration?.name);
  const queryParams = new URLSearchParams(location.search);
  const flowJobId = queryParams.get('_flowJobId');
  const jobFlowId = useSelector(state => {
    const job = selectors.flowJob(state, { jobId: flowJobId, includeAll: true });

    return job && job._flowId;
  }
  );
  const searchParamChildId = useSelector(state =>
    selectors.integrationAppChildIdOfFlow(state, integrationId, jobFlowId)
  );

  // TODO: This selector isn't actually returning add on state.
  // it is returning ALL integration settings state.
  const addOnStateStatus = useSelector(state =>
    selectors.integrationAppAddOnState(state, integrationId)?.status
  );
  const integrationAppMetadata = useSelector(state =>
    selectors.integrationAppMappingMetadata(state, integrationId)
  );

  useEffect(() => {
    if (!addOnStateStatus) {
      dispatch(
        actions.integrationApp.settings.requestAddOnLicenseMetadata(
          integrationId
        )
      );
    }
  }, [addOnStateStatus, dispatch, integrationId]);

  useEffect(() => {
    if (!integrationAppMetadata.status) {
      dispatch(
        actions.integrationApp.settings.requestMappingMetadata(integrationId)
      );
    }
  }, [dispatch, integrationAppMetadata, integrationId]);

  useEffect(() => {
    if (redirectTo) {
      const path = generatePath(match.path, {
        integrationId,
        integrationAppName,
        storeId,
        tab: redirectTo,
      });

      dispatch(actions.integrationApp.settings.clearRedirect(integrationId));
      history.push(path);
    }
  }, [
    dispatch,
    history,
    integrationAppName,
    integrationId,
    match.path,
    redirectTo,
    storeId,
  ]);

  const supportsMultiStore = integration?.settings?.supportsMultiStore;

  // To support breadcrumbs, and also to have a more robust url interface,
  // we want to "self-heal" partial urls hitting this page.  If an integration app
  // is routed to this component without a storeId (if it supports multi-store),
  // or if no tab is selected, we rewrite the current url in the history to carry
  // this state information forward.
  if (supportsMultiStore) {
    if (!storeId) {
      return (
        <Redirect
          push={false}
          to={
            {
              pathname: getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}/child/${searchParamChildId || defaultStoreId}/${tab ||
            'flows'}`),
              search: location.search,
            }
          }
        />
      );
    }
  }
  if (!tab) {
    return <Redirect push={false} to={`${match.url}/flows`} />;
  }

  let redirectToPage;

  if (currentStore.mode === 'install') {
    redirectToPage = getRoutePath(
      `integrationapps/${integrationAppName}/${integrationId}/install/addNewStore`
    );
  } else if (currentStore.mode === 'uninstall') {
    redirectToPage = getRoutePath(
      `integrationapps/${integrationAppName}/${integrationId}/uninstall/${storeId}`
    );
  } else if (integration.mode === 'install') {
    redirectToPage = getRoutePath(
      `integrationapps/${integrationAppName}/${integrationId}/setup`
    );
  } else if (integration.mode === 'uninstall') {
    redirectToPage = getRoutePath(
      `integrationapps/${integrationAppName}/${integrationId}/uninstall${
        storeId ? `/${storeId}` : ''
      }`
    );
  }

  if (redirectToPage) {
    return <Redirect push={false} to={redirectToPage} />;
  }
  // console.log('render: <IntegrationApp>');

  return children;
}
