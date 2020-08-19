import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import OpenErrors from './OpenErrors';
import ResolvedErrors from './ResolvedErrors';

export default function ErrorList({ flowId, errorType }) {
  const match = useRouteMatch();
  const { resourceId } = match.params;

  return (
    <>
      <OpenErrors
        flowId={flowId}
        resourceId={resourceId}
        show={errorType === 'open'}
      />
      <ResolvedErrors
        flowId={flowId}
        resourceId={resourceId}
        show={errorType === 'resolved'}
      />
    </>
  );
}
