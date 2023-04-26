import React from 'react';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
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
  titleWrapper: {
    width: '100%',
  },
  error: {
    color: theme.palette.error.main,
  },
  warning: {
    color: theme.palette.warning.main,
  },
}));

export default function PanelTitle({ title, children, className, helpKey, titleColor}) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.titleContainer, className)}>
      {title ? (
        <Typography variant="body1" component="div" className={clsx(classes[titleColor], classes.titleWrapper, className)}>
          {title}
          {helpKey && (
          <Help
            title={title}
            helpKey={helpKey}
            sx={{margin: 0.5}}
        />
          )}
        </Typography>
      ) : children}
    </div>
  );
}
