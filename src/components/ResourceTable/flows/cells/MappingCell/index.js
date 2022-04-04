import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import MapDataIcon from '../../../../icons/MapDataIcon';
import { selectors } from '../../../../../reducers';
import RemoveMargin from '../RemoveMargin';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';
import { buildDrawerUrl, drawerPaths } from '../../../../../utils/rightDrawer';

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
      history.push(buildDrawerUrl({
        path: drawerPaths.MAPPINGS.CATEGORY_MAPPING.ROOT,
        baseUrl: history.location.pathname,
        params: { flowId, categoryId: 'commonAttributes' },
      }));
    } else {
      history.push(buildDrawerUrl({
        path: drawerPaths.MAPPINGS.IMPORT.LIST_ALL,
        baseUrl: history.location.pathname,
        params: { flowId },
      }));
    }
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
