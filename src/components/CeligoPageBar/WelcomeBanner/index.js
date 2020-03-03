// import { useCallback } from 'react';
import clsx from 'clsx';
import { makeStyles, Typography } from '@material-ui/core';
// import actions from '../../../actions';
// import CloseIcon from '../../icons/CloseIcon';
import IconTextButton from '../../IconTextButton';
import ArrowRightIcon from '../../icons/ArrowRightIcon';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(-3, -1, 2, -2),
    backgroundColor: theme.palette.common.white,
  },
  banner: {
    display: 'flex',
    margin: theme.spacing(-1, -1, 0, -1),
    padding: theme.spacing(2, 3),
    // border: `solid 1px ${theme.palette.primary.light}`,
    alignItems: 'center',
    backgroundColor: theme.palette.background.drawer2,
  },
  textColor: {
    color: theme.palette.common.white,
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
  // const handleClose = useCallback(() => dispatch(actions.toggleBanner()), [
  //   dispatch,
  // ]);

  return (
    <div className={classes.root}>
      <div className={clsx(classes.banner)}>
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
          className={clsx(classes.textColor)}
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
