import { Fragment, useState, useCallback } from 'react';
import * as selectors from '../../../../../reducers';
import ConfigureDebugger from '../../../../ConfigureDebugger';
import DebugIcon from '../../../../icons/DebugIcon';

export default {
  label: 'Configure debugger',
  icon: DebugIcon,
  hasAccess: ({ state, resource }) => {
    const { _id: connectionId } = resource;
    const hasAccess = selectors.resourcePermissions(
      state,
      'connections',
      connectionId
    ).edit;

    return hasAccess;
  },
  component: function ConfigDebugger({ resource }) {
    const { _id: connectionId, name: connectionName, debugDate } = resource;
    const [show, setShow] = useState(true);
    const handleConfigDebuggerClose = useCallback(() => {
      setShow(false);
    }, []);

    return (
      <Fragment>
        {show && (
          <ConfigureDebugger
            id={connectionId}
            name={connectionName}
            debugDate={debugDate}
            onClose={handleConfigDebuggerClose}
          />
        )}
      </Fragment>
    );
  },
};
