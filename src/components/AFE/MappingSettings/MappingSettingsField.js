import React, { useState, useCallback } from 'react';
import ImportMappingSettings from '.';
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
    value,
  } = props;
  const [showSettings, setShowSettings] = useState(false);
  const isDisabled = !('generate' in value);
  const handleBtnClick = useCallback(() => {
    if (!isDisabled) setShowSettings(!showSettings);
  }, [isDisabled, showSettings]);

  const handleSave = useCallback(
    settings => {
      onSave(id, settings);
    },
    [id, onSave],
  );

  return (
    <>
      {showSettings && (
        <ImportMappingSettings
          open={showSettings}
          title="Settings"
          onClose={handleBtnClick}
          onSave={handleSave}
          {...props}
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
    </>
  );
}
