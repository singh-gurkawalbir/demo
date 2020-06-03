import React, { useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { formatErrorDetails } from '../../../../utils/errorManagement';
import CodeEditor from '../../../CodeEditor';
import { resourceError } from '../../../../reducers';

export default function ViewErrorDetails({ flowId, resourceId, errorId }) {
  const errorDoc = useSelector(
    state => resourceError(state, { flowId, resourceId, errorId }) || {},
    shallowEqual
  );
  const errorDetails = useMemo(() => formatErrorDetails(errorDoc), [errorDoc]);

  return <CodeEditor value={errorDetails} mode="text" readOnly />;
}
