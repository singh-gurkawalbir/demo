import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconTextButton from '../../../IconTextButton';
import Icon from '../../../icons/RefreshIcon';

const useStyles = makeStyles(theme => ({
  refresh: {
    color: `${theme.palette.common.white} !important`,
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
      <div title="New errors will take up to 30 seconds to display" >
        <IconTextButton
          onClick={handleClick} color="primary" variant="outlined"
          disabled className={classes.refreshDisabled}>
          <Icon /> Refresh errors
        </IconTextButton>
      </div>
    );
  }

  return (
    <IconTextButton onClick={handleClick} color="primary" variant="outlined" className={classes.refresh}>
      <Icon /> Refresh errors
    </IconTextButton>
  );
}
