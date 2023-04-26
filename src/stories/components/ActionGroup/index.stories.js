import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import ActionGroup from '../../../components/ActionGroup';

const useStyles = makeStyles({
  root: {
    padding: 10,
    display: 'flex',
    maxWidth: 720,
  },
});

export default {
  title: 'components / ActionGroup',
  component: ActionGroup,
};
const Template = args => {
  const classes = useStyles();

  return (
    <ActionGroup className={classes.root} {...args} />
  );
};

export const Defaults = Template.bind({});

Defaults.args = {
  position: 'left',
};

