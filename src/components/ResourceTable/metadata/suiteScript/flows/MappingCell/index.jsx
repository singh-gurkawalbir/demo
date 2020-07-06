import React, { useCallback } from 'react';
import { useHistory, useRouteMatch, useLocation } from 'react-router-dom';
import MapDataIcon from '../../../../../icons/MapDataIcon';
import IconButtonWithTooltip from '../../../../../IconButtonWithTooltip';
import { flowSupportsMapping } from '../../../../../../utils/suiteScript';
import SuiteScriptMappingDrawer from '../../../../../../views/SuiteScript/Mappings/Drawer';

export default function MappingCell({flow}) {
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();
  const { ssLinkedConnectionId, integrationId } = match.params;
  const showMapping = flowSupportsMapping(flow);
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
        ssLinkedConnectionId={ssLinkedConnectionId}
        integrationId={integrationId}
        flowId={flow._id}
        />
    </>
  );
}
