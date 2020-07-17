import { makeStyles, Paper, Button, Snackbar, Typography } from '@material-ui/core';
import React, { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import actions from '../../actions';
import * as selectors from '../../reducers';

const useStyles = makeStyles(theme => ({
  snackbarWrapper: {
    background: 'transparent',
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing(1),
    wordBreak: 'break-word',
  },
  wrapper: {
    padding: 12,
    maxWidth: 324,
    display: 'flex',

    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    '& > p': {
      fontSize: 14,
    }
  },
}));

export default function NetworkSnackbar() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const errors = useSelector(state => selectors.commsErrors(state), shallowEqual);
  const handleClearComms = useCallback(() => {
    dispatch(actions.clearComms());
  }, [dispatch]);

  if (!errors) {
    return null;
  }
  // console.log(errors);

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open
      className={classes.snackbarWrapper}>
      <div className={classes.root}>
        <Paper className={classes.wrapper}>
          {Object.keys(errors).map(key => (
            <Typography key={key} color="error">{errors[key]}</Typography>
          ))}
          <Button
            data-test="dismissNetworkSnackbar"
            variant="contained"
            color="primary"
            onClick={handleClearComms}>
            Dismiss
          </Button>
        </Paper>
      </div>
    </Snackbar>
  );
}
