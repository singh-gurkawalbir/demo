import React from 'react';
import { makeStyles } from '@material-ui/core';
import { TreeItem } from '@material-ui/lab';

const useStyles = makeStyles({
  label:
  {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

export default function OverflowTreeItem(props) {
  const classes = useStyles();

  return <TreeItem {...props} classes={{label: classes.label}} />;
}
