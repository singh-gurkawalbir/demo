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
      resourceId={importId}
      subRecordMappingId={subRecordMappingId}
      disabled={isMonitorLevelUser}
    />

  );
};
export default function MappingDrawerRoute(props) {
  const match = useRouteMatch();
  const integrationId = match.path?.integrationId || props.integrationId;

  const isMappingPreviewAvailable = useSelector(state => {
    const resourceId = selectors.mapping(state)?.resourceId;

    return !!selectors.mappingPreviewType(state, resourceId);
  });

  return (
    <RightDrawer
      showBackButton={false}
      path={[
        'mapping/:flowId/:importId/:subRecordMappingId/view',
        'mapping/:flowId/:importId/view',
        'mapping/:flowId/:importId',
        'mapping/:flowId',
      ]}
      height="tall"
      width={isMappingPreviewAvailable ? 'full' : 'default'}
      title="Edit Mapping"
      variant="temporary"
      >
      <LoadResources
        required="true"
        resources="imports, exports, connections">
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
      </LoadResources>

    </RightDrawer>
  );
}
