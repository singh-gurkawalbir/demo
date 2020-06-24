import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as selectors from '../../../../../../reducers';
import RunFlowButton from '../../../../../SuiteScript/RunFlowButton';
import getRoutePath from '../../../../../../utils/routePaths';

export default function RunCell({ ssLinkedConnectionId, flow, onRunStart }) {
  const history = useHistory();
  const integrationAppName = useSelector(state => {
    const integration = selectors.suiteScriptResource(state, {
      resourceType: 'integrations',
      id: flow._integrationId,
      ssLinkedConnectionId,
    });
    return integration && integration.urlName;
  });
  const handleOnRunStart = useCallback(() => {
    if (onRunStart) {
      onRunStart();
    } else if (integrationAppName) {
      history.push(getRoutePath(`/suitescript/${ssLinkedConnectionId}/integrationapps/${integrationAppName}/${flow._integrationId}/dashboard`));
    } else {
      history.push(getRoutePath(`/suitescript/${ssLinkedConnectionId}/integrations/${flow._integrationId}/dashboard`));
    }
  }, [onRunStart, integrationAppName, history, ssLinkedConnectionId, flow._integrationId]);

  return (
    <RunFlowButton ssLinkedConnectionId={ssLinkedConnectionId} flow={flow} onRunStart={handleOnRunStart} />
  );
}
