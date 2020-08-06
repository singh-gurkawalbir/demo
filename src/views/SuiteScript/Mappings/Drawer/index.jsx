import React, { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import RightDrawer from '../../../../components/drawer/Right';
import * as selectors from '../../../../reducers';
import MappingWrapper from './MappingWrapper';

export default function SuiteScriptMappingDrawer(props) {
  const {ssLinkedConnectionId, integrationId} = props;
  const match = useRouteMatch();
  const flowId = props.flowId || match.params.flowId;
  const history = useHistory();
  const isManageLevelUser = useSelector(
    state => selectors.userHasManageAccessOnSuiteScriptAccount(state, ssLinkedConnectionId)
  );
  const isMappingLoaded = useSelector(
    state => {
      const {mappings} = selectors.suiteScriptMappings(state);

      return !!mappings;
    }
  );
  const showFullWidth = isManageLevelUser && isMappingLoaded;
  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <RightDrawer
      path={['mapping', ':flowId/mapping']}
      height="tall"
      width={showFullWidth ? 'full' : 'large'}
      title="Import Mapping"
      variant="temporary"
      // helpKey={}
      // helpTitle={}
      >
      <MappingWrapper
        ssLinkedConnectionId={ssLinkedConnectionId}
        integrationId={integrationId}
        flowId={flowId}
        onClose={handleClose} />
    </RightDrawer>
  );
}
