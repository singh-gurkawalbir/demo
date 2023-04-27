import React from 'react';
import { Typography } from '@mui/material';

export default {
  title: 'Branding/Typography',
  component: Typography,
  parameters: { previewTabs: { 'storybook/docs/panel': { hidden: true } } },

  argTypes: {
    variant: {
      control: {
        type: 'select',
        options: [
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'subtitle1',
          'subtitle2',
          'body1',
          'body2',
          'caption',
          'button',
          'overline',
        ],
      },
    },
    color: {
      control: {
        type: 'select',
        options: [
          'primary',
          'secondary',
          'textPrimary',
          'textSecondary',
          'error',
        ],
      },
    },
    gutterBottom: {
      control: {
        type: 'boolean',
      },
    },
    noWrap: {
      control: {
        type: 'boolean',
      },
    },
    paragraph: {
      control: {
        type: 'boolean',
      },
    },
  },
};

const Template = args => (
  <>
    <Typography {...args}>THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG</Typography>
    <Typography {...args}>the quick brown fox jumps over the lazy dog</Typography>
    <Typography {...args}>1234567890!@#$%^&amp;*()-+.?</Typography>
  </>
);

export const Body1 = Template.bind({});

Body1.args = { variant: 'body1' };

export const Body2 = Template.bind({});

Body2.args = { variant: 'body2' };

export const H1 = Template.bind({});

H1.args = { variant: 'h1' };

export const H2 = Template.bind({});

H2.args = { variant: 'h2' };

export const H3 = Template.bind({});

H3.args = { variant: 'h3' };

export const H4 = Template.bind({});

H4.args = { variant: 'h4' };

export const H5 = Template.bind({});

H5.args = { variant: 'h5' };

export const H6 = Template.bind({});

H6.args = { variant: 'h6' };

export const Subtitle1 = Template.bind({});

Subtitle1.args = { variant: 'subtitle1' };

export const Subtitle2 = Template.bind({});

Subtitle2.args = { variant: 'subtitle2' };

export const Caption = Template.bind({});

Caption.args = { variant: 'caption' };

export const Button = Template.bind({});

Button.args = { variant: 'button' };

export const Overline = Template.bind({});

Overline.args = { variant: 'overline' };
