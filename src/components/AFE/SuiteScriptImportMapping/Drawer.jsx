import React, { useCallback } from 'react';
// import { useRouteMatch, useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import RightDrawer from '../../drawer/Right';
import SuiteScriptImportMapping from '.';

const rootPath = ':flowId/mapping';

export default function SuiteScriptImportMappingDrawer() {
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
      <SuiteScriptImportMapping
        onClose={handelClose} />
    </RightDrawer>
  );
}
