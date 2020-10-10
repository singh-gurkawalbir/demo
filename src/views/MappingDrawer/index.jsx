import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route, useHistory, useRouteMatch } from 'react-router-dom';
import { selectors } from '../../reducers';
import LoadResources from '../../components/LoadResources';
import Mapping from '../../components/Mapping';
import SelectImport from './SelectImport';
import RightDrawer from '../../components/drawer/Right';

const MappingWrapper = ({integrationId}) => {
  const history = useHistory();
  const match = useRouteMatch();
  const { flowId, importId, subRecordMappingId } = match.params;

  const isMonitorLevelUser = useSelector(state => selectors.isFormAMonitorLevelAccess(state, integrationId));

  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <Mapping
      onClose={handleClose}
      flowId={flowId}
      importId={importId}
      subRecordMappingId={subRecordMappingId}
      disabled={isMonitorLevelUser}
    />

  );
};
export default function MappingDrawerRoute(props) {
  const match = useRouteMatch();
  const integrationId = match.params?.integrationId || props.integrationId;

  const isMappingPreviewAvailable = useSelector(state => {
    const importId = selectors.mapping(state)?.importId;

    return !!selectors.mappingPreviewType(state, importId);
  });

  return (

    // TODO (Aditya/Raghu): Break it into 2 side drawer after changes to RightDrawer is done on exact property. Also check for dummy route implementation on Right Drawer
    <LoadResources
      required="true"
      resources="imports, exports, connections">
      <RightDrawer
        hideBackButton
        path={[
          'mapping/:flowId/:importId/:subRecordMappingId/view',
          'mapping/:flowId/:importId/view',
          'mapping/:flowId/:importId',
          'mapping/:flowId',
        ]}
        height="tall"
        width={isMappingPreviewAvailable ? 'full' : 'default'}
        title="Edit mapping"
        variant="persistent"
      >

        <Switch>
          <Route
            path={[
              `${match.url}/mapping/:flowId/:importId/:subRecordMappingId/view`,
              `${match.url}/mapping/:flowId/:importId/view`,
            ]} >
            <MappingWrapper
              integrationId={integrationId}
              {...props} />
          </Route>
          <Route
            exact
            path={[
              `${match.url}/mapping/:flowId`,
              `${match.url}/mapping/:flowId/:importId`,
            ]}
            >
            <SelectImport />
          </Route>
        </Switch>
      </RightDrawer>
    </LoadResources>
  );
}
