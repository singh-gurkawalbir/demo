import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../../../reducers';
import Uninstaller1 from './Uninstall1.0';
import Uninstaller2 from './Uninstall2.0';

const emptyobj = {};

export default function IntegrationAppUninstallation({ match }) {
  const { integrationId, childId } = match.params;
  const initialState = useSelector(state => state?.data?.resources?.integrations);
  const i = useSelectorMemo(selectors.mkIntegrationAppSettings, integrationId);

  const integration = useMemo(() => i
    ? {
      mode: i.mode,
      name: i.name,
      _id: i._id,
      children: i.children,
      install: i.install,
      installSteps: i.installSteps,
      uninstallSteps: i.uninstallSteps,
      settings: i.settings,
    }
    : emptyobj, [i]);

  const childSettings = useSelectorMemo(selectors.mkIntegrationAppSettings, childId);

  const childIntegration = useMemo(() => childSettings
    ? {
      mode: childSettings.mode,
      name: childSettings.name,
      _id: childSettings._id,
      children: childSettings.children,
      install: childSettings.install,
      installSteps: childSettings.installSteps,
      uninstallSteps: childSettings.uninstallSteps,
      _parentId: childSettings._parentId,
    }
    : emptyobj,
  [childSettings]);

  const isFrameWork2 = useSelector(state => selectors.isIntegrationAppVersion2(state, integrationId, true));

  // if integrations are not loaded yet, return null
  if (!initialState) {
    return null;
  }
  if (isFrameWork2) {
    return <Uninstaller2 integration={childId ? childIntegration : integration} integrationId={childId || integrationId} />;
  }

  return <Uninstaller1 integration={integration} integrationId={integrationId} childId={childId} />;
}
