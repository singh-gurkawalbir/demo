import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Spinner from '.';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2),
  },

}));
export default {
  title: 'Spinner',
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

const Template = args => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Spinner {...args}>Loading</Spinner>
    </div>
  );
};

export const Loading = Template.bind({});

Loading.args = {
  color: 'primary',
  size: 'large',
};

export const centerAll = Template.bind({});

centerAll.args = {
  centerAll: true,
};

