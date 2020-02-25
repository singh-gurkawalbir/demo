// import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { makeStyles, Typography } from '@material-ui/core';
import * as selectors from '../../../reducers';
// import actions from '../../../actions';
// import CloseIcon from '../../icons/CloseIcon';
import IconTextButton from '../../IconTextButton';
import ArrowRightIcon from '../../icons/ArrowRightIcon';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(-2, -1, 2, -2),
    backgroundColor: theme.palette.common.white,
  },
  banner: {
    display: 'flex',
    margin: theme.spacing(-1, -1, 0, -1),
    padding: theme.spacing(2, 3),
    // border: `solid 1px ${theme.palette.primary.light}`,
    alignItems: 'center',
    backgroundColor: theme.palette.text.secondary,
  },
  textColor: {
    color: theme.palette.common.white,
  },
  sandboxBanner: {
    // border: `solid 1px ${theme.palette.sandbox.dark}`,
  },
  sandboxButton: {
    // backgroundColor: theme.palette.sandbox.dark,
    borderColor: theme.palette.sandbox.dark,
    // color: theme.palette.sandbox.contrastText,
    '&:hover': {
      borderColor: theme.palette.sandbox.dark,
      // backgroundColor: theme.palette.sandbox.light,
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
    fontWeight: 'bold',
    color: theme.palette.common.white,
  },
}));

export default function WelcomeBanner() {
  const classes = useStyles();
  // const dispatch = useDispatch();
  const environment = useSelector(
    state => selectors.userPreferences(state).environment
  );
  const isSandbox = environment === 'sandbox';
  // const handleClose = useCallback(() => dispatch(actions.toggleBanner()), [
  //   dispatch,
  // ]);

  return (
    <div className={classes.root}>
      <div
        className={clsx(classes.banner, {
          [classes.sandboxBanner]: isSandbox,
        })}>
        <div className={classes.welcomeText}>
          <Typography variant="h4" className={classes.textColor}>
            Welcome to our new experience (beta)!
          </Typography>
          <Typography variant="body2" className={classes.textColor}>
            We’ve added a lot of{' '}
            <a
              className={classes.emailLink}
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.celigo.com/whats-new/new-look">
              improvements and features.
            </a>{' '}
            Let us know what you think at{' '}
            <a
              className={classes.emailLink}
              target="_blank"
              rel="noopener noreferrer"
              href="mailto:product_feedback@celigo.com">
              product_feedback@celigo.com
            </a>
          </Typography>
        </div>
        <IconTextButton
          className={clsx(classes.textColor, {
            [classes.sandboxButton]: isSandbox,
          })}
          component="a"
          href="/"
          variant="outlined">
          Take me back <ArrowRightIcon />
        </IconTextButton>
        {/*
        <IconButton onClick={handleClose} className={classes.textColor}>
          <CloseIcon />
        </IconButton>
        */}
      </div>
    </div>
  );
}
