import { useCallback } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import IconTextButton from '../../IconTextButton';
import Icon from '../../../components/icons/RefreshIcon';

const useStyles = makeStyles(() => ({
  card: {
    position: 'absolute',
    top: 10,
    textAlign: 'center',
    left: 500,
    width: 300,
  },
  hide: {
    display: 'none',
  },
}));

export default function RefreshCard(props) {
  const classes = useStyles();
  const { onRefresh, className, show } = props;
  const handleClick = useCallback(() => {
    if (onRefresh) onRefresh();
  }, [onRefresh]);

  return (
    <div
      className={clsx(classes.card, {
        [className]: !!className,
        [classes.hide]: !show,
      })}>
      <IconTextButton onClick={handleClick}>
        <Icon /> Refresh
      </IconTextButton>
      to view new errors
    </div>
  );
}
