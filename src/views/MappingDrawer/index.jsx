import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
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

function SelectImportDrawer() {
  return (
    <RightDrawer
      hideBackButton
      exact
      path={[
        'mapping/:flowId/:importId',
        'mapping/:flowId',
      ]}
      height="tall"
      width="default"
      title="Select Mapping"
      variant="temporary"
>
      <LoadResources
        required="true"
        resources="imports, exports, connections">
        <SelectImport />
      </LoadResources>

    </RightDrawer>
  );
}
function MappingDrawer(props) {
  const match = useRouteMatch();
  const integrationId = match.params?.integrationId || props.integrationId;

  const isMappingPreviewAvailable = useSelector(state => {
    const resourceId = selectors.mapping(state)?.resourceId;

    return !!selectors.mappingPreviewType(state, resourceId);
  });

  return (
    <RightDrawer
      hideBackButton
      path={[
        'mapping/:flowId/:importId/:subRecordMappingId/view',
        'mapping/:flowId/:importId/view',
      ]}
      height="tall"
      width={isMappingPreviewAvailable ? 'full' : 'default'}
      title="Edit Mapping"
      variant="temporary"
      >
      <LoadResources
        required="true"
        resources="imports, exports, connections">
        <MappingWrapper
          integrationId={integrationId}
          {...props} />
      </LoadResources>
    </RightDrawer>
  );
}
export default function MappingDrawerRoute(props) {
  return (
    <>
      <MappingDrawer {...props} />
      <SelectImportDrawer />
    </>
  );
}
