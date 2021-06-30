import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { withDesign } from 'storybook-addon-designs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { jsxDecorator } from 'storybook-addon-jsx';
// eslint-disable-next-line import/no-extraneous-dependencies
import PillButton from '../../../components/Buttons/PillButton/index';
import RefreshIcon from '../../../components/icons/RefreshIcon';
import DeleteIcon from '../../../components/icons/TrashIcon';

export default {
  title: 'Components / Buttons / PillButton',
  component: PillButton,
  decorators: [withDesign, jsxDecorator],
};
const Template = args => <PillButton {...args} />;

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

export const primary = Template.bind({});

primary.args = {
  color: 'primary',
  children: 'Primary',
};
export const startIcon = Template.bind();

startIcon.args = {
  startIcon: <RefreshIcon />,
  children: 'Refresh',
};

startIcon.parameters = designParameters;
export const endIcon = Template.bind({});

endIcon.args = {
  endIcon: <DeleteIcon />,
  children: 'Refresh',
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

export const fill = Template.bind({});

fill.args = {
  size: 'small',
  fill,
  children: 'Fill',
};
large.parameters = designParameters;
export const disabled = Template.bind({});

disabled.args = {
  disabled: true,
  children: 'Disabled',
};
disabled.parameters = designParameters;

