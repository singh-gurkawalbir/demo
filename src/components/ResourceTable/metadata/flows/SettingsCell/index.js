import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import SettingsIcon from '../../../../icons/SettingsIcon';
import * as selectors from '../../../../../reducers';
import RemoveMargin from '../RemoveMargin';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default function SettingsCell({flowId, name}) {
  const history = useHistory();
  const showSettings = useSelector(state =>
    selectors.flowSupportsSettings(state, flowId)
  );

  if (!showSettings) return null;

  return (
    <RemoveMargin>
      <IconButtonWithTooltip
        tooltipProps={{
          title: 'Configure settings',
          placement: 'bottom',
        }}
        // disabled={!showSettings}
        component={Link}
        data-test={`flowSettings-${name}`}
        to={`${history.location.pathname}/${flowId}/settings`}>
        <SettingsIcon />
      </IconButtonWithTooltip>
    </RemoveMargin>
  );
}
