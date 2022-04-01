import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import SettingsIcon from '../../../../icons/SettingsIcon';
import RemoveMargin from '../RemoveMargin';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';
import { DRAWER_URL_PREFIX } from '../../../../../utils/rightDrawer';

export default function SettingsCell({flowId, name, actionProps}) {
  const history = useHistory();
  const showSettings = actionProps.flowAttributes[flowId]?.supportsSettings;

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
        to={`${history.location.pathname}/${DRAWER_URL_PREFIX}/${flowId}/settings`}>
        <SettingsIcon color="secondary" />
      </IconButtonWithTooltip>
    </RemoveMargin>
  );
}
