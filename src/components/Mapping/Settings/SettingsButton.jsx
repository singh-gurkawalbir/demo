import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import MappingSettings from '.';
import SettingsIcon from '../../icons/SettingsIcon';
import ActionButton from '../../ActionButton';
import {selectors} from '../../../reducers';
import { emptyObject } from '../../../utils/constants';

/**
 *
 * disabled property set to true in case of monitor level access
 */
export default function MappingSettingsButton(props) {
  const {
    dataTest,
    mappingKey,
  } = props;
  const [showSettings, setShowSettings] = useState(false);
  const isDisabled = useSelector(state => {
    const { mappings} = selectors.mapping(state);

    const value = mappings.find(({key}) => key === mappingKey) || emptyObject;

    return !('generate' in value);
  });
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
