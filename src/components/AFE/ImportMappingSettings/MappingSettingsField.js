import { useState, Fragment } from 'react';
import ImportMappingSettings from './';
import SettingsIcon from '../../icons/SettingsIcon';
import ActionButton from '../../ActionButton';

export default function MappingSettingsField(props) {
  const {
    id,
    onSave,
    extractFields,
    generateFields,
    lookup,
    application,
    updateLookup,
    options,
    value,
    disabled,
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
          application={application}
          open={showSettings}
          updateLookup={updateLookup}
          title="Settings"
          lookup={lookup}
          value={value}
          onClose={handleClose}
          options={options}
          extractFields={extractFields}
          generateFields={generateFields}
          disabled={disabled}
        />
      )}

      <ActionButton
        data-test={id}
        disabled={isDisabled}
        aria-label="settings"
        onClick={handleBtnClick}
        key="settings">
        <SettingsIcon />
      </ActionButton>
    </Fragment>
  );
}
