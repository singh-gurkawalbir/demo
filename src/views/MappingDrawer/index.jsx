import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route, useHistory, useRouteMatch } from 'react-router-dom';
import { selectors } from '../../reducers';
import LoadResources from '../../components/LoadResources';
import Mapping from '../../components/Mapping';
import SelectImport from './SelectImport';
import RightDrawer from '../../components/drawer/Right';
import DatabaseMapping from './DatabaseMapping';
import SelectQueryType from './DatabaseMapping/SelectQueryType';

const MappingWrapper = ({integrationId}) => {
  const history = useHistory();
  const match = useRouteMatch();
  const { flowId, importId, subRecordMappingId } = match.params;
  const isDatabaseImport = useSelector(state => {
    const importResource = selectors.resource(state, 'imports', importId);

    return !!['RDBMSImport', 'DynamodbImport', 'MongodbImport'].includes(importResource.adaptorType);
  });

  const isMonitorLevelUser = useSelector(state => selectors.isFormAMonitorLevelAccess(state, integrationId));

  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);

  if (isDatabaseImport) {
    return null;
  }

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
        variant="temporary"
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
      <RightDrawer
        height="tall"
        width="default"
        title="Select Query Type"
        variant="temporary"
        exact
        hideBackButton
        path={['queryBuilder/:flowId/:importId']}
      >
        <SelectQueryType />
      </RightDrawer>
      <Route
        path={`${match.url}/queryBuilder/:flowId/:importId/:index/view`}>
        <DatabaseMapping
          integrationId={integrationId}
          {...props}
          />
      </Route>
    </LoadResources>
  );
}
