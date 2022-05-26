import React, { useCallback } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useDispatch } from 'react-redux';
import Help from '../../../../Help';
import RefreshIcon from '../../../../icons/RefreshIcon';

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

export default function PanelTitle({ title, children, className, helpKey, titleColor, refreshAction}) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleRefreshClick = useCallback(() => {
    dispatch(refreshAction);
  }, [dispatch, refreshAction]);

  return (
    <div className={clsx(classes.titleContainer, className)}>
      {title ? <Typography variant="body1" component="div" className={clsx(classes[titleColor], classes.titleWrapper, className)}>{title}</Typography> : children}
      {helpKey && (
        <Help
          title={title}
          className={classes.helpButton}
          helpKey={helpKey}
        />
      )}
      {refreshAction && (
        <RefreshIcon
          onClick={handleRefreshClick}
        />
      )}
    </div>
  );
}
