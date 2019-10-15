import { useState, Fragment } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ImportMappingSettings from './';

const SettingsIcon = require('../../../components/icons/SettingsIcon').default;

export default function MappingSettingsField(props) {
  const {
    id,
    onSave,
    connectionId,
    extractFields,
    generateFields,
    lookup,
    application,
    updateLookup,
    recordType,
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
          connectionId={connectionId}
          title="Settings"
          lookup={lookup}
          value={value}
          onClose={handleClose}
          recordType={recordType}
          extractFields={extractFields}
          generateFields={generateFields}
        />
      )}
      <IconButton
        data-test="toggleImportMappingSettings"
        disabled={isDisabled}
        aria-label="delete"
        onClick={handleBtnClick}
        key="settings">
        <SettingsIcon />
      </IconButton>
    </Fragment>
  );
}
