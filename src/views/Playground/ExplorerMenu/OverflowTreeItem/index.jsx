import React from 'react';
import { makeStyles } from '@material-ui/core';
import { TreeItem } from '@material-ui/lab';

const useStyles = makeStyles({
  label: {
    width: '100%',
    whiteSpace: 'normal',
  },
});

export default function OverflowTreeItem(props) {
  const classes = useStyles();

  return <TreeItem {...props} classes={{label: classes.label}} />;
}
