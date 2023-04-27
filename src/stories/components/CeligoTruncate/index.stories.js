import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Typography } from '@mui/material';
import CeligoTruncate from '../../../components/CeligoTruncate';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(4),
  },
  container: {
    // backgroundColor: theme.palette.background.paper,
    border: `solid 1px ${theme.palette.secondary.lightest}`,
    padding: 2,
    marginBottom: theme.spacing(1),
    width: 160,
  },
}));

export default {
  title: 'Components / CeligoTruncate',
  component: CeligoTruncate,
};

const Template = args => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Typography>
          <CeligoTruncate {...args}>This is short text</CeligoTruncate>
        </Typography>
      </div>
      <div className={classes.container}>
        <Typography>
          <CeligoTruncate {...args}>
            This is long text that should get truncated and a tooltip should display the full text.
            If it does not get truncated or the tooltip doesn&apos;t show up, we have a bug!
          </CeligoTruncate>
        </Typography>
      </div>
    </div>
  );
};

export const Defaults = Template.bind({});

export const TwoLines = Template.bind({});

TwoLines.args = {
  lines: 2,
  delay: 1000,
  placement: 'bottom',
  ellipsis: ' (more)',
};
