import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Help from '../../../../Help';

const useStyles = makeStyles(theme => ({
  titleContainer: {
    height: 39,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    borderBottom: `solid 1px ${theme.palette.secondary.lightest}`,
  },
  helpButton: {
    padding: 0,
    margin: 2,
  },
  error: {
    color: theme.palette.error.main,
    width: '100%',
  },
  warning: {
    color: theme.palette.warning.main,
    width: '100%',
  },
}));

export default function PanelTitle({ title, children, className, helpKey, titleColor}) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.titleContainer, className)}>
      {title ? <Typography variant="body1" component="div" className={clsx(classes[titleColor], className)}>{title}</Typography> : children}
      {helpKey && (
        <Help
          title={title}
          className={classes.helpButton}
          helpKey={helpKey}
        />
      )}
    </div>
  );
}
