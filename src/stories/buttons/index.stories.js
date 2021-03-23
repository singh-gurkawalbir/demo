import React from 'react';
import { Button } from '@material-ui/core';

export default {
  title: 'Buttons',
  component: Button,
  argTypes: {
    size: {
      default: 'medium',
      control: {
        type: 'select',
        options: ['small', 'medium', 'large'],
      },
    },
    variant: {
      control: {
        type: 'select',
        options: ['outlined', 'contained', 'text'],
      },
    },
    color: {
      control: {
        type: 'radio',
        options: ['primary', 'secondary'],
      },

    },
  },
};

const Template = args => <Button {...args}>Button Text</Button>;

export const Text = Template.bind({});

export const Outlined = Template.bind({});

Outlined.args = {
  variant: 'outlined',
};

export const Contained = Template.bind({});

Contained.args = {
  variant: 'contained',
};
