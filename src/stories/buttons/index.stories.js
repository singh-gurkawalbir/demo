import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { withDesign } from 'storybook-addon-designs';
import { Button } from '@material-ui/core';

export default {
  title: 'Components/Buttons',
  component: Button,
  decorators: [withDesign],
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
// See: https://pocka.github.io/storybook-addon-designs/?path=/docs/docs-quick-start--page
// for more documentation.
const designParams = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/GLx3BVbon8pPYQP5AJFNeZ/Fuse-%2B-Storybook-Design-System?node-id=1%3A3',
  },
};

export const Text = Template.bind({});

Text.parameters = designParams;

export const Outlined = Template.bind({});

Outlined.parameters = designParams;
Outlined.args = { variant: 'outlined' };

export const Contained = Template.bind({});

Contained.parameters = designParams;
Contained.args = { variant: 'contained' };
