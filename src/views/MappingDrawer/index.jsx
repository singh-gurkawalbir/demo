import React, { useCallback} from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route, useHistory, useRouteMatch } from 'react-router-dom';
import { selectors } from '../../reducers';
import LoadResources from '../../components/LoadResources';
import Mapping from '../../components/Mapping';
import SelectImport from './SelectImport';
import RightDrawer from '../../components/drawer/Right';
import DrawerHeader from '../../components/drawer/Right/DrawerHeader';
import DrawerContent from '../../components/drawer/Right/DrawerContent';
import DatabaseMapping from './DatabaseMapping_afe';
import SelectQueryType from './DatabaseMapping_afe/SelectQueryType';
import EditorDrawer from '../../components/AFE/Drawer';
import useFormOnCancelContext from '../../components/FormOnCancelContext';
import { MAPPINGS_FORM_KEY } from '../../utils/constants';
import { DRAWER_URLS, DRAWER_URL_PREFIX, drawerPaths, buildDrawerUrl } from '../../utils/rightDrawer';

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
  const { saveStatus } = useSelector(state => selectors.mapping(state));
  const closeDisabled = saveStatus === 'requested';

  const {setCancelTriggered} = useFormOnCancelContext(MAPPINGS_FORM_KEY);

  let importId;

  const isMappingPreviewAvailable = useSelector(state => {
    importId = selectors.mapping(state)?.importId;

    return !!selectors.mappingPreviewType(state, importId);
  });

  const importName = useSelector(state => selectors.resourceData(state, 'imports', importId).merged?.name);
  const title = importName ? `Edit Mapping: ${importName}` : 'Edit Mapping';

  return (
    // TODO (Aditya/Raghu): Break it into 2 side drawer after changes to RightDrawer is done on exact property.
    // Also check for dummy route implementation on Right Drawer
    <LoadResources
      required="true"
      resources="imports, exports, connections">
      <RightDrawer
        path={[
          drawerPaths.MAPPINGS.SUB_RECORD,
          drawerPaths.MAPPINGS.IMPORT.VIEW,
          drawerPaths.MAPPINGS.IMPORT.ROOT,
          drawerPaths.MAPPINGS.IMPORT.LIST_ALL,
        ]}
        height="tall"
        width={isMappingPreviewAvailable ? 'full' : 'default'} >
        <Switch>
          <Route
            path={[
              buildDrawerUrl({ path: drawerPaths.MAPPINGS.SUB_RECORD, baseUrl: match.url}),
              buildDrawerUrl({ path: drawerPaths.MAPPINGS.IMPORT.VIEW, baseUrl: match.url}),
            ]} >
            <DrawerHeader
            // for new mappings afe, pass old drawer dataTest as dummy for automation
              closeDataTest={!isMappingPreviewAvailable && 'oldRightDrawer'}
              title={title}
              helpTitle={title}
              helpKey="afe.import.mapping"
              handleClose={setCancelTriggered}
              disableClose={closeDisabled} />
            <MappingWrapper
              integrationId={integrationId}
              {...props} />
          </Route>
          <Route
            exact
            path={[
              buildDrawerUrl({ path: drawerPaths.MAPPINGS.IMPORT.LIST_ALL, baseUrl: match.url}),
              buildDrawerUrl({ path: drawerPaths.MAPPINGS.IMPORT.ROOT, baseUrl: match.url}),
            ]}
            >
            <DrawerHeader title={title} />
            <SelectImport />
          </Route>
        </Switch>
        <EditorDrawer />

      </RightDrawer>

      <RightDrawer
        height="tall"
        width="default"
        path={DRAWER_URLS.DB_MAPPINGS}>

        <DrawerHeader title="Select query type" />

        <DrawerContent>
          <SelectQueryType />
        </DrawerContent>
      </RightDrawer>

      <Route
        path={`${match.url}/${DRAWER_URL_PREFIX}/queryBuilder/:flowId/:importId/:index/view`}>
        <DatabaseMapping />
        <EditorDrawer />
      </Route>
    </LoadResources>
  );
}
