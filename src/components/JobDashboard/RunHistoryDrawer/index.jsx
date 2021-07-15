import React, { useCallback } from 'react';
import { useRouteMatch, useHistory, matchPath, useLocation } from 'react-router-dom';
import { selectors } from '../../../reducers';
import LoadResources from '../../LoadResources';
import RightDrawer from '../../drawer/Right';
import DrawerHeader from '../../drawer/Right/DrawerHeader';
import DrawerContent from '../../drawer/Right/DrawerContent';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { emptyObject } from '../../../utils/constants';
import RunHistory from '../RunHistory';

export default function RunHistoryDrawer() {
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const { params: { flowId } = {} } = matchPath(location.pathname, {path: `${match.path}/:flowId/runHistory`}) || {};
  const flow = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'flows',
    flowId
  )?.merged || emptyObject;
  const handleClose = useCallback(() => {
    history.push(match.url);
  }, [match.url, history]);

  return (
    <LoadResources
      required="true"
      resources="imports, exports, connections">
      <RightDrawer
        path=":flowId/runHistory"
        height="tall"
        width="full"
        variant="permanent"
        onClose={handleClose}
        >

        <DrawerHeader title={`Run History: ${flow.name || flowId}`} />

        <DrawerContent>
          <RunHistory flowId={flowId} />
        </DrawerContent>
      </RightDrawer>
    </LoadResources>
  );
}
