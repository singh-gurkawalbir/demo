import React from 'react';
import { Typography, IconButton } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import ViewReferencesIcon from '../../../../icons/ViewReferencesIcon';

const useStyles = makeStyles(theme => ({
  container: {
    width: theme.spacing(11),
  },
  icon: {
    marginRight: theme.spacing(0.5),
  },
}));

export default function ViewReferences() {
  const classes = useStyles();
  const handleClick = () => {
    // console.log('clicked');
  };

  return (
    <IconButton
      size="small"
      className={classes.container}
      data-test="expandAll"
      onClick={handleClick}>
      <ViewReferencesIcon className={classes.icon} />
      <Typography variant="body2"> References</Typography>
    </IconButton>
  );
}

