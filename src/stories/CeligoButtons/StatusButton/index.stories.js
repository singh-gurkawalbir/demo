import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { withDesign } from 'storybook-addon-designs';
// import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// eslint-disable-next-line import/no-extraneous-dependencies
import { jsxDecorator } from 'storybook-addon-jsx';
// eslint-disable-next-line import/no-extraneous-dependencies
import StatusButton from '../../../components/CeligoButtons/StatusButton/index';

export default {
  title: 'CeligoButtons / StatusButton',
  component: StatusButton,
  decorators: [withDesign, jsxDecorator],
  argTypes: {
    size: {
      control: { type: 'select' },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
    },
  },
};
const Template = args => <StatusButton {...args} />;

export const defaultButton = Template.bind({});

const designParameters = {
  design: {
    type: 'figma',
    allowFullscreen: true,
    url: 'https://www.figma.com/file/GLx3BVbon8pPYQP5AJFNeZ/Fuse-Storybook-Design-System?node-id=1%3A3',
  },
};

defaultButton.args = {
  children: 'Success',
  variant: 'success',

};
defaultButton.parameters = designParameters;

export const errorButton = Template.bind({});

errorButton.args = {
  variant: 'error',
  children: '118 errors',
};
errorButton.parameters = designParameters;

export const warning = Template.bind({});

warning.args = {
  children: 'Continue setup',
  variant: 'warning',
};
warning.parameters = designParameters;

export const disabled = Template.bind({});

disabled.args = {
  disabled: true,
  children: 'Disabled',
};
disabled.parameters = designParameters;

