import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import MapDataIcon from '../../../../../icons/MapDataIcon';
import IconButtonWithTooltip from '../../../../../IconButtonWithTooltip';
import { flowSupportsMapping } from '../../../../../../utils/suiteScript'

export default function MappingCell({flow}) {
  const history = useHistory();
  const showMapping = flowSupportsMapping(flow);
  const handleClick = useCallback(() => {
    history.push(`flows/${flow._id}/mapping`);
  }, [history, flow._id]);

  if (!showMapping) return null;

  return (
    <IconButtonWithTooltip
      tooltipProps={{title: 'Edit mappings', placement: 'bottom'}}
      onClick={handleClick}>
      <MapDataIcon />
    </IconButtonWithTooltip>
  );
}
