/* eslint-disable import/no-extraneous-dependencies */

import React, { useCallback, useState } from 'react';
// import { withDesign } from 'storybook-addon-designs';
import { action } from '@storybook/addon-actions';
import { Button } from '@material-ui/core';
import SaveAndCloseButtonGroup from '../../../../components/SaveAndCloseButtonGroup';

const Template = ({ isDirty, ...rest }) => {
  const [status, setStatus] = useState();
  const [dirty, setDirty] = useState(isDirty);

  const onSave = useCallback(() => {
    setStatus('inProgress');
    setTimeout(() => {
      setDirty(false);
      setStatus('success');
      action('Changes were saved!');
    }, 2000);
  }, []);

  const onClose = useCallback(() => {
    setStatus();
    setDirty(false);
    // console.log('onClose fired');
    action('Close request fired!');
  }, []);

  return (
    <>
      <SaveAndCloseButtonGroup
        {...rest}
        isDirty={dirty}
        onClose={onClose}
        onSave={onSave}
        status={status} />

      {!dirty && (
        <Button
          style={{marginTop: 48}}
          variant="outlined"
          onClick={() => setDirty(true)}>
          Make the button context dirty
        </Button>
      )}
    </>
  );
};

export default Template;
