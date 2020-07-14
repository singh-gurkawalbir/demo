import React, { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import RightDrawer from '../../../../components/drawer/Right';
import MappingWrapper from './MappingWrapper';

export default function SuiteScriptMappingDrawer(props) {
  const {ssLinkedConnectionId, integrationId} = props;
  const match = useRouteMatch();
  const flowId = props.flowId || match.params.flowId;
  const history = useHistory();
  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);
  return (
    <RightDrawer
      path={['mapping', ':flowId/mapping']}
      height="tall"
      width="full"
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
