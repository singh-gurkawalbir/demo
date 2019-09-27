import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Paper } from '@material-ui/core';
import * as selectors from '../../../reducers';
import actions from '../../../actions';

const useStyles = makeStyles(theme => ({
  pagingBar: {
    position: 'fixed',
    padding: theme.spacing(2),
    right: 0,
    bottom: 0,
    left: theme.spacing(7),
    textAlign: 'center',
    zIndex: theme.zIndex.appBar,
    transition: theme.transitions.create(['left'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  pagingBarShift: {
    left: theme.drawerWidth,
  },
}));

export default function ShowMoreDrawer(props) {
  const { count, maxCount, filterKey } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  // TODO: we need to pass in default filter here probably..ow we have hardcoded {take:5}.
  // or set filter explicitly if missing in the parent...
  // n
  const filter = useSelector(state => selectors.filter(state, filterKey)) || {
    take: 5,
  };
  const handleMore = () => {
    dispatch(actions.patchFilter(filterKey, { take: (filter.take || 3) + 2 }));
  };

  if (count >= maxCount) return null;

  return (
    <Paper
      elevation={10}
      className={clsx(classes.pagingBar, {
        [classes.pagingBarShift]: drawerOpened,
      })}>
      <Button
        onClick={handleMore}
        variant="text"
        size="medium"
        color="primary"
        className={classes.button}>
        Show more results ({maxCount - count} left)
      </Button>
    </Paper>
  );
}
