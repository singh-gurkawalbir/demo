import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import RightDrawer from '../../../components/drawer/Right';
import SuiteScriptMapping from '.';

export default function SuiteScriptMappingDrawer(props) {
  const {ssLinkedConnectionId, integrationId, flowId } = props;
  const history = useHistory();
  const handelClose = useCallback(() => {
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
        onClose={handelClose} />
    </RightDrawer>
  );
}
