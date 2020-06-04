import React from 'react';
import { useSelector } from 'react-redux';
import * as selectors from '../../../../../reducers';
import getRoutePath from '../../../../../utils/routePaths';
import Uninstaller from './Uninstall';
import Uninstaller2 from './Uninstall2.0';

export default function IntegrationAppUninstallation({ match, history }) {
  const { integrationId, storeId } = match.params;
  const integration =
    useSelector(state =>
      selectors.integrationAppSettings(state, integrationId)
    )
  if (!integration) {
    history.replace(getRoutePath('dashboard'));
    return null;
  }
  const isCloned =
    integration.install &&
    integration.install.find(step => step.isClone);
  const isFrameWork2 =
    (
      integration.installSteps &&
      integration.installSteps.length) || (
      integration.uninstallSteps &&
        integration.uninstallSteps.length) ||
    isCloned;
  if (isFrameWork2) return <Uninstaller2 integration={integration} integrationId={integrationId} />;
  return <Uninstaller integration={integration} integrationId={integrationId} storeId={storeId} />
}
