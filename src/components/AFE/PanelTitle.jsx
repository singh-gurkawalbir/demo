import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  title: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
  },
}));

export default function PanelTitle(props) {
  const { title, children, className} = props;
  const classes = useStyles(props);

  return (
    <div data-public className={clsx(classes.title, className)}>
      {title ? <Typography variant="body1" className={className}>{title}</Typography> : children}
    </div>
  );
}
