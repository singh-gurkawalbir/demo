import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import RefreshGenericResource from '../DynaRefreshableSelect';
import actions from '../../../../actions';

export default function DynaRequiredTrigger(props) {
  const { value, connectionId, mode, resourceType, selectField } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    if (value) {
      dispatch(
        actions.metadata.refresh(
          connectionId,
          resourceType,
          mode,
          { referenceTo: { $ne: [] } },
          value,
          selectField
        )
      );
    }
  }, [connectionId, dispatch, mode, resourceType, selectField, value]);

  return <RefreshGenericResource {...props} />;
}
