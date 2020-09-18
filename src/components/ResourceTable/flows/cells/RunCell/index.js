import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getTemplateUrlName } from '../../../../../utils/template';
import { getIntegrationAppUrlName } from '../../../../../utils/integrationApps';
import { selectors } from '../../../../../reducers';
import RunFlowButton from '../../../../RunFlowButton';
import RemoveMargin from '../RemoveMargin';
import getRoutePath from '../../../../../utils/routePaths';

export default function RunCell({
  flowId,
  integrationId,
  isIntegrationApp,
  storeId,
}) {
  const history = useHistory();
  // TODO: This templateName logic easily could be converted to a selector,
  // and tests applied.
  const templateName = useSelector(state => {
    const integration = selectors.resource(
      state,
      'integrations',
      integrationId
    );

    if (integration && integration._templateId) {
      const template = selectors.resource(
        state,
        'marketplacetemplates',
        integration._templateId
      );

      return getTemplateUrlName(template && template.applications);
    }

    return null;
  });
  // TODO: All this logic should be in a selector: selectors.integrationAppName(state, id)
  // This is an exact copy of what is in the <NameCell> sibling component.
  const appName = useSelector(state => {
    if (!isIntegrationApp) return;

    const integration = selectors.resource(
      state,
      'integrations',
      integrationId
    );

    if (integration && integration.name) {
      return getIntegrationAppUrlName(integration.name);
    }
  });

  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );

  const handleOnRunStart = useCallback(() => {
    if (isUserInErrMgtTwoDotZero) {
      return false;
    }

    if (isIntegrationApp) {
      if (storeId) {
        history.push(
          getRoutePath(`/integrationapps/${appName}/${integrationId}/child/${storeId}/dashboard`)
        );
      } else {
        history.push(
          getRoutePath(`/integrationapps/${appName}/${integrationId}/dashboard`)
        );
      }
    } else if (templateName) {
      history.push(
        getRoutePath(`/templates/${templateName}/${integrationId || 'none'}/dashboard`)
      );
    } else {
      history.push(getRoutePath(`/integrations/${integrationId || 'none'}/dashboard`));
    }
  }, [
    appName,
    history,
    integrationId,
    isIntegrationApp,
    storeId,
    templateName,
  ]);

  return (
    <RemoveMargin>
      <RunFlowButton flowId={flowId} onRunStart={handleOnRunStart} />
    </RemoveMargin>
  );
}
