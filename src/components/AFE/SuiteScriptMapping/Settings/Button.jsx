import React, { useState, useCallback } from 'react';
import SettingsIcon from '../../../icons/SettingsIcon';
import ActionButton from '../../../ActionButton';
import MappingSettings from '.';
/**
 *
 * disabled property set to true in case of monitor level access
 */
export default function MappingSettingsButton(props) {
  const {
    id,
    onSave,
    updateLookup,
    value,
    disabled,
    ssLinkedConnectionId,
    integrationId,
    flowId,
  } = props;
  const [showSettings, setShowSettings] = useState(false);
  const isDisabled = !('generate' in value);
  const handleBtnClick = useCallback(() => {
    if (!isDisabled) setShowSettings(!showSettings);
  }, [isDisabled, showSettings]);

  const handleClose = useCallback((shouldCommit, settings) => {
    if (shouldCommit) {
      onSave(id, settings);
    }

    handleBtnClick();
  }, [handleBtnClick, id, onSave]);

  return (
    <>
      {showSettings && (
        <MappingSettings
          open={showSettings}
          updateLookup={updateLookup}
          title="Settings"
          value={value}
          onClose={handleClose}
          disabled={disabled}
          ssLinkedConnectionId={ssLinkedConnectionId}
          integrationId={integrationId}
          flowId={flowId}
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
