import React, { useCallback } from 'react';
// import { useRouteMatch, useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import RightDrawer from '../../../components/drawer/Right';
import SuiteScriptMapping from '.';

const rootPath = ':flowId/mapping';

export default function SuiteScriptMappingDrawer() {
  const history = useHistory();

  const handelClose = useCallback(() => {
    history.goBack();
  }, [history]);
  return (
    <RightDrawer
      path={rootPath}
      height="tall"
      width="large"
      title="Import Mapping"
      variant="temporary"
      // helpKey={}
      // helpTitle={}
      >
      <SuiteScriptMapping
        onClose={handelClose} />
    </RightDrawer>
  );
}
