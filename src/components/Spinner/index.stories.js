import React from 'react';
import Typography from '@material-ui/core/Typography';
import Spinner from '.';

export default {
  title: 'Components/Spinner',
  component: Spinner,
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
        options: ['determinate', 'indeterminate', 'static'],
      },
    },
    color: {
      control: {
        type: 'radio',
        options: ['inherit', 'primary', 'secondary'],
      },
    },
  },
};

const Template = args => (
  <Spinner {...args} />
);

export const Loading = Template.bind({});

export const centerAll = Template.bind({});

centerAll.args = {
  centerAll: true,
  color: 'secondary',
  children: <Typography> Loading</Typography>,
};

