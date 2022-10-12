import React from 'react';
import clsx from 'clsx';
import { Typography, makeStyles } from '@material-ui/core';
import InfoIconButton from '../InfoIconButton';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
  },
  infoIcon: {
    color: theme.palette.text.hint,
    marginTop: -2,
  },
  panelHeaderTitle: {
    display: 'flex',
  },
}));

export default function PanelHeader({ title, children, infoText, className, placement }) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)}>
      <Typography variant="h4" className={classes.panelHeaderTitle}>
        {title}
        {infoText && (
          <InfoIconButton info={infoText} className={classes.infoIcon} placement={placement} />
        )}
      </Typography>
      <div>{children}</div>
    </div>
  );
}

