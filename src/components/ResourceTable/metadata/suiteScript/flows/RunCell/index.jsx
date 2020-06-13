import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as selectors from '../../../../../../reducers';
import RunFlowButton from '../../../../../SuiteScript/RunFlowButton';

export default function RunCell({
  ssLinkedConnectionId, flow
}) {
  const history = useHistory();
  const integrationAppName = useSelector(state => {
    const integration = selectors.suiteScriptResource(state, {
      resourceType: 'integrations',
      id: flow._integrationId,
      ssLinkedConnectionId
    });
    return integration && integration.urlName;
  });
  const handleOnRunStart = useCallback(() => {
    if (integrationAppName) {
      history.push(
        `/pg/suitescript/${ssLinkedConnectionId}/integrationapps/${integrationAppName}/${flow._integrationId}/dashboard`
      );
    } else {
      history.push(`/pg/suitescript/${ssLinkedConnectionId}/integrations/${flow._integrationId}/dashboard`);
    }
  }, [
    history,
    ssLinkedConnectionId,
    integrationAppName,
    flow._integrationId,
  ]);

  return (
    <RunFlowButton ssLinkedConnectionId={ssLinkedConnectionId} flow={flow} onRunStart={handleOnRunStart} />
  );
}
