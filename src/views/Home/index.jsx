import { difference } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../actions';
import DownloadIntegrationDrawer from '../../components/drawer/DownloadIntegration';
import InstallIntegrationDrawer from '../../components/drawer/Install/Integration';
import ResourceDrawer from '../../components/drawer/Resource';
import { selectors } from '../../reducers';
import DashboardPageBar from './PageBar';
import DashboardTiles from './Tiles';
import InstallZip from './InstallZip';
import OfflineConnectionDrawer from './OfflineConnectionDrawer';

// This component does not return a jsx ..it is sort of a hook
// is there any better pattern to this
const LoadTiles = () => {
  const dispatch = useDispatch();
  const ssLinkedConnections = useSelector(state =>
    selectors.suiteScriptLinkedConnections(state)
  );

  const [suiteScriptResourcesToLoad, setSuiteScriptResourcesToLoad] = useState(
    []
  );

  useEffect(() => {
    const ssLinkedConnectionIds = ssLinkedConnections.map(c => c._id);
    const newSuiteScriptResourcesToLoad = difference(
      ssLinkedConnectionIds,
      suiteScriptResourcesToLoad
    );

    if (newSuiteScriptResourcesToLoad.length > 0) {
      setSuiteScriptResourcesToLoad(
        suiteScriptResourcesToLoad.concat(newSuiteScriptResourcesToLoad)
      );
    }
  }, [ssLinkedConnections, suiteScriptResourcesToLoad]);

  useEffect(() => {
    dispatch(actions.resource.requestCollection('tiles'));
  }, [dispatch]);

  useEffect(() => {
    suiteScriptResourcesToLoad.forEach(connectionId =>
      dispatch(
        actions.resource.requestCollection(
          `suitescript/connections/${connectionId}/tiles`
        )
      )
    );
  }, [dispatch, suiteScriptResourcesToLoad]);

  return null;
};

export default function Dashboard() {
  return (
    <>
      <LoadTiles />
      <InstallZip />
      <ResourceDrawer />
      <DownloadIntegrationDrawer />
      <InstallIntegrationDrawer />
      <OfflineConnectionDrawer />
      <DashboardPageBar />
      <DashboardTiles />
    </>
  );
}
