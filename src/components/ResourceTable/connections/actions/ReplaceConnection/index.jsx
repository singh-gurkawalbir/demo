import React, { useState, useCallback, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';
import ReplaceConnection from '../../../../ReplaceConnection';
import DebugIcon from '../../../../icons/DebugIcon';
import RightDrawer from '../../../../drawer/Right';

export default {
  label: 'Replace connection',
  icon: DebugIcon,
  component: function ReplaceConnections({ rowData = {} }) {
    const { _id: connectionId } = rowData;
    const [show, setShow] = useState(true);
    const history = useHistory();

    const match = useRouteMatch();
    const parentUrl = match.url;

    const {flowId, integrationId, childId} = match.params;
    const isFrameWork2 = useSelector(state => selectors.isIntegrationAppVersion2(state, integrationId, true));

    const handleClose = useCallback(() => {
      history.push(parentUrl);
      setShow(false);
    }, [history, parentUrl]);

    useEffect(() => {
      history.replace(`${match.url}/replaceConnection/${connectionId}`);
    }, [history, connectionId, match.url]);

    return (
      <>
        {show && (
          <RightDrawer
            path="replaceConnection/:connId"
            height="tall"
            title="Replace connection"
            onClose={handleClose}>
            <ReplaceConnection
              flowId={flowId} integrationId={integrationId} childId={childId} isFrameWork2={isFrameWork2}
              onClose={handleClose} />
          </RightDrawer>

        )}
      </>
    );
  },
};
