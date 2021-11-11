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
        <Switch>
          <Route
            path={[
              `${match.url}/mapping/:flowId/:importId/:subRecordMappingId/view`,
              `${match.url}/mapping/:flowId/:importId/view`,
            ]} >
            <DrawerHeader
            // for new mappings afe, pass old drawer dataTest as dummy for automation
              closeDataTest={!isMappingPreviewAvailable && 'oldRightDrawer'}
              title={title}
              handleClose={setCancelTriggered}
              disableClose={closeDisabled} />
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
            <DrawerHeader title={title} />
            <SelectImport />
          </Route>
        </Switch>
        <EditorDrawer />

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
