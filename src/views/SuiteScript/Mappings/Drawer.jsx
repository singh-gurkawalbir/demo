import React, { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import RightDrawer from '../../../components/drawer/Right';
import SuiteScriptMapping from '.';

export default function SuiteScriptMappingDrawer(props) {
  const match = useRouteMatch();
  const flowId = props.flowId || match.params.flowId;
  const {ssLinkedConnectionId, integrationId} = props;
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
      <SuiteScriptMapping
        ssLinkedConnectionId={ssLinkedConnectionId}
        integrationId={integrationId}
        flowId={flowId}
        onClose={handleClose} />
    </RightDrawer>
  );
}
