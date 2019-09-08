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

function ButtonsGroup(props) {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.wrapper}>{props.children}</div>
    </div>
  );
}

export default ButtonsGroup;
