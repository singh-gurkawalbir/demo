import React, { useEffect} from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { generatePath, Redirect, useHistory, useRouteMatch } from 'react-router-dom';
import actions from '../../../../actions';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../../reducers';
import { getIntegrationAppUrlName } from '../../../../utils/integrationApps';
import getRoutePath from '../../../../utils/routePaths';
import { getTemplateUrlName } from '../../../../utils/template';

const emptyObj = {};

export default function TabRedirection({children: componentChildren}) {
  const history = useHistory();
  const match = useRouteMatch();
  const { integrationId, templateName, storeId: childId, tab} = match?.params;
  const dispatch = useDispatch();

  const {
    name,
    isIntegrationApp,
    sandbox,
    templateId,
    hasIntegration,
    supportsChild,
    installSteps,
    uninstallSteps,
    mode,
  } = useSelector(state => {
    const integration = selectors.resource(
      state,
      'integrations',
      integrationId
    );

    if (integration) {
      return {
        hasIntegration: true,
        templateId: integration._templateId,
        mode: integration.mode,
        name: integration.name,
        isIntegrationApp: !!integration._connectorId,
        description: integration.description,
        sandbox: integration.sandbox,
        installSteps: integration.installSteps,
        uninstallSteps: integration.uninstallSteps,
        supportsChild: integration.initChild?.function,
        tag: integration.tag,
      };
    }

    return emptyObj;
  }, shallowEqual);

  const childIntegration = useSelectorMemo(selectors.mkChildIntegration, integrationId);

  const integrationAppName = getIntegrationAppUrlName(name);
  const integrationChildAppName =
    childIntegration &&
    getIntegrationAppUrlName(childIntegration && childIntegration.name);

  const children = useSelectorMemo(selectors.mkIntegrationChildren, integrationId);

  const currentChildMode = useSelector(state => {
    const integration = selectors.resource(state, 'integrations', childId);

    return integration?.mode;
  });

  const defaultChild = ((children.find(s => (s.value !== integrationId && s.mode === 'settings')) || {})
    .value) || integrationId;
  const currentEnvironment = useSelector(state =>
    selectors.currentEnvironment(state)
  );
  const redirectTo = useSelector(state =>
    selectors.shouldRedirect(state, integrationId)
  );
  // Addons are currently not supported in 2.0.
  // This piece of code works when addon structure is introduced and may require minor changes.
  const {addOnStatus} = useSelector(state => {
    const addOnState = selectors.integrationAppAddOnState(state, integrationId);

    return {addOnStatus: addOnState.status,
      hasAddOns: addOnState?.addOns?.addOnMetaData?.length > 0};
  }, shallowEqual);
  const integrationAppMetadata = useSelector(state =>
    selectors.integrationAppMappingMetadata(state, integrationId)
  );
  const templateUrlName = useSelector(state => {
    if (templateId) {
      const template = selectors.resource(
        state,
        'marketplacetemplates',
        templateId
      );

      return getTemplateUrlName(template?.applications);
    }

    return null;
  });

  // If this integration does not belong to this environment, then switch the environment.
  if (hasIntegration && !!sandbox !== (currentEnvironment === 'sandbox')) {
    dispatch(
      actions.user.preferences.update({
        environment: sandbox ? 'sandbox' : 'production',
      })
    );
  }

  useEffect(() => {
    if (isIntegrationApp && !addOnStatus) {
      dispatch(
        actions.integrationApp.settings.requestAddOnLicenseMetadata(
          integrationId
        )
      );
    }
  }, [addOnStatus, isIntegrationApp, dispatch, integrationId]);

  useEffect(() => {
    if (isIntegrationApp && !integrationAppMetadata.status) {
      dispatch(
        actions.integrationApp.settings.requestMappingMetadata(integrationId)
      );
    }
  }, [dispatch, isIntegrationApp, integrationAppMetadata, integrationId]);

  useEffect(() => {
    if (redirectTo) {
      const path = generatePath(match.path, {
        integrationId,
        integrationAppName,
        childId,
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
    childId,
  ]);

  useEffect(() => {
    if (templateUrlName && !templateName) {
      history.push(
        getRoutePath(`templates/${templateUrlName}/${integrationId}/${tab || 'flows'}`)
      );
    }
  }, [history, integrationId, templateName, templateUrlName]);
  useEffect(() => {
    if (
      childIntegration?.mode === 'install'
    ) {
      history.push(
        getRoutePath(`/integrationapps/${integrationChildAppName}/${childIntegration._id}/setup`)
      );
      dispatch(
        actions.resource.clearChildIntegration()
      );
    }
  }, [dispatch, history, childIntegration, integrationChildAppName]);

  if (supportsChild && isIntegrationApp) {
    if (!childId) {
      return (
        <Redirect
          push={false}
          to={getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}/child/${defaultChild}/${tab ||
            'flows'}`)}
        />
      );
    }
  }
  if (!tab && isIntegrationApp) {
    return (
      <Redirect
        push={false}
        to={`${match.url}/flows`}
      />
    );
  }
  let redirectToPage;

  if (currentChildMode === 'uninstall') {
    redirectToPage = getRoutePath(
      `integrationapps/${integrationAppName}/${integrationId}/uninstall/${childId}`
    );
  } else if (installSteps?.length && mode === 'install') {
    redirectToPage = getRoutePath(
      `integrationapps/${integrationAppName}/${integrationId}/setup`
    );
  } else if (uninstallSteps?.length && mode === 'uninstall') {
    redirectToPage = getRoutePath(
      `integrationapps/${integrationAppName}/${integrationId}/uninstall${
        childId ? `/${childId}` : ''
      }`
    );
  }

  if (redirectToPage) {
    return <Redirect push={false} to={redirectToPage} />;
  }

  // TODO: <ResourceDrawer> Can be further optimized to take advantage
  // of the 'useRouteMatch' hook now available in react-router-dom to break
  // the need for parent components passing any props at all.
  return componentChildren;
}

