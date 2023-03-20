import React from 'react';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  container: {
    border: `solid 1px ${theme.palette.secondary.lightest}`,
    padding: 2,
    width: 160,
  },
}));

export default function WithBoundingBox(Story, context) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Story {...context} />
    </div>
  );
}
