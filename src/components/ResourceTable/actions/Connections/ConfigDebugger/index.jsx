import React, { useState, useCallback } from 'react';
import * as selectors from '../../../../../reducers';
import ConfigureDebugger from '../../../../ConfigureDebugger';
import DebugIcon from '../../../../icons/DebugIcon';

export default {
  label: 'Configure debugger',
  icon: DebugIcon,
  hasAccess: ({ state, rowData }) => {
    const { _id: connectionId } = rowData;
    const hasAccess = selectors.resourcePermissions(
      state,
      'connections',
      connectionId
    ).edit;

    return hasAccess;
  },
  component: function ConfigDebugger({ rowData = {} }) {
    const { _id: connectionId, name: connectionName, debugDate } = rowData;
    const [show, setShow] = useState(true);
    const handleConfigDebuggerClose = useCallback(() => {
      setShow(false);
    }, []);

    return (
      <>
        {show && (
          <ConfigureDebugger
            id={connectionId}
            name={connectionName}
            debugDate={debugDate}
            onClose={handleConfigDebuggerClose}
          />
        )}
      </>
    );
  },
};
