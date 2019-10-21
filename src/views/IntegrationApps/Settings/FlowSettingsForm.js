import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import { ActionsFactory } from '../../../components/ResourceFormFactory';

export default function FlowSettingsForm(props) {
  const { onSubmitComplete, integrationId, flowId, fieldMeta } = props;
  const dispatch = useDispatch();
  const formState = useSelector(state =>
    selectors.integrationAppSettingsFormState(state, integrationId, flowId)
  );

  useEffect(
    () => () =>
      dispatch(actions.integrationApp.settings.clear(integrationId, flowId)),
    [dispatch, flowId, integrationId]
  );

  useEffect(() => {
    if (formState.submitComplete && onSubmitComplete) {
      onSubmitComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.submitComplete /* , onSubmitComplete */]);

  return <ActionsFactory {...props} {...formState} fieldMeta={fieldMeta} />;
}
