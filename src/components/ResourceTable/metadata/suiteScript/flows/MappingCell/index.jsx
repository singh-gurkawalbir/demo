import React, { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import MapDataIcon from '../../../../../icons/MapDataIcon';
import IconButtonWithTooltip from '../../../../../IconButtonWithTooltip';
import { flowSupportsMapping } from '../../../../../../utils/suiteScript';
import SuiteScriptMappingDrawer from '../../../../../AFE/SuiteScriptMapping/Drawer';

export default function MappingCell({flow}) {
  const history = useHistory();
  const location = useLocation();
  const showMapping = flowSupportsMapping(flow);
  const handleClose = useCallback(
    () => {
      history.pop();
    },
    [history],
  );
  const handleClick = useCallback(() => {
    history.push(`${location.pathname}/${flow._id}/mapping`);
  }, [location.pathname, flow._id, history]);

  if (!showMapping) return null;

  return (
    <>
      <IconButtonWithTooltip
        tooltipProps={{title: 'Edit mappings', placement: 'bottom'}}
        onClick={handleClick}>
        <MapDataIcon />
      </IconButtonWithTooltip>
      <SuiteScriptMappingDrawer
        onClose={handleClose}
        />
    </>
  );
}
