import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ScriptLogs from '.';
import { selectors } from '../../reducers';
import RightDrawer from '../drawer/Right';
import DrawerHeader from '../drawer/Right/DrawerHeader';
import LoadResources from '../LoadResources';

const ScriptLogWrapper = () => {
  const match = useRouteMatch();
  const { scriptId } = match.params;
  //   const isScriptValid = useSelector(state => !!selectors.resource(state, 'scripts', scriptId));

  return (
    <ScriptLogs
      scriptId={scriptId}
      />
  );
};
const ScriptLogDrawerHeader = () => {
  const match = useRouteMatch();
  const history = useHistory();
  const { scriptId } = match.params;
  const scriptName = useSelector(state => {
    const script = selectors.resource(state, 'scripts', scriptId);

    return script?.name || '';
  });

  const handleClose = useCallback(
    () => {
      history.goBack();
    },
    [history],
  );

  return (
    <DrawerHeader
      hideBackButton="true"
      title={`Execution log: ${scriptName}`}
      onClose={handleClose}
      />
  );
};
export default function ScriptLogsDrawerRoute() {
  return (
    <LoadResources
      required="true"
      resources="imports, exports, scripts">
      <RightDrawer
        path="viewLogs/:scriptId"
        width="full"
        variant="persistent"
        >
        <ScriptLogDrawerHeader />
        <ScriptLogWrapper />
      </RightDrawer>
    </LoadResources>
  );
}
