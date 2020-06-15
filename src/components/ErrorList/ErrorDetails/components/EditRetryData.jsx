import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CodeEditor from '../../../CodeEditor';
import actions from '../../../../actions';
import { retryDataContext } from '../../../../reducers';

export default function EditRetryData({
  retryId,
  flowId,
  resourceId,
  onChange,
}) {
  const dispatch = useDispatch();
  const { status, data: retryData = {} } = useSelector(state =>
    retryDataContext(state, retryId)
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
    />
  );
}
