import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { selectors } from '../../../../../reducers';
import ReplaceConnection from '../../../../ReplaceConnection';
import DebugIcon from '../../../../icons/DebugIcon';
import RightDrawer from '../../../../drawer/Right';

export default {
  label: 'Replace connection',
  icon: DebugIcon,
  useHasAccess: ({ rowData }) => {
    const { _id: connectionId } = rowData;

    const hasAccess = useSelector(state => selectors.resourcePermissions(
      state,
      'connections',
      connectionId
    ))?.edit;

    return hasAccess;
  },
  component: function Replaceconnection({ rowData = {} }) {
    const { _id: connectionId } = rowData;
    const [show, setShow] = useState(true);
    const history = useHistory();

    const match = useRouteMatch();
    const parentUrl = match.url;
    const {flowId, integrationId} = match.params;

    const handleClose = useCallback(() => {
      history.push(parentUrl);
      setShow(false);
    }, [history, parentUrl]);
    const openInstallBaseURL = useCallback(() => {
      history.replace(`${match.url}/replaceConnection/${connectionId}`);
    }, [history, connectionId, match.url]);

    useEffect(() => {
      openInstallBaseURL();
    }, [openInstallBaseURL]);

    return (
      <>
        {show && (
          <RightDrawer
            path="replaceConnection/:connId"
            height="tall"
            title="Replace connection"
            onClose={handleClose}>
            <ReplaceConnection flowId={flowId} integrationId={integrationId} onClose={handleClose} />
          </RightDrawer>

        )}
      </>
    );
  },
};
