import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { withDesign } from 'storybook-addon-designs';
// import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// eslint-disable-next-line import/no-extraneous-dependencies
import { jsxDecorator } from 'storybook-addon-jsx';
// eslint-disable-next-line import/no-extraneous-dependencies
import FilledButton from '../../../components/Buttons/FilledButton/index';
import RefreshIcon from '../../../components/icons/RefreshIcon';
import DeleteIcon from '../../../components/icons/TrashIcon';

export default {
  title: 'Buttons / FilledButton',
  component: FilledButton,
  decorators: [withDesign, jsxDecorator],
  argTypes: {
    size: {
      control: { type: 'select' },
    },
  },
};
const Template = args => <FilledButton {...args} />;

export const defaultButton = Template.bind({});

const designParameters = {
  design: {
    type: 'figma',
    allowFullscreen: true,
    url: 'https://www.figma.com/file/GLx3BVbon8pPYQP5AJFNeZ/Fuse-Storybook-Design-System?node-id=1%3A3',
  },
};

defaultButton.args = {
  children: 'Default Button',

};
defaultButton.parameters = designParameters;

export const startIcon = Template.bind();

startIcon.args = {
  startIcon: <RefreshIcon />,
  children: 'Load more',
};

startIcon.parameters = designParameters;
export const endIcon = Template.bind({});

endIcon.args = {
  endIcon: <DeleteIcon />,
  children: 'End Icon',
};
endIcon.parameters = designParameters;
export const errorButton = Template.bind({});

errorButton.args = {
  error: true,
  children: 'Error',
};

errorButton.parameters = designParameters;
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

disabled.args = {
  disabled: true,
  children: 'Disabled',
};
disabled.parameters = designParameters;

