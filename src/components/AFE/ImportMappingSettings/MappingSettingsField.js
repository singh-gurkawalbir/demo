import { useState, Fragment } from 'react';
import ImportMappingSettings from './';
import SettingsIcon from '../../icons/SettingsIcon';
import ActionButton from '../../ActionButton';

/**
 *
 * disabled property set to true in case of monitor level access
 */
export default function MappingSettingsField(props) {
  const {
    id,
    onSave,
    extractFields,
    generateFields,
    application,
    updateLookup,
    options,
    value,
    disabled,
    isCategoryMapping,
    lookups,
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
          value={value}
          isCategoryMapping={isCategoryMapping}
          onClose={handleClose}
          options={options}
          extractFields={extractFields}
          generateFields={generateFields}
          disabled={disabled}
          lookups={lookups}
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
