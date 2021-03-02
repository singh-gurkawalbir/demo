import React, { useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { formatErrorDetails } from '../../../../utils/errorManagement';
import CodeEditor from '../../../CodeEditor';
import { selectors } from '../../../../reducers';

export default function ViewErrorDetails({ flowId, resourceId, errorId, isResolved }) {
  const errorDoc = useSelector(
    state => selectors.resourceError(state, {
      flowId,
      resourceId,
      errorId,
      isResolved,
    }) || {},
    shallowEqual
  );
  const errorDetails = useMemo(() => formatErrorDetails(errorDoc), [errorDoc]);

  return (
    <CodeEditor
      value={errorDetails}
      mode="text"
      readOnly
      showGutter={false}
    />
  );
}
