import { Fragment, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import * as selectors from '../../../../../reducers';
import ConfigureDebugger from '../../../../ConfigureDebugger';
import DebugIcon from '../../../../icons/DebugIcon';

export default {
  title: 'Configure debugger',
  icon: DebugIcon,
  component: function ConfigDebugger({ resource }) {
    const { _id: connectionId, name: connectionName, debugDate } = resource;
    const [show, setShow] = useState(true);
    const canAccess = useSelector(
      state =>
        selectors.resourcePermissions(state, 'connections', connectionId).edit
    );
    const handleConfigDebuggerClose = useCallback(() => {
      setShow(false);
    }, []);

    if (!canAccess) {
      return null;
    }

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
