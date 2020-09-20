import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconTextButton from '../../../IconTextButton';
import Icon from '../../../icons/RefreshIcon';

const useStyles = makeStyles(theme => ({
  card: {
    position: 'absolute',
    top: 0,
    textAlign: 'center',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  refresh: {
    color: `${theme.palette.common.white} !important`,
    borderRadius: 0,
  },
  refreshDisabled: {
    borderRadius: 0,
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
        <IconTextButton
          onClick={handleClick} color="secondary" variant="outlined" className={classes.refreshDisabled}
          disabled>
          <Icon /> Refresh errors
        </IconTextButton>
      </div>
    );
  }

  return (
    <div className={classes.card}>
      <IconTextButton onClick={handleClick} color="primary" variant="outlined" className={classes.refresh}>
        <Icon /> Refresh errors
      </IconTextButton>
    </div>
  );
}
