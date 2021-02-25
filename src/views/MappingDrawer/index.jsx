import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route, useHistory, useRouteMatch } from 'react-router-dom';
import { selectors } from '../../reducers';
import LoadResources from '../../components/LoadResources';
import Mapping from '../../components/Mapping';
import SelectImport from './SelectImport';
import RightDrawer from '../../components/drawer/Right';
import DrawerHeader from '../../components/drawer/Right/DrawerHeader';
import DrawerContent from '../../components/drawer/Right/DrawerContent';
import DatabaseMapping from './DatabaseMapping_afe2';
import SelectQueryType from './DatabaseMapping/SelectQueryType';
import EditorDrawer from '../../components/AFE2/Drawer';

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

  let importId;

  const isMappingPreviewAvailable = useSelector(state => {
    importId = selectors.mapping(state)?.importId;

    return !!selectors.mappingPreviewType(state, importId);
  });

  const importName = useSelector(state => selectors.resourceData(state, 'imports', importId).merged?.name);
  const title = importName ? `Edit Mapping > ${importName}` : 'Edit Mapping';

  return (
    // TODO (Aditya/Raghu): Break it into 2 side drawer after changes to RightDrawer is done on exact property.
    // Also check for dummy route implementation on Right Drawer
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
        variant="persistent"
      >
        <DrawerHeader title={title} />
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
        variant="temporary"
        hideBackButton
        path="dbMapping/:flowId/:importId">

        <DrawerHeader title="Select query type" />

        <DrawerContent>
          <SelectQueryType />
        </DrawerContent>
      </RightDrawer>

      <Route
        path={`${match.url}/queryBuilder/:flowId/:importId/:index/view`}>
        <DatabaseMapping />
        <EditorDrawer />
      </Route>
    </LoadResources>
  );
}
