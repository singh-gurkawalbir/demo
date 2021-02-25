import React, { useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import CodeEditor from '../../../CodeEditor';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';

export default function EditRetryData({
  retryId,
  flowId,
  resourceId,
  onChange,
}) {
  const dispatch = useDispatch();

  const retryStatus = useSelector(state =>
    selectors.retryDataContext(state, retryId)?.status,
  shallowEqual
  );

  const retryData = useSelector(state => selectors.retryData(state, retryId));

  const isFlowDisabled = useSelector(state =>
    !!(selectors.resource(state, 'flows', flowId)?.disabled)
  );

  useEffect(() => {
    if (!retryStatus && retryId) {
      dispatch(
        actions.errorManager.retryData.request({ flowId, resourceId, retryId })
      );
    }
  }, [dispatch, flowId, resourceId, retryId, retryStatus]);

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
