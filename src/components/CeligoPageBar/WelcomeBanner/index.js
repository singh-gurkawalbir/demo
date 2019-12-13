import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { makeStyles, Typography, IconButton } from '@material-ui/core';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import IconTextButton from '../../IconTextButton';
import CloseIcon from '../../icons/CloseIcon';
import ArrowRightIcon from '../../icons/ArrowRightIcon';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(-2, -1, 2, -2),
    backgroundColor: theme.palette.common.white,
  },
  banner: {
    display: 'flex',
    padding: theme.spacing(1, 0, 1, 3),
    border: `solid 1px ${theme.palette.primary.light}`,
    alignItems: 'center',
  },
  sandboxBanner: {
    border: `solid 1px ${theme.palette.sandbox.dark}`,
  },
  sandboxButton: {
    backgroundColor: theme.palette.sandbox.dark,
    borderColor: theme.palette.sandbox.dark,
    color: theme.palette.sandbox.contrastText,
    '&:hover': {
      borderColor: theme.palette.sandbox.dark,
      backgroundColor: theme.palette.sandbox.light,
    },
  },
  welcomeText: {
    flexGrow: 1,
  },
  feedback: {
    marginRight: theme.spacing(2),
    marginTop: 3,
  },
  emailLink: {
    color: theme.palette.text.primary,
  },
}));

export default function WelcomeBanner() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const environment = useSelector(
    state => selectors.userPreferences(state).environment
  );
  const isSandbox = environment === 'sandbox';
  const handleClose = useCallback(() => dispatch(actions.toggleBanner()), [
    dispatch,
  ]);

  return (
    <div className={classes.root}>
      <div
        className={clsx(classes.banner, {
          [classes.sandboxBanner]: isSandbox,
        })}>
        <div className={classes.welcomeText}>
          <Typography variant="h5">Welcome to the new io!</Typography>
          <Typography variant="body2">
            We’ve got much more in store and welcome your feedback!
          </Typography>
        </div>
        <Typography className={classes.feedback}>
          Send feedback to{' '}
          <a
            className={classes.emailLink}
            target="_blank"
            rel="noopener noreferrer"
            href="mailto:product_feedback@celigo.com">
            product_feedback@celigo.com
          </a>
        </Typography>
        <IconTextButton
          className={clsx({ [classes.sandboxButton]: isSandbox })}
          component="a"
          href="/"
          variant="outlined"
          color="primary">
          Switch back <ArrowRightIcon />
        </IconTextButton>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </div>
    </div>
  );
}
