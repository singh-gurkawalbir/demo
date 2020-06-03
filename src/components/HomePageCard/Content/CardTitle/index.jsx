import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  root: {
    paddingBottom: 5,
    minHeight: 55,
  },
});

function CardTitle(props) {
  const classes = useStyles();
  const { children } = props;

  return <div className={classes.root}>{children}</div>;
}

export default CardTitle;
