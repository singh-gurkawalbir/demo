import { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconTextButton from '../../IconTextButton';
import Icon from '../../../components/icons/RefreshIcon';

const useStyles = makeStyles(theme => ({
  card: {
    position: 'absolute',
    top: 0,
    textAlign: 'center',
    left: 500,
    width: 300,
    background: '#D6E4ED',
  },
  refresh: {
    color: theme.palette.primary.main,
  },
}));

export default function RefreshCard(props) {
  const classes = useStyles();
  const { onRefresh } = props;
  const handleClick = useCallback(() => {
    if (onRefresh) onRefresh();
  }, [onRefresh]);

  return (
    <div className={classes.card}>
      <IconTextButton onClick={handleClick} className={classes.refresh}>
        <Icon /> Refresh
      </IconTextButton>
      to view new errors
    </div>
  );
}
