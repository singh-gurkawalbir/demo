import React, { useCallback, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
import SaveAndCloseButtonGroup from '../../../../components/SaveAndCloseButtonGroup';

const Template = ({ status, ...rest }) => {
  const [currentStatus, setCurrentStatus] = useState(status);

  const onSave = useCallback(() => {
    action('Save Triggered!')();
    setCurrentStatus('inProgress');
    setTimeout(() => {
      setCurrentStatus('success');
      action('Changes were saved!')();
    }, 2000);
  }, []);

  const onClose = useCallback(() => {
    setCurrentStatus();
    // console.log('onClose fired');
    action('Close request fired!')();
  }, []);

  return (
    <SaveAndCloseButtonGroup
      {...rest}
      onClose={onClose}
      onSave={onSave}
      status={currentStatus} />
  );
};

export default Template;
