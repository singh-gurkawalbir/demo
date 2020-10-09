import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../../../reducers';
import Uninstaller1 from './Uninstall1.0';
import Uninstaller2 from './Uninstall2.0';

const emptyobj = {};

export default function IntegrationAppUninstallation({ match }) {
  const { integrationId, storeId } = match.params;
  const initialState = useSelector(state => state?.data?.resources?.integrations);
  const i = useSelectorMemo(selectors.mkIntegrationAppSettings, integrationId);

  const integration = useMemo(() => i ? {mode: i.mode, name: i.name, _id: i._id, stores: i.stores, install: i.install, installSteps: i.installSteps, uninstallSteps: i.uninstallSteps} : emptyobj, [i]);

  const storeSettings = useSelectorMemo(selectors.mkIntegrationAppSettings, storeId);

  const storeIntegration = useMemo(() => storeSettings ? {mode: storeSettings.mode, name: storeSettings.name, _id: storeSettings._id, stores: storeSettings.stores, install: storeSettings.install, installSteps: storeSettings.installSteps, uninstallSteps: storeSettings.uninstallSteps} : emptyobj, [storeSettings]);

  const isFrameWork2 = useSelector(state => selectors.isIntegrationAppVersion2(state, integrationId, true));

  // if integrations are not loaded yet, return null
  if (!initialState) {
    return null;
  }
  if (isFrameWork2) {
    return <Uninstaller2 integration={storeId ? storeIntegration : integration} integrationId={storeId || integrationId} />;
  }

  return <Uninstaller1 integration={integration} integrationId={integrationId} storeId={storeId} />;
}
