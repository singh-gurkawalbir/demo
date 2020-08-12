import React, { useState, useCallback } from 'react';
import MappingSettings from '.';
import SettingsIcon from '../../icons/SettingsIcon';
import ActionButton from '../../ActionButton';

/**
 *
 * disabled property set to true in case of monitor level access
 */
export default function MappingSettingsButton(props) {
  const {
    dataTest,
    value,
  } = props;
  const [showSettings, setShowSettings] = useState(false);
  const isDisabled = !('generate' in value);
  const handleBtnClick = useCallback(() => {
    if (!isDisabled) setShowSettings(!showSettings);
  }, [isDisabled, showSettings]);

  return (
    <>
      {showSettings && (
        <MappingSettings
          open={showSettings}
          onClose={handleBtnClick}
          {...props}
        />
      )}

      <ActionButton
        data-test={dataTest}
        disabled={isDisabled}
        aria-label="settings"
        onClick={handleBtnClick}
        key="settings">
        <SettingsIcon />
      </ActionButton>
    </>
  );
}
