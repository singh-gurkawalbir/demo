import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import * as selectors from '../../reducers';
import actions from '../../actions';
import DIYIntegrationSettings from './diy';
import IntegrationAppSettings from '../IntegrationApps/Settings';

export default function IntegrationSettings(props) {
  const { integrationId } = props.match.params;
  const dispatch = useDispatch();
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)
  );
  const permissions = useSelector(state => selectors.userPermissions(state));

  useEffect(() => {
    if (!integration) {
      dispatch(actions.resource.request('integrations', integrationId));
    }
  });

  if (!integration) {
    return null;
  }

  const SettingsView = integration._connectorId
    ? IntegrationAppSettings
    : DIYIntegrationSettings;

  return (
    <SettingsView
      integrationId={integrationId}
      integration={integration}
      permissions={permissions}
    />
  );
}
