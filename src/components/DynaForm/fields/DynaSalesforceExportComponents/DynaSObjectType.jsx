import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import RefreshGenericResource from '../DynaRefreshableSelect';
import actions from '../../../../actions';

export default function DynaRequiredTrigger(props) {
  const { value, connectionId, commMetaPath } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    if (value) {
      dispatch(
        actions.metadata.request(connectionId, `${commMetaPath}/${value}`)
      );
    }
  }, [commMetaPath, connectionId, dispatch, value]);

  return <RefreshGenericResource {...props} />;
}
