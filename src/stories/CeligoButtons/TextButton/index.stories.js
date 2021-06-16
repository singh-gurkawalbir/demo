import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { withDesign } from 'storybook-addon-designs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { jsxDecorator } from 'storybook-addon-jsx';
// eslint-disable-next-line import/no-extraneous-dependencies
import TextButton from '../../../components/CeligoButtons/TextButton/index';
import AddIcon from '../../../components/icons/AddIcon';
import DeleteIcon from '../../../components/icons/TrashIcon';

export default {
  title: 'CeligoButtons / TextButton',
  component: TextButton,
  decorators: [withDesign, jsxDecorator],
};
const Template = args => <TextButton {...args} />;

export const defaultButton = Template.bind({});

defaultButton.args = {
  children: 'Default',
};
const designParameters = {
  design: {
    type: 'figma',
    allowFullscreen: true,
    url: 'https://www.figma.com/file/GLx3BVbon8pPYQP5AJFNeZ/Fuse-Storybook-Design-System?node-id=1%3A3',
  },
};

defaultButton.parameters = designParameters;

export const startIcon = Template.bind();

startIcon.args = {
  startIcon: <AddIcon />,
  children: 'Start icon',
};

startIcon.parameters = designParameters;
export const endIcon = Template.bind({});

endIcon.args = {
  endIcon: <DeleteIcon />,
  children: 'End Icon',
};
endIcon.parameters = designParameters;

export const small = Template.bind({});

small.args = {
  size: 'small',
  children: 'Small',
};
export const medium = Template.bind({});

medium.args = {
  size: 'medium',
  children: 'Medium',
};

medium.parameters = designParameters;
export const large = Template.bind({});

large.args = {
  size: 'large',
  children: 'Large',
};
large.parameters = designParameters;
export const disabled = Template.bind({});

export const bold = Template.bind({});

bold.args = {
  children: 'Resume',
  bold,
  color: 'primary',
};

disabled.args = {
  disabled: true,
  children: 'Disabled',
};
disabled.parameters = designParameters;

