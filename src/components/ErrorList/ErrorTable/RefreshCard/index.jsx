import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '../../../icons/RefreshIcon';
import { TextButton } from '../../../Buttons';

const useStyles = makeStyles(theme => ({
  refresh: {
    height: theme.spacing(4),
  },
  refreshDisabled: {
    borderColor: 'inherit',
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
        <TextButton
          startIcon={<Icon />}
          onClick={handleClick}
          disabled className={classes.refreshDisabled}>
          Refresh errors
        </TextButton>
      </div>
    );
  }

  return (
    <div className={classes.card}>
      <TextButton startIcon={<Icon />} onClick={handleClick} className={classes.refresh}>
        Refresh errors
      </TextButton>
    </div>
  );
}
