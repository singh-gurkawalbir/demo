import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  wrapper: {
    margin: '0px',
    padding: '0px',
    display: 'inline-flex',
    '& Button': {
      marginRight: '10px',
    },
    '& Button:last-child': {
      marginRight: '0px',
    },
  },
});

function ButtonGroup(props) {
  const classes = useStyles();

  return <div className={classes.wrapper}>{props.children}</div>;
}

export default ButtonGroup;
