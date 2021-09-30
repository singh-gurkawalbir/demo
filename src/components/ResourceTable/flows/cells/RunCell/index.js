import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import RunFlowButton from '../../../../RunFlowButton';
import RemoveMargin from '../RemoveMargin';
import getRoutePath from '../../../../../utils/routePaths';

export default function RunCell({
  flowId,
  integrationId,
  isIntegrationApp,
  childId,
  actionProps,
}) {
  const history = useHistory();
  const { templateName, appName } = actionProps;
  const isUserInErrMgtTwoDotZero = actionProps?.isUserInErrMgtTwoDotZero;
  const handleOnRunStart = useCallback(() => {
    if (isUserInErrMgtTwoDotZero) {
      return false;
    }

    if (isIntegrationApp) {
      if (childId) {
        history.push(
          getRoutePath(`/integrationapps/${appName}/${integrationId}/child/${childId}/dashboard`)
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
  }, [appName, history, integrationId, isIntegrationApp, isUserInErrMgtTwoDotZero, childId, templateName]);

  return (
    <RemoveMargin>
      <RunFlowButton flowId={flowId} onRunStart={handleOnRunStart} />
    </RemoveMargin>
  );
}
