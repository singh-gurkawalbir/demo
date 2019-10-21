import { IconButton } from '@material-ui/core';
import { useState, Fragment } from 'react';
import SettingsIcon from '../../../../components/icons/SettingsIcon';
import IntegrationAppFlowSettingsDialog from '../../../../components/IntegrationAppFlowSettings';

export default function FlowSettings({ resource, settings, storeId }) {
  const [showDialog, setShowDialog] = useState(false);
  const flowSettings = {};
  let disable = false;

  if (settings.settings) {
    flowSettings.fields = settings.settings;
  } else if (settings.sections) {
    flowSettings.sections = settings.sections;
  } else {
    disable = true;
  }

  const handleClose = () => {
    setShowDialog(false);
  };

  return (
    <Fragment>
      {showDialog && (
        <IntegrationAppFlowSettingsDialog
          resource={resource}
          settings={flowSettings}
          storeId={storeId}
          integrationId={resource._integrationId}
          onClose={handleClose}
        />
      )}
      <IconButton
        data-test="flowSettings"
        disabled={disable}
        size="small"
        onClick={() => {
          setShowDialog(!showDialog);
        }}>
        <SettingsIcon />
      </IconButton>
    </Fragment>
  );
}
