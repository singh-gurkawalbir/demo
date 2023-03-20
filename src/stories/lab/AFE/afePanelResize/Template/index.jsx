import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import ResizeProto from '../Prototype';

const useStyles = makeStyles(() => ({
  content: {
    height: 'calc(100vh - 32px)',
  },
}));

export default function Template(props) {
  const classes = useStyles();

  return (
    <div className={classes.content}>
      <ResizeProto {...props} />
    </div>
  );
}
