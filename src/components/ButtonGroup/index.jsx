import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = {
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
};

function ButtonsGroup(props) {
  const { classes } = props;

  return (
    <div>
      <div className={classes.wrapper}>{props.children}</div>
    </div>
  );
}

export default withStyles(styles)(ButtonsGroup);
