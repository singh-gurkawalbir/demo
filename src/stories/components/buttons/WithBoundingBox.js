import React from 'react';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  wrapper: {
    margin: '10px',
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      marginRight: theme.spacing(1),
    },
  },
}));
export default function WithBoundingBox(Story, context) {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <Story {...context} />
    </div>
  );
}
