import clsx from 'clsx';
import React from 'react';
import { makeStyles } from '@material-ui/core';
import TitleTypography from '../../../../../views/FlowBuilder/TitleTypography';
import AddButton from './AddButton';

const useStyles = makeStyles(theme => ({
  title: {
    position: 'absolute',
    top: 20,
    left: ({xOffset}) => xOffset,
    zIndex: 5,
    padding: theme.spacing(1, 2),
    borderRadius: theme.spacing(4),
  },
}));

export default function Title({onClick, children, className}) {
  const classes = useStyles();

  return (
    <TitleTypography className={clsx(classes.title, className)}>
      {children}
      <AddButton onClick={onClick} />
    </TitleTypography>
  );
}
