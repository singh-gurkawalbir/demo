import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  wrapper: {
    listStyle: 'none',
    margin: '0px',
    padding: '0px',
    '& Button': {
      marginRight: '10px',
    },
    '& lastChild': {
      marginRight: '0px',
      background: '#000',
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
