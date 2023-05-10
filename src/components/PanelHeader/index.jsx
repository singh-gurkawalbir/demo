import React from 'react';
import clsx from 'clsx';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import InfoIconButton from '../InfoIconButton';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
  },
  infoIcon: {
    color: theme.palette.text.hint,
  },
  panelHeaderTitle: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export default function PanelHeader({ title, children, infoText, className, placement, contentId }) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)}>
      <Typography variant="h4" className={classes.panelHeaderTitle}>
        {title}
        {infoText && (
          <InfoIconButton
            info={infoText} className={classes.infoIcon} placement={placement} title={title}
            contentId={contentId} />
        )}
      </Typography>
      <div>{children}</div>
    </div>
  );
}

