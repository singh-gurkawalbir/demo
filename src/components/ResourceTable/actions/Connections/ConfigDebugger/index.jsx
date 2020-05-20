import { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import * as selectors from '../../../../../reducers';
import Icon from '../../../../icons/DebugIcon';
import ConfigureDebugger from '../../../../ConfigureDebugger';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default {
  label: 'Configure debugger',
  component: function ConfigDebugger({ tooltipLabel, resource }) {
    const { _id: connectionId, name: connectionName, debugDate } = resource;
    const [show, setShow] = useState(false);
    const canAccess = useSelector(
      state =>
        selectors.resourcePermissions(state, 'connections', connectionId).edit
    );

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
            onClose={() => setShow(false)}
          />
        )}
        <IconButtonWithTooltip
          tooltipProps={{
            label: tooltipLabel,
          }}
          data-test="showConfigureDebugger"
          size="small"
          onClick={() => setShow(true)}>
          <Icon />
        </IconButtonWithTooltip>
      </Fragment>
    );
  },
};
