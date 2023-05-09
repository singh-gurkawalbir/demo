import React, { useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ConfigConnectionDebugger from '../../components/drawer/ConfigConnectionDebugger';
import ResourceDrawer from '../../components/drawer/Resource';
import QueuedJobsDrawer from '../../components/JobDashboard/QueuedJobs/QueuedJobsDrawer';
import LoadResources from '../../components/LoadResources';
import MappingDrawerRoute from '../MappingDrawer';
import BottomDrawer from './drawers/BottomDrawer';
import ErrorDetailsDrawer from './drawers/ErrorsDetails';
import HooksDrawer from './drawers/Hooks';
import ChartsDrawer from './drawers/LineGraph';
import ReplaceConnectionDrawer from './drawers/ReplaceConnection';
import ScheduleDrawer from './drawers/Schedule';
import SettingsDrawer from './drawers/Settings';
import EditorDrawer from '../../components/AFE/Drawer';
import { selectors } from '../../reducers';
import IsLoggableContextProvider from '../../components/IsLoggableContextProvider';
import actions from '../../actions';
import { STANDALONE_INTEGRATION } from '../../constants';
import useLoadUIFields from '../../hooks/useLoadUIFields';
import FlowBuilderBody from './FlowBuilderBody';
import Redirection from './Redirection';
import LoadingNotification from '../../App/LoadingNotification';

function FBComponent({flowId, integrationId}) {
  const _integrationId = useSelector(state => selectors.getParentIntegrationId(state, integrationId));

  return (
    <>
      <FlowBuilderBody
        flowId={flowId}
        integrationId={integrationId}
      />

      <LoadResources resources={`integrations/${_integrationId}/ashares`}>
        <BottomDrawer
          flowId={flowId}
          integrationId={integrationId}
          parentIntegrationId={_integrationId}
      />
      </LoadResources>
    </>
  );
}

const spinner = <LoadingNotification message="Loading" />;

export default function FlowBuilder() {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const { flowId, integrationId, childId } = match.params;

  // takes care of loading UI fields for the flow resources
  useLoadUIFields({ flowId });

  // Initializes a new flow (patch, no commit)
  // and replaces the url to reflect the new temp flow id.

  // #endregion
  const __integrationId = useSelector(state => {
    const isIAV2 = selectors.isIntegrationAppVersion2(state, integrationId);

    return isIAV2 ? (childId || integrationId) : integrationId;
  });
  const integrationLoaded = useSelector(state => {
    if (!integrationId || integrationId === STANDALONE_INTEGRATION.id) return true;

    return !!selectors.resource(state, 'integrations', integrationId);
  });

  useEffect(() => {
    if (integrationId && integrationId !== STANDALONE_INTEGRATION.id) {
      dispatch(actions.resource.request('integrations', integrationId));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [integrationLoaded]);

  if (!integrationLoaded) return null;

  return (
    <LoadResources integrationId={__integrationId} required resources="connections,imports,exports,flows,scripts" spinner={spinner} >
      <Redirection>
        <ResourceDrawer flowId={flowId} integrationId={integrationId} />
        <ConfigConnectionDebugger />
        <HooksDrawer flowId={flowId} integrationId={integrationId} />
        <ScheduleDrawer flowId={flowId} />
        <ChartsDrawer flowId={flowId} />
        <QueuedJobsDrawer integrationId={integrationId} />
        <EditorDrawer />
        <ErrorDetailsDrawer flowId={flowId} />
        <IsLoggableContextProvider isLoggable>
          <SettingsDrawer
            integrationId={integrationId}
            resourceType="flows"
            resourceId={flowId}
            flowId={flowId} />
        </IsLoggableContextProvider>
        <ReplaceConnectionDrawer
          flowId={flowId}
          integrationId={integrationId}
          childId={childId} />

        <FBComponent
          flowId={flowId} integrationId={integrationId}
          childId={childId} />
        <MappingDrawerRoute integrationId={integrationId} />
      </Redirection>
    </LoadResources>
  );
}
