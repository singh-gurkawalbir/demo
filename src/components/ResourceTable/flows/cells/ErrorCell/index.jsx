import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';
import Status from '../../../../Buttons/Status';

export default function RunCell({
  flowId,
  integrationId,
}) {
  const match = useRouteMatch();
  const flowErrorCount = useSelector(state => {
    const integrationErrorsMap = selectors.openErrorsMap(state, integrationId);

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
