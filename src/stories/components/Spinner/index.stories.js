import React from 'react';
import Typography from '@material-ui/core/Typography';
import Spinner from '../../../components/Spinner';

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
  <Spinner {...args}>
    <Typography> Loading</Typography>
  </Spinner>
);

export const Loading = Template.bind({});

export const centerAll = Template.bind({});

export const overlay = Template.bind({});

export const overlayLoading = Template.bind({});

centerAll.args = {
  centerAll: true,
  color: 'secondary',
};
overlay.args = {
  size: 'small',
  color: 'primary',
  overlay: true,
};
overlayLoading.args = {
  loading: true,
  size: 'large',
  color: 'primary',
  overlay: true,
};
