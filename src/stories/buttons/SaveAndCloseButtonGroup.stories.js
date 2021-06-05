import React, { useCallback, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
// import { withDesign } from 'storybook-addon-designs';
import { Button } from '@material-ui/core';
import SaveAndCloseButtonGroup from '../../components/SaveAndCloseButtonGroup';

export default {
  title: 'Components/Buttons',
  component: SaveAndCloseButtonGroup,
  // decorators: [withDesign],
};

const Template = ({ isDirty, ...rest }) => {
  const [status, setStatus] = useState();
  const [dirty, setDirty] = useState(isDirty);
  const onSave = useCallback(() => {
    setStatus('inProgress');
    setTimeout(() => {
      setDirty(false);
      setStatus('success');
    }, 2000);
  }, []);
  const onClose = useCallback(() => {
    setStatus();
    setDirty(false);
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
          style={{marginTop: 24}}
          variant="outlined"
          onClick={() => setDirty(true)}>
          Make form context dirty
        </Button>
      )}
    </>
  );
};

const designParams = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/XeXHoQxESkwlENWxfRY3Jq/Fuse-Design-System%3A-Integrator.io?node-id=6005%3A72',
  },
};

export const SaveAndClose = Template.bind({});

SaveAndClose.parameters = designParams;
