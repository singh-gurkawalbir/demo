import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Button, Paper } from '@material-ui/core';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import RefreshIcon from '../../icons/RefreshIcon';

const useStyles = makeStyles(theme => ({
  pagingBar: {
    position: 'fixed',
    padding: theme.spacing(2),
    right: 0,
    bottom: 0,
    left: theme.spacing(7),
    textAlign: 'center',
    backgroundColor: 'white',
    borderTop: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    zIndex: theme.zIndex.appBar,
    transition: theme.transitions.create(['left'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  pagingBarShift: {
    left: theme.drawerWidth,
  },
  icon: {
    color: theme.palette.background.paper,
    marginRight: theme.spacing(1),
  },
  button: {
    borderRadius: '4px',
    marginTop: '5px',
  },
}));

export default function ShowMoreDrawer(props) {
  const { count, maxCount, filterKey, pageSize = 10 } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  // TODO: we need to pass in default filter here probably.
  // or we have hardcoded {take:5}.
  // or set filter explicitly if missing in the parent...
  const filter = useSelector(state => selectors.filter(state, filterKey)) || {
    take: pageSize,
  };
  const handleMore = () => {
    dispatch(
      actions.patchFilter(filterKey, {
        take: (filter.take || pageSize) + pageSize,
      })
    );
  };

  if (count >= maxCount) return null;

  const nextPageSize =
    count + pageSize <= maxCount ? pageSize : maxCount - count;

  return (
    <Paper
      elevation={0}
      className={clsx(classes.pagingBar, {
        [classes.pagingBarShift]: drawerOpened,
      })}>
      <Typography variant="body2">
        Viewing first {count} of {maxCount}
      </Typography>
      <Button
        data-test="showMoreResults"
        onClick={handleMore}
        variant="contained"
        size="medium"
        color="primary"
        className={classes.button}>
        <RefreshIcon className={classes.icon} />
        Load the next ({nextPageSize}) results
      </Button>
    </Paper>
  );
}
