import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconTextButton from '../../IconTextButton';
import Icon from '../../icons/RefreshIcon';

const useStyles = makeStyles(theme => ({
  card: {
    position: 'absolute',
    top: -71,
    textAlign: 'center',
    left: 500,
  },
  refresh: {
    color: theme.palette.primary.main,
  },
}));

export default function RefreshCard(props) {
  const classes = useStyles();
  const { onRefresh, disabled } = props;
  const handleClick = useCallback(() => {
    if (onRefresh) onRefresh();
  }, [onRefresh]);

  if (disabled) {
    return (
      <div
        className={classes.card}
        title="New errors will take up to 30 seconds to display" >
        <IconTextButton onClick={handleClick} className={classes.refresh} disabled >
          <Icon /> Refresh errors
        </IconTextButton>
      </div>
    );
  }

  return (
    <div className={classes.card}>
      <IconTextButton onClick={handleClick} className={classes.refresh}>
        <Icon /> Refresh errors
      </IconTextButton>
    </div>
  );
}
