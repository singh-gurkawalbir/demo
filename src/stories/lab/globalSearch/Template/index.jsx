// import { Paper } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core';
import GlobalSearchProto from '../Prototype';

const useStyles = makeStyles(() => ({
  templateRoot: {
    display: 'flex',
    justifyContent: 'space-around',
  },
}));

export default function Template(args) {
  const classes = useStyles();

  return (
    <div className={classes.templateRoot}>
      <GlobalSearchProto {...args} />
    </div>
  );
}
