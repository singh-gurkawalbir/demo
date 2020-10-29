import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import RunFlowButton from '../../../../RunFlowButton';
import RemoveMargin from '../RemoveMargin';
import getRoutePath from '../../../../../utils/routePaths';

export default function RunCell({
  flowId,
  integrationId,
  isIntegrationApp,
  storeId,
  actionProps,
}) {
  const history = useHistory();
  const templateName = actionProps?.templateName;
  const appName = actionProps?.appName;
  const isUserInErrMgtTwoDotZero = actionProps?.isUserInErrMgtTwoDotZero;
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
  }, [appName, history, integrationId, isIntegrationApp, isUserInErrMgtTwoDotZero, storeId, templateName]);

  return (
    <RemoveMargin>
      <RunFlowButton flowId={flowId} onRunStart={handleOnRunStart} />
    </RemoveMargin>
  );
}
