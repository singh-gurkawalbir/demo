import React from 'react';
import {makeStyles} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import ActionGroup from '../../components/ActionGroup';
import FilledButton from '../../components/Buttons/FilledButton';
import OutliniedButton from '../../components/Buttons/OutlinedButton';

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

export const Defaults = () => {
  const classes = useStyles();

  return (

    <ActionGroup className={classes.root}>
      <FilledButton>Save</FilledButton>
      <OutliniedButton>Save & Close</OutliniedButton>
    </ActionGroup>

  );
};

export const RightPosition = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.root} variant="outlined">
      <ActionGroup position="right">
        <FilledButton>Save</FilledButton>
        <OutliniedButton>Save & Close</OutliniedButton>
      </ActionGroup>
    </Paper>
  );
};

export const FooterDrawer = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ActionGroup >
        <FilledButton>Save</FilledButton>
        <OutliniedButton>Save & Close</OutliniedButton>
      </ActionGroup>
      <ActionGroup className={classes.root} position="right">
        <FilledButton>Save</FilledButton>
        <OutliniedButton>Save & Close</OutliniedButton>
      </ActionGroup>
    </div>
  );
};
