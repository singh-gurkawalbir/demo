import clsx from 'clsx';
import React from 'react';
import { makeStyles } from '@material-ui/core';
import TitleTypography from '../../../TitleTypography';
import AddButton from '../AddButton';
import { useFlowContext } from '../../Context';

const useStyles = makeStyles(theme => ({
  titlePosition: {
    position: 'absolute',
    zIndex: 5,
    padding: theme.spacing(4, 2, 3),
  },
  content: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
}));

export default function Title({onClick, children, className}) {
  const classes = useStyles();
  const { flow } = useFlowContext();
  const isReadOnly = !!flow._connectorId;

  return (
    <TitleTypography className={clsx(classes.titlePosition, className)}>
      <div className={classes.content}>
        {children}
        {!isReadOnly && <AddButton onClick={onClick} />}
      </div>
    </TitleTypography>
  );
}
