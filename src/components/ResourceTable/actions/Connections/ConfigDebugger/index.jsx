import { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { IconButton } from '@material-ui/core';
import * as selectors from '../../../../../reducers';
import Icon from '../../../../icons/DebugIcon';
import ConfigureDebugger from '../../../../ConfigureDebugger';

export default {
  label: 'Configure debugger',
  component: function ConfigDebugger({ resource }) {
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
        <IconButton
          data-test="showConfigureDebugger"
          size="small"
          onClick={() => setShow(true)}>
          <Icon />
        </IconButton>
      </Fragment>
    );
  },
};
