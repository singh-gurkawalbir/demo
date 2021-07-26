import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../actions';

export default function useClearAsyncStateOnUnmount(key) {
  const dispatch = useDispatch();

  useEffect(() => () => {
    dispatch(actions.asyncTask.clear(key));
  }, [dispatch, key]);
}
