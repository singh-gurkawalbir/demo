import React, { useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import CodeEditor from '../../../CodeEditor';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';

const emptyObject = {};

export default function EditRetryData({
  retryId,
  flowId,
  resourceId,
  onChange,
}) {
  const dispatch = useDispatch();
  const { status, data: retryData = emptyObject } = useSelector(state =>
    selectors.retryDataContext(state, retryId),
  shallowEqual
  );

  const isFlowDisabled = useSelector(state =>
    !!(selectors.resource(state, 'flows', flowId)?.disabled)
  );

  useEffect(() => {
    if (!status && retryId) {
      dispatch(
        actions.errorManager.retryData.request({ flowId, resourceId, retryId })
      );
    }
  }, [dispatch, flowId, resourceId, retryId, status]);

  return (
    <CodeEditor
      name={`${retryId}-edit`}
      value={retryData}
      mode="json"
      onChange={onChange}
      readOnly={isFlowDisabled}
    />
  );
}
