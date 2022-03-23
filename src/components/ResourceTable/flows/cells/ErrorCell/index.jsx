import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';
import Status from '../../../../Buttons/Status';

export default function RunCell({
  flowId,
  integrationId,
  childId,
}) {
  const match = useRouteMatch();
  const isIntegrationAppV1 = useSelector(state => selectors.isIntegrationAppV1(state, integrationId));
  const flowErrorCount = useSelector(state => {
    const integrationErrorsMap = selectors.openErrorsMap(state, (!isIntegrationAppV1 && childId) ? childId : integrationId);

    return integrationErrorsMap?.[flowId] || '';
  });

  if (flowErrorCount) {
    return (
      <Status variant="error" size="mini" >
        <Link to={`${match.url}/${flowId}/errorsList`}>{flowErrorCount} {flowErrorCount === 1 ? 'error' : 'errors'}</Link>
      </Status>
    );
  }

  return (
    <Status variant="success" size="mini" >
      <Link to={`${match.url}/${flowId}/errorsList`}>success</Link>
    </Status>
  );
}
