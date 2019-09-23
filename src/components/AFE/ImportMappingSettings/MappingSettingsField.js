import { useState, Fragment } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ImportMappingSettings from './';

const SettingsIcon = require('../../../components/icons/SettingsIcon').default;

export default function MappingSettingsField(props) {
  const {
    id,
    onSave,
    extractFields,
    lookup,
    application,
    updateLookup,
    value,
  } = props;
  const [showSettings, setShowSettings] = useState(false);
  const isDisabled = !('generate' in value);
  const handleBtnClick = () => {
    if (!isDisabled) setShowSettings(!showSettings);
  };

  const handleClose = (shouldCommit, settings) => {
    if (shouldCommit) {
      onSave(id, settings);
    }

    handleBtnClick();
  };

  return (
    <Fragment>
      {showSettings && (
        <ImportMappingSettings
          id={id}
          application={application}
          updateLookup={updateLookup}
          title="Settings"
          lookup={lookup}
          value={value}
          onClose={handleClose}
          extractFields={extractFields}
        />
      )}
      <IconButton
        disabled={isDisabled}
        aria-label="delete"
        onClick={handleBtnClick}
        key="settings">
        <SettingsIcon />
      </IconButton>
    </Fragment>
  );
}
