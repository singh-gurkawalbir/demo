import React from 'react';
import ButtonGroup from '.';
import FilledButton from '../CeligoButtons/FilledButton';
// import TextButton from '../CeligoButtons/TextButton';

export default {
  title: 'CeligoTruncate',
  component: ButtonGroup,
};

const Template = args => (
  <ButtonGroup>
        {...args}
  </ButtonGroup>
);

export const ButtonGroupContainer = Template.bind({});

ButtonGroupContainer.args = {
  children: <FilledButton>Save</FilledButton>,
};
