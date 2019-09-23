import { Fragment, useState } from 'react';
import { IconButton } from '@material-ui/core';
import Icon from '../../../../icons/DebugIcon';
import ConfigureDebugger from '../../../../ConfigureDebugger';

export default {
  label: 'Config debugger',
  component: function ConfigDebugger({ resource }) {
    const [show, setShow] = useState(false);

    return (
      <Fragment>
        {show && (
          <ConfigureDebugger
            id={resource._id}
            name={resource.name}
            debugDate={resource.debugDate}
            onClose={() => setShow(false)}
          />
        )}
        <IconButton size="small" onClick={() => setShow(true)}>
          <Icon />
        </IconButton>
      </Fragment>
    );
  },
};
