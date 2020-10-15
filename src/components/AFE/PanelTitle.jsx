import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  title: {
    paddingLeft: theme.spacing(1),
    backgroundColor: theme.palette.background.paper2,
    // color: theme.palette.text.main,
    borderBottom: 'solid 1px rgb(0,0,0,0.3)',
  },
}));

export default function PanelTitle(props) {
  const { title, children, className} = props;
  const classes = useStyles(props);

  return (
    <div className={clsx(classes.title, className)}>
      {title ? <Typography variant="body1" className={className}>{title}</Typography> : children}
    </div>
  );
}
