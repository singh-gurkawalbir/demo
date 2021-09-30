import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import MapDataIcon from '../../../../icons/MapDataIcon';
import { selectors } from '../../../../../reducers';
import RemoveMargin from '../RemoveMargin';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default function MappingCell({ flowId, childId }) {
  const history = useHistory();
  const showMapping = useSelector(state =>
    selectors.flowSupportsMapping(state, flowId, childId)
  );
  const showUtilityMapping = useSelector(state =>
    selectors.flowUsesUtilityMapping(state, flowId, childId)
  );
  const handleClick = useCallback(() => {
    if (showUtilityMapping) {
      history.push(
        `${history.location.pathname}/${flowId}/utilityMapping/commonAttributes`
      );
    } else history.push(`${history.location.pathname}/mapping/${flowId}`);
  }, [history, showUtilityMapping, flowId]);

  if (!showMapping) return null;

  return (
    <RemoveMargin>
      <IconButtonWithTooltip
        tooltipProps={{title: 'Edit mappings', placement: 'bottom'}}
        onClick={handleClick}>
        <MapDataIcon color="secondary" />
      </IconButtonWithTooltip>
    </RemoveMargin>
  );
}
