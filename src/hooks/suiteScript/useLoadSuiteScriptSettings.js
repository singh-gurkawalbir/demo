import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import actions from '../../actions';
import * as selectors from '../../reducers';

export default function useLoadSuiteScriptSettings({
  ssLinkedConnectionId,
  integrationId,
}) {
  const dispatch = useDispatch();

  const {hasData: hasSettingsMetadata} = useSelector(state => selectors.suiteScriptResourceStatus(state, {
    ssLinkedConnectionId,
    integrationId,
    resourceType: 'settings',
  }));
  useEffect(() => {
    if (!hasSettingsMetadata) { dispatch(actions.suiteScript.resource.request('settings', ssLinkedConnectionId, integrationId)); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {hasSettingsMetadata};
}
