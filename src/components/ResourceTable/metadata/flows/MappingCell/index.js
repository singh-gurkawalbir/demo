import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import MapDataIcon from '../../../../icons/MapDataIcon';
import * as selectors from '../../../../../reducers';
import RemoveMargin from '../RemoveMargin';

export default function MappingCell({flowId}) {
  const history = useHistory();
  const showMapping = useSelector(state =>
    selectors.flowSupportsMapping(state, flowId)
  );
  const showUtilityMapping = useSelector(state =>
    selectors.flowUsesUtilityMapping(state, flowId)
  );
  const handleClick = useCallback(() => {
    if (showUtilityMapping) {
      history.push(
        `${history.location.pathname}/${flowId}/utilityMapping/commonAttributes`
      );
    } else history.push(`${history.location.pathname}/${flowId}/mapping`);
  }, [history, showUtilityMapping, flowId]);

  if (!showMapping) return null;

  return (
    <RemoveMargin>
      <IconButton onClick={handleClick}>
        <MapDataIcon />
      </IconButton>
    </RemoveMargin>
  );
}
