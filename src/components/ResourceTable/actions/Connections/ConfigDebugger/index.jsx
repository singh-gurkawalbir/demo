import { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import * as selectors from '../../../../../reducers';
import Icon from '../../../../icons/DebugIcon';
import ConfigureDebugger from '../../../../ConfigureDebugger';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default {
  component: function ConfigDebugger({ resource }) {
    const { _id: connectionId, name: connectionName, debugDate } = resource;
    const [show, setShow] = useState(false);
    const canAccess = useSelector(
      state =>
        selectors.resourcePermissions(state, 'connections', connectionId).edit
    );
    const showConfigDebugger = () => {
      setShow(true);
    };

    const handleConfigDebuggerClose = () => {
      setShow(false);
    };

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
        <IconButtonWithTooltip
          tooltipProps={{
            title: 'Configure debugger',
          }}
          data-test="showConfigureDebugger"
          size="small"
          onClick={showConfigDebugger}>
          <Icon />
        </IconButtonWithTooltip>
      </Fragment>
    );
  },
};
