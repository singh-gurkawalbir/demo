import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import * as selectors from '../../../../../reducers';
import Uninstaller1 from './Uninstall1.0';
import Uninstaller2 from './Uninstall2.0';

const emptyobj = {};
export default function IntegrationAppUninstallation({ match }) {
  const { integrationId, storeId } = match.params;
  const integration =
    useSelector(state => {
      const i = selectors.integrationAppSettings(state, integrationId);
      if (i) {
        return {mode: i.mode, name: i.name, _id: i._id, stores: i.stores, install: i.install, installSteps: i.installSteps, uninstallSteps: i.uninstallSteps};
      }
      return emptyobj;
    }, shallowEqual
    );
  const storeIntegration =
  useSelector(state => {
    const i = selectors.integrationAppSettings(state, storeId);
    if (i) {
      return {mode: i.mode, name: i.name, _id: i._id, stores: i.stores, install: i.install, installSteps: i.installSteps, uninstallSteps: i.uninstallSteps};
    }
    return emptyobj;
  }, shallowEqual
  );
  const isFrameWork2 = useSelector(state => selectors.isIntegrationAppVersion2(state, integrationId, true));
  if (isFrameWork2) {
    return <Uninstaller2 integration={storeId ? storeIntegration : integration} integrationId={storeId || integrationId} />;
  }

  return <Uninstaller1 integration={integration} integrationId={integrationId} storeId={storeId} />;
}
