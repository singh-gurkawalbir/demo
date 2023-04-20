import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { TreeItem } from '@mui/lab';

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
