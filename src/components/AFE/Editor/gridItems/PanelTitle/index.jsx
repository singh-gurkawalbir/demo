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
    justifyContent: 'space-between',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    // color: theme.palette.text.main,
    borderBottom: 'solid 1px rgb(0,0,0,0.3)',
  },
  helpButton: {
    padding: 0,
    margin: -1,
  },
  titleText: {
    marginBottom: -2,
  },
}));

export default function PanelTitle({ title, children, className, helpKey}) {
  const classes = useStyles();

  return (
    <div data-public className={clsx(classes.titleContainer, className)}>
      {title ? <Typography variant="body1" component="div" className={clsx(classes.titleText, className)}>{title}</Typography> : children}
      {helpKey && (
        <Help
          title={helpKey}
          className={classes.helpButton}
          helpKey={helpKey}
        />
      )}
    </div>
  );
}
