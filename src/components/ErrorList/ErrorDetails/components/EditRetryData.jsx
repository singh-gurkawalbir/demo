import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CodeEditor from '../../../../components/CodeEditor';
import { jobErrorRetryObject } from '../../../../reducers';
// import actions from '../../../../actions';

export default function EditRetryData({ retryId, onChange }) {
  const dispatch = useDispatch();
  const retryObject = useSelector(state => jobErrorRetryObject(state, retryId));
  const [isRequested, setIsRequested] = useState(false);

  useEffect(() => {
    if (!isRequested && retryId) {
      // dispatch(actions.job.requestRetryData({ retryId }));
      setIsRequested(true);
    }
  }, [dispatch, isRequested, retryId]);

  return (
    <CodeEditor
      name={`${retryId}-edit`}
      value={retryObject}
      mode="json"
      onChange={onChange}
    />
  );
}
