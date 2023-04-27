import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import RefreshIcon from '../../icons/RefreshIcon';
import { FilledButton } from '../../Buttons/index';

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
  button: {
    marginTop: '5px',
  },
  pagingDown: {
    position: 'relative',
    left: 0,
  },
}));

export default function ShowMoreDrawer(props) {
  const { count, maxCount, filterKey, pageSize = 100, isFixed = true } = props;
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

  return (
    <Paper
      elevation={0}
      className={clsx(classes.pagingBar, {
        [classes.pagingBarShift]: drawerOpened,
      }, {[classes.pagingDown]: !isFixed})}>
      <Typography variant="body2">
        Viewing first {count} of {maxCount}
      </Typography>
      <FilledButton
        data-test="showMoreResults"
        onClick={handleMore}
        className={classes.button}
        startIcon={<RefreshIcon />}>
        Load more
      </FilledButton>
    </Paper>
  );
}
