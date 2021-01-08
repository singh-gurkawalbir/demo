import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ScriptLogs from '.';
import { selectors } from '../../reducers';
import RightDrawer from '../../components/drawer/Right';
import DrawerHeader from '../../components/drawer/Right/DrawerHeader';
import LoadResources from '../../components/LoadResources';

const ScriptLogsWrapper = () => {
  const match = useRouteMatch();
  const { scriptId } = match.params;

  return (
    <ScriptLogs
      scriptId={scriptId}
      />
  );
};
const ScriptLogsDrawerHeader = () => {
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
        <ScriptLogsDrawerHeader />
        <ScriptLogsWrapper />
      </RightDrawer>
    </LoadResources>
  );
}
