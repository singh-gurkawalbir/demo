import React, { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import MapDataIcon from '../../../../icons/MapDataIcon';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';
import { flowSupportsMapping } from '../../../../../utils/suiteScript';
import RemoveMargin from '../RemoveMargin';

export default function MappingCell({flow}) {
  const history = useHistory();
  const location = useLocation();
  const showMapping = flowSupportsMapping(flow);
  const handleClick = useCallback(() => {
    history.push(`${location.pathname}/${flow._id}/mapping`);
  }, [location.pathname, flow._id, history]);

  if (!showMapping) return null;

  return (
    <>
      <RemoveMargin>
        <IconButtonWithTooltip
          tooltipProps={{title: 'Edit mappings', placement: 'bottom'}}
          onClick={handleClick}>
          <MapDataIcon color="secondary" />
        </IconButtonWithTooltip>
      </RemoveMargin>
    </>
  );
}
